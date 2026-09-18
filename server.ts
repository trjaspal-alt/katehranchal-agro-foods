import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

import { serverStore } from './server/store';
import { paymentManager } from './server/paymentGateway';
import { calculateShippingQuote, CENTRAL_SHIPPING_CONFIG } from './server/shipping';
import { calculateOrderTaxes } from './server/tax';
import { inventoryEngine } from './server/inventory';
import { validateCoupon } from './server/coupons';
import { getLaunchSafetyGateReport } from './server/readiness';
import { TRANSACTIONAL_EMAIL_TEMPLATES } from './server/emails';
import { ServerOrder, ShippingAddressData } from './server/types';
import { Product, ProductVariation } from './src/types';

// Import central product catalogue (Single Source of Truth)
import { CATALOG_PRODUCTS, isProductPurchasable, getMissingCommercialFields } from './src/data/products';

dotenv.config();

const app = express();
const PORT = 3000;
const IS_DEV = process.env.NODE_ENV !== 'production';
const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY || 'kaf_admin_demo_2026';

// --- Security & Sanitation Middlewares ---
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Security Headers
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Simple In-Memory Rate Limiter for sensitive endpoints
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
function rateLimitSensitive(maxRequests: number, windowMs: number) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const key = `${req.path}_${ip}`;
    const now = Date.now();
    const entry = rateLimitMap.get(key);

    if (!entry || entry.resetTime < now) {
      rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
      return next();
    }

    if (entry.count >= maxRequests) {
      res.status(429).json({
        error: 'Too many requests. Please wait before retrying your action.',
      });
      return;
    }

    entry.count += 1;
    return next();
  };
}

// Admin Authorization Middleware
function requireAdminAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'] || req.headers['x-admin-key'];
  if (
    authHeader === ADMIN_SECRET_KEY ||
    authHeader === `Bearer ${ADMIN_SECRET_KEY}`
  ) {
    return next();
  }
  res.status(401).json({ error: 'Unauthorized: Administrative access token required.' });
}

// ==========================================
// 1. PUBLIC API ROUTES
// ==========================================

// Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'operational',
    service: 'Katehranchal Agro Foods Commerce Server',
    environment: IS_DEV ? 'development' : 'production',
    paymentMode: 'Test Gateway (Development)',
    timestamp: new Date().toISOString(),
  });
});

// Launch Safety Gate Report
app.get('/api/readiness', (req: Request, res: Response) => {
  const report = getLaunchSafetyGateReport();
  res.json(report);
});

// Central Products with Commerce Readiness
app.get('/api/products', (req: Request, res: Response) => {
  const results = CATALOG_PRODUCTS.map((p: Product) => {
    const purchasable = isProductPurchasable(p);
    const missing = getMissingCommercialFields(p);
    return {
      id: p.id,
      slug: p.slug,
      name: p.name,
      category: p.category,
      categoryLabel: p.categoryLabel,
      shortDescription: p.shortDescription,
      primaryImage: p.primaryImage,
      galleryImages: p.galleryImages,
      variations: p.variations,
      packOptions: p.packOptions,
      isPurchasable: purchasable,
      missingFieldsCount: missing.length,
      commercialStatus: purchasable
        ? 'Purchasable'
        : 'Currently Unavailable (Commercial Data Pending)',
    };
  });
  res.json(results);
});

// Shipping PIN-Code Quote Calculation
app.post('/api/shipping/quote', (req: Request, res: Response) => {
  const { pinCode, cartWeightGrams, cartSubtotal } = req.body;
  if (!pinCode) {
    return res.status(400).json({ error: 'Postal PIN code is required.' });
  }
  const quote = calculateShippingQuote({
    pinCode: String(pinCode),
    cartWeightGrams: Number(cartWeightGrams) || 0,
    cartSubtotal: Number(cartSubtotal) || 0,
  });
  return res.json(quote);
});

// Cart Validation & Server Recalculation
app.post('/api/cart/validate', (req: Request, res: Response) => {
  const { items, couponCode, shippingState, pinCode } = req.body;

  if (!Array.isArray(items)) {
    return res.status(400).json({ error: 'Invalid cart payload format.' });
  }

  let calculatedSubtotal = 0;
  let totalWeightGrams = 0;
  const validatedItems: any[] = [];
  const issues: string[] = [];

  for (const item of items) {
    const product = CATALOG_PRODUCTS.find((p: Product) => p.id === item.productId || p.slug === item.slug);
    if (!product) {
      issues.push(`Product identifier "${item.productId}" is not recognized in official catalogue.`);
      continue;
    }

    if (product.productStatus !== 'available') {
      issues.push(`"${product.name}" is not available for purchase.`);
      continue;
    }

    // Find variation
    const variation =
      product.variations.find((v: ProductVariation) => v.id === item.packOption?.id || v.id === item.variationId) ||
      product.variations[0];

    // Check if purchasable
    const purchasable = isProductPurchasable(product, variation);
    if (!purchasable) {
      issues.push(
        `"${product.name}" cannot be purchased because commercial specifications (price, SKU, or stock) have not been released by store management.`
      );
      continue;
    }

    const officialPrice = variation.price!;
    const requestedQty = Math.max(1, Math.min(10, Number(item.quantity) || 1));
    const itemSubtotal = officialPrice * requestedQty;

    calculatedSubtotal += itemSubtotal;
    totalWeightGrams += (variation.shippingWeight || 500) * requestedQty;

    validatedItems.push({
      productId: product.id,
      variationId: variation.id,
      name: product.name,
      slug: product.slug,
      sku: variation.sku,
      packSize: variation.packSize,
      quantity: requestedQty,
      unitPrice: officialPrice,
      totalPrice: itemSubtotal,
      hsnCode: variation.hsnCode,
      taxRate: variation.taxRate,
      shippingWeight: variation.shippingWeight,
      primaryImage: product.primaryImage,
    });
  }

  // Coupon validation on server
  let discountAmount = 0;
  let appliedCoupon: string | null = null;
  if (couponCode) {
    const couponResult = validateCoupon({
      code: String(couponCode),
      cartSubtotal: calculatedSubtotal,
      cartItems: validatedItems,
    });
    if (couponResult.isValid) {
      discountAmount = couponResult.discountAmount;
      appliedCoupon = couponResult.code;
    }
  }

  // Taxes on server
  const taxResult = calculateOrderTaxes({
    subtotal: Math.max(0, calculatedSubtotal - discountAmount),
    shippingState: shippingState || 'Uttar Pradesh',
    items: validatedItems.map((i) => ({
      sku: i.sku,
      price: i.unitPrice,
      quantity: i.quantity,
      taxRate: i.taxRate,
      hsnCode: i.hsnCode,
    })),
  });

  // Shipping on server
  const shippingQuote = pinCode
    ? calculateShippingQuote({
        pinCode: String(pinCode),
        cartWeightGrams: totalWeightGrams,
        cartSubtotal: calculatedSubtotal,
      })
    : null;

  const deliveryCharge = shippingQuote?.charge || 0;
  const totalAmount = Math.max(0, calculatedSubtotal - discountAmount + taxResult.totalTax + deliveryCharge);

  return res.json({
    isValid: issues.length === 0 && validatedItems.length > 0,
    issues,
    items: validatedItems,
    subtotal: calculatedSubtotal,
    discountAmount,
    couponCode: appliedCoupon,
    taxes: taxResult,
    shippingQuote,
    deliveryCharge,
    totalAmount,
    currency: 'INR',
  });
});

// Checkout: Create Internal Pending Order
app.post(
  '/api/checkout/create-order',
  rateLimitSensitive(20, 60000),
  async (req: Request, res: Response) => {
    try {
      const { customer, shippingAddress, billingAddress, items, couponCode, customerNotes, isTestSimulation } = req.body;

      // 1. Validate Customer Contact
      if (!customer?.fullName?.trim() || !customer?.phone?.trim() || !customer?.email?.trim()) {
        return res.status(400).json({ error: 'Please provide complete name, phone number, and email.' });
      }

      // 2. Validate Indian Mobile
      const cleanPhone = customer.phone.replace(/\D/g, '');
      if (cleanPhone.length !== 10) {
        return res.status(400).json({ error: 'A valid 10-digit Indian mobile number is required.' });
      }

      // 3. Validate Address
      if (!shippingAddress?.addressLine1?.trim() || !shippingAddress?.city?.trim() || !shippingAddress?.state?.trim() || !shippingAddress?.pinCode?.trim()) {
        return res.status(400).json({ error: 'Please provide full shipping address details.' });
      }

      if (!/^[1-9][0-9]{5}$/.test(shippingAddress.pinCode.trim())) {
        return res.status(400).json({ error: 'Postal PIN code must be a valid 6-digit Indian PIN code.' });
      }

      // 4. Validate Items Against Central Product Catalogue
      if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'Your cart contains no items to order.' });
      }

      let subtotal = 0;
      const orderItems: any[] = [];

      for (const item of items) {
        const product = CATALOG_PRODUCTS.find((p: Product) => p.id === item.productId || p.slug === item.slug);
        if (!product) {
          return res.status(400).json({
            error: `Product "${item.name || item.productId}" is not recognized in official catalogue.`,
          });
        }

        const variation =
          product.variations.find((v: ProductVariation) => v.id === item.variationId || v.id === item.packOption?.id) ||
          product.variations[0];

        // CRITICAL CHECK: Enforce commercial readiness!
        // In test mode simulation, if owner is testing checkout flow with test item, we verify accordingly
        const purchasable = isProductPurchasable(product, variation);
        if (!purchasable && !isTestSimulation) {
          return res.status(400).json({
            error: `Cannot proceed to checkout: "${product.name}" has missing commercial data (price, SKU, or stock) and is strictly non-purchasable until official release.`,
          });
        }

        const unitPrice = variation.price ?? (isTestSimulation ? (item.unitPrice || 500) : 0);
        const qty = Math.max(1, Number(item.quantity) || 1);
        const itemTotal = unitPrice * qty;
        subtotal += itemTotal;

        orderItems.push({
          productId: product.id,
          variationId: variation.id,
          name: product.name,
          slug: product.slug,
          sku: variation.sku || 'KAF-TEST-SKU',
          packSize: variation.packSize || 'Standard Pack',
          quantity: qty,
          unitPrice,
          totalPrice: itemTotal,
          hsnCode: variation.hsnCode,
          taxRate: variation.taxRate,
          shippingWeight: variation.shippingWeight,
          primaryImage: product.primaryImage,
        });
      }

      // Tax calculation
      const taxResult = calculateOrderTaxes({
        subtotal,
        shippingState: shippingAddress.state,
        items: orderItems.map((i) => ({
          sku: i.sku,
          price: i.unitPrice,
          quantity: i.quantity,
          taxRate: i.taxRate,
          hsnCode: i.hsnCode,
        })),
      });

      // Shipping calculation
      const shippingQuote = calculateShippingQuote({
        pinCode: shippingAddress.pinCode,
        cartWeightGrams: 1000,
        cartSubtotal: subtotal,
      });

      const deliveryCharge = shippingQuote.charge || 0;
      const totalAmount = subtotal + taxResult.totalTax + deliveryCharge;

      const orderId = `ord_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const orderNumber = `KAF-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

      const order: ServerOrder = {
        id: orderId,
        orderNumber,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        customer: {
          fullName: customer.fullName.trim(),
          phone: cleanPhone,
          email: customer.email.trim().toLowerCase(),
        },
        shippingAddress: {
          ...shippingAddress,
          country: 'India',
        },
        billingAddress: billingAddress || {
          ...shippingAddress,
          country: 'India',
        },
        items: orderItems,
        subtotal,
        discountAmount: 0,
        couponCode: null,
        taxAmount: taxResult.totalTax,
        cgst: taxResult.cgst,
        sgst: taxResult.sgst,
        igst: taxResult.igst,
        deliveryCharge,
        totalAmount,
        currency: 'INR',
        paymentProvider: 'test_gateway',
        paymentStatus: 'Pending',
        fulfilmentStatus: 'Order Received',
        isTestOrder: true,
        customerNotes: customerNotes?.trim(),
        history: [
          {
            timestamp: new Date().toISOString(),
            status: 'Pending / Order Received',
            note: 'Order initiated at checkout. Awaiting payment gateway authorization.',
          },
        ],
      };

      // Save order in persistent store
      serverStore.saveOrder(order);

      // Reserve inventory
      inventoryEngine.reserveStock(
        order.id,
        orderItems.map((i) => ({ variationId: i.variationId, quantity: i.quantity }))
      );

      serverStore.log('ORDER_CREATED', `Internal order ${orderNumber} created for ₹${totalAmount}`, {
        orderId,
        orderNumber,
        customerEmail: order.customer.email,
      });

      return res.status(201).json({
        success: true,
        orderId: order.id,
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        currency: 'INR',
        order,
      });
    } catch (err: any) {
      console.error('[CreateOrder Error]', err);
      return res.status(500).json({ error: 'Server error creating order. Please retry.' });
    }
  }
);

// Payment Gateway: Initialize Gateway Order
app.post(
  '/api/payments/create-gateway-order',
  rateLimitSensitive(20, 60000),
  async (req: Request, res: Response) => {
    try {
      const { orderId } = req.body;
      const order = serverStore.getOrderById(orderId);
      if (!order) {
        return res.status(404).json({ error: 'Order reference not found.' });
      }

      if (order.paymentStatus === 'Paid') {
        return res.status(400).json({ error: 'This order has already been verified and paid.' });
      }

      const adapter = paymentManager.getActiveAdapter();
      const gatewayOrder = await adapter.createPaymentOrder({
        order,
        callbackUrl: `${req.protocol}://${req.get('host')}/api/payments/verify`,
      });

      order.gatewayOrderId = gatewayOrder.gatewayOrderId;
      order.paymentStatus = 'Processing';
      serverStore.saveOrder(order);

      return res.json({
        success: true,
        gatewayOrder,
      });
    } catch (err: any) {
      console.error('[CreateGatewayOrder Error]', err);
      return res.status(500).json({ error: err.message || 'Payment gateway initialization failed.' });
    }
  }
);

// Payment Gateway: Verify Payment (Cryptographic Server-Side Verification)
app.post(
  '/api/payments/verify',
  rateLimitSensitive(20, 60000),
  async (req: Request, res: Response) => {
    try {
      const { orderId, gatewayOrderId, gatewayPaymentId, gatewaySignature } = req.body;

      if (!orderId || !gatewayOrderId || !gatewayPaymentId || !gatewaySignature) {
        return res.status(400).json({
          error: 'Missing required payment verification tokens.',
        });
      }

      const order = serverStore.getOrderById(orderId);
      if (!order) {
        return res.status(404).json({ error: 'Order not found.' });
      }

      if (order.paymentStatus === 'Paid') {
        return res.json({
          verified: true,
          status: 'Paid',
          message: 'Payment has already been confirmed and processed.',
          order,
        });
      }

      const adapter = paymentManager.getActiveAdapter();
      const verification = await adapter.verifyPaymentSignature({
        orderId,
        gatewayOrderId,
        gatewayPaymentId,
        gatewaySignature,
      });

      if (!verification.isValid) {
        serverStore.updateOrderStatus(orderId, {
          paymentStatus: 'Failed',
          note: `Payment signature verification failed: ${verification.message}`,
        });
        inventoryEngine.releaseReservation(orderId);

        serverStore.log('PAYMENT_FAILED', `Signature verification failed for order ${order.orderNumber}`);

        return res.status(400).json({
          verified: false,
          status: 'Failed',
          message: 'Payment signature verification failed on server. No funds captured.',
        });
      }

      // Mark Order Paid
      serverStore.updateOrderStatus(orderId, {
        paymentStatus: 'Paid',
        fulfilmentStatus: 'Confirmed',
        gatewayPaymentId,
        note: `Payment confirmed and cryptographically verified via ${adapter.providerName}. Signature check: PASSED.`,
      });

      // Commit inventory reduction
      inventoryEngine.commitDeduction(
        orderId,
        order.items.map((i) => ({ variationId: i.variationId, quantity: i.quantity }))
      );

      // Trigger Transactional Email template (Sandbox / Preview Mode)
      const emailPayload = TRANSACTIONAL_EMAIL_TEMPLATES.paymentConfirmed(order);
      serverStore.log('EMAIL_SENT_SANDBOX', `Payment confirmation email generated for ${order.customer.email}`, {
        templateId: emailPayload.templateId,
        recipient: emailPayload.recipientEmail,
        subject: emailPayload.subject,
      });

      serverStore.log('ORDER_PAID', `Order ${order.orderNumber} successfully marked Paid.`);

      const updatedOrder = serverStore.getOrderById(orderId);
      return res.json({
        verified: true,
        status: 'Paid',
        orderNumber: order.orderNumber,
        message: 'Payment verified successfully on server. Order confirmed.',
        order: updatedOrder,
      });
    } catch (err: any) {
      console.error('[VerifyPayment Error]', err);
      return res.status(500).json({ error: 'Payment verification failed due to server error.' });
    }
  }
);

// Development Test Helper: Simulate Safe Payment Success or Failure
app.post('/api/payments/test-simulate-payment', async (req: Request, res: Response) => {
  try {
    const { orderId, simulateFailure } = req.body;
    const order = serverStore.getOrderById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    const testAdapter = paymentManager.getTestAdapter();
    const gatewayOrderId = order.gatewayOrderId || `order_test_${Date.now()}`;
    const gatewayPaymentId = `pay_test_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    let gatewaySignature = testAdapter.generateTestSignature(gatewayOrderId, gatewayPaymentId);
    if (simulateFailure) {
      gatewaySignature = 'corrupted_test_signature_invalid';
    }

    // Call standard verification endpoint internally
    const verification = await testAdapter.verifyPaymentSignature({
      orderId,
      gatewayOrderId,
      gatewayPaymentId,
      gatewaySignature,
    });

    if (!verification.isValid) {
      serverStore.updateOrderStatus(orderId, {
        paymentStatus: 'Failed',
        note: 'Simulated payment test failure triggered by tester.',
      });
      inventoryEngine.releaseReservation(orderId);
      return res.json({
        verified: false,
        status: 'Failed',
        message: 'Simulated payment failed (as requested). Reservation safely released.',
        order: serverStore.getOrderById(orderId),
      });
    }

    serverStore.updateOrderStatus(orderId, {
      paymentStatus: 'Paid',
      fulfilmentStatus: 'Confirmed',
      gatewayPaymentId,
      note: 'Simulated payment test authorized with valid HMAC signature in Test Mode.',
    });

    inventoryEngine.commitDeduction(
      orderId,
      order.items.map((i) => ({ variationId: i.variationId, quantity: i.quantity }))
    );

    return res.json({
      verified: true,
      status: 'Paid',
      orderNumber: order.orderNumber,
      message: 'Test payment verified with valid HMAC-SHA256 signature.',
      order: serverStore.getOrderById(orderId),
    });
  } catch (err: any) {
    console.error('[SimulatePayment Error]', err);
    return res.status(500).json({ error: 'Test simulation failed.' });
  }
});

// Gateway Webhook Handler with Idempotency & Signature Check
app.post('/api/payments/webhook', async (req: Request, res: Response) => {
  try {
    const signature = req.headers['x-razorpay-signature'] || req.headers['x-webhook-signature'];
    const rawBody = JSON.stringify(req.body);

    const adapter = paymentManager.getActiveAdapter();
    if (typeof signature === 'string' && !adapter.verifyWebhookSignature(rawBody, signature)) {
      serverStore.log('WEBHOOK_REJECTED', 'Webhook rejected due to invalid cryptographic signature.');
      return res.status(400).json({ error: 'Invalid webhook signature.' });
    }

    const eventId = req.body?.event_id || req.body?.id || `wh_${Date.now()}`;
    if (serverStore.isWebhookProcessed(eventId)) {
      // Idempotency: Return 200 OK immediately without double-processing
      return res.json({ received: true, idempotent: true });
    }

    serverStore.markWebhookProcessed(eventId);

    const eventType = req.body?.event;
    const orderId = req.body?.payload?.payment?.entity?.notes?.order_id || req.body?.orderId;

    if (orderId) {
      if (eventType === 'payment.captured' || eventType === 'order.paid') {
        serverStore.updateOrderStatus(orderId, {
          paymentStatus: 'Paid',
          fulfilmentStatus: 'Confirmed',
          note: `Payment confirmed via webhook event: ${eventType}`,
        });
      } else if (eventType === 'payment.failed') {
        serverStore.updateOrderStatus(orderId, {
          paymentStatus: 'Failed',
          note: `Payment failure logged via webhook event: ${eventType}`,
        });
        inventoryEngine.releaseReservation(orderId);
      }
    }

    return res.json({ received: true });
  } catch (err: any) {
    console.error('[Webhook Error]', err);
    return res.status(500).json({ error: 'Webhook processing error.' });
  }
});

// Fetch Single Order Details (Customer Order Confirmation)
app.get('/api/orders/:id', (req: Request, res: Response) => {
  const order = serverStore.getOrderById(req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found.' });
  }
  // Sanitize internal notes for customer view
  const { internalNotes, ...safeOrder } = order;
  return res.json(safeOrder);
});

// Coming Soon Notification Subscriptions
app.post('/api/subscriptions', (req: Request, res: Response) => {
  const { email, itemId, itemName } = req.body;
  if (!email || !email.includes('@') || !itemId) {
    return res.status(400).json({ error: 'Valid email and item ID are required.' });
  }
  serverStore.addSubscription({ email, itemId, itemName: itemName || itemId });
  serverStore.log('NOTIFICATION_SUBSCRIPTION', `Email subscription registered for ${email} on ${itemName}`);
  return res.json({ success: true, message: 'Notification subscription recorded.' });
});

// ==========================================
// 2. PROTECTED ADMIN MANAGEMENT API
// ==========================================

app.post('/api/admin/auth', (req: Request, res: Response) => {
  const { passkey } = req.body;
  if (passkey === ADMIN_SECRET_KEY) {
    return res.json({
      success: true,
      token: ADMIN_SECRET_KEY,
      role: 'Store Administrator',
    });
  }
  return res.status(401).json({ error: 'Invalid administrative security key.' });
});

app.get('/api/admin/orders', requireAdminAuth, (req: Request, res: Response) => {
  const orders = serverStore.getOrders();
  res.json(orders);
});

app.patch('/api/admin/orders/:id', requireAdminAuth, (req: Request, res: Response) => {
  const { paymentStatus, fulfilmentStatus, trackingNumber, courierPartner, internalNotes, note } = req.body;
  const updated = serverStore.updateOrderStatus(req.params.id, {
    paymentStatus,
    fulfilmentStatus,
    trackingNumber,
    courierPartner,
    internalNotes,
    note: note || 'Status modified via Administrator Console.',
  });

  if (!updated) {
    return res.status(404).json({ error: 'Order not found.' });
  }

  // Trigger relevant transactional email in sandbox mode
  if (fulfilmentStatus === 'Shipped') {
    TRANSACTIONAL_EMAIL_TEMPLATES.orderShipped(updated);
  } else if (fulfilmentStatus === 'Delivered') {
    TRANSACTIONAL_EMAIL_TEMPLATES.orderDelivered(updated);
  } else if (fulfilmentStatus === 'Cancelled') {
    TRANSACTIONAL_EMAIL_TEMPLATES.orderCancelled(updated);
  }

  return res.json(updated);
});

app.get('/api/admin/audit-logs', requireAdminAuth, (req: Request, res: Response) => {
  res.json(serverStore.getAuditLogs());
});

app.get('/api/admin/subscriptions', requireAdminAuth, (req: Request, res: Response) => {
  res.json(serverStore.getSubscriptions());
});

app.get('/api/admin/emails/preview/:templateId', requireAdminAuth, (req: Request, res: Response) => {
  const { templateId } = req.params;
  const sampleOrder: ServerOrder = serverStore.getOrders()[0] || {
    id: 'ord_sample_demo',
    orderNumber: 'KAF-2026-1048',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    customer: {
      fullName: 'Rameshwar Verma',
      phone: '9450039346',
      email: 'customer@example.com',
    },
    shippingAddress: {
      fullName: 'Rameshwar Verma',
      phone: '9450039346',
      email: 'customer@example.com',
      addressLine1: 'Village Banshipur, Post Katehra',
      city: 'Amroha',
      state: 'Uttar Pradesh',
      pinCode: '244221',
      country: 'India',
      addressType: 'Home',
    },
    billingAddress: {
      fullName: 'Rameshwar Verma',
      phone: '9450039346',
      email: 'customer@example.com',
      addressLine1: 'Village Banshipur, Post Katehra',
      city: 'Amroha',
      state: 'Uttar Pradesh',
      pinCode: '244221',
      country: 'India',
      addressType: 'Home',
    },
    items: [
      {
        productId: 'desi-ghee',
        variationId: 'ghee-500ml',
        name: 'Internal Test Item',
        slug: 'desi-ghee',
        sku: 'KAF-GHEE-500',
        packSize: 'Test Pack',
        quantity: 1,
        unitPrice: 100,
        totalPrice: 100,
        hsnCode: null,
        taxRate: null,
        shippingWeight: 500,
        primaryImage: '/assets/products/desi-ghee.png',
      },
    ],
    subtotal: 100,
    discountAmount: 0,
    couponCode: null,
    taxAmount: 0,
    cgst: 0,
    sgst: 0,
    igst: 0,
    deliveryCharge: 0,
    totalAmount: 100,
    currency: 'INR',
    paymentProvider: 'test_gateway',
    paymentStatus: 'Paid',
    fulfilmentStatus: 'Confirmed',
    gatewayPaymentId: 'pay_test_preview_98127',
    isTestOrder: true,
    trackingNumber: 'DEL-IND-9281729',
    courierPartner: 'Delhivery Surface',
    history: [],
  };

  let payload;
  switch (templateId) {
    case 'order_received':
      payload = TRANSACTIONAL_EMAIL_TEMPLATES.orderReceived(sampleOrder);
      break;
    case 'payment_confirmed':
      payload = TRANSACTIONAL_EMAIL_TEMPLATES.paymentConfirmed(sampleOrder);
      break;
    case 'payment_failed':
      payload = TRANSACTIONAL_EMAIL_TEMPLATES.paymentFailed(sampleOrder);
      break;
    case 'order_confirmed':
      payload = TRANSACTIONAL_EMAIL_TEMPLATES.orderConfirmed(sampleOrder);
      break;
    case 'order_shipped':
      payload = TRANSACTIONAL_EMAIL_TEMPLATES.orderShipped(sampleOrder);
      break;
    case 'order_delivered':
      payload = TRANSACTIONAL_EMAIL_TEMPLATES.orderDelivered(sampleOrder);
      break;
    case 'order_cancelled':
      payload = TRANSACTIONAL_EMAIL_TEMPLATES.orderCancelled(sampleOrder);
      break;
    case 'refund_initiated':
      payload = TRANSACTIONAL_EMAIL_TEMPLATES.refundInitiated(sampleOrder, 100);
      break;
    case 'refund_completed':
      payload = TRANSACTIONAL_EMAIL_TEMPLATES.refundCompleted(sampleOrder, 100);
      break;
    case 'support_acknowledgement':
      payload = TRANSACTIONAL_EMAIL_TEMPLATES.supportAcknowledgement(
        'Rameshwar Verma',
        'customer@example.com',
        'Order Delivery Inquiry'
      );
      break;
    default:
      return res.status(404).send('Template not found');
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  return res.send(payload.htmlContent);
});

// Admin Test Generator: Create a verified test order to test dispatch workflow
app.post('/api/admin/create-test-order', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const orderId = `ord_test_${Date.now()}`;
    const orderNumber = `KAF-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`;
    const testOrder: ServerOrder = {
      id: orderId,
      orderNumber,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      customer: {
        fullName: 'Store Testing Account',
        phone: '9450039346',
        email: 'agro@Katehranchal.org',
      },
      shippingAddress: {
        fullName: 'Katehranchal Dispatch Office',
        phone: '9450039346',
        email: 'agro@Katehranchal.org',
        addressLine1: 'Katehranchal Agro Foods, Village Katehra',
        city: 'Amroha',
        state: 'Uttar Pradesh',
        pinCode: '244221',
        country: 'India',
        addressType: 'Work',
      },
      billingAddress: {
        fullName: 'Katehranchal Dispatch Office',
        phone: '9450039346',
        email: 'agro@Katehranchal.org',
        addressLine1: 'Katehranchal Agro Foods, Village Katehra',
        city: 'Amroha',
        state: 'Uttar Pradesh',
        pinCode: '244221',
        country: 'India',
        addressType: 'Work',
      },
      items: [
        {
          productId: 'prod-desi-ghee',
          variationId: 'ghee-500ml',
          name: 'Internal Test Item',
          slug: 'desi-ghee',
          sku: 'KAF-GHEE-TEST',
          packSize: 'Test Pack',
          quantity: 1,
          unitPrice: 100,
          totalPrice: 100,
          hsnCode: null,
          taxRate: null,
          shippingWeight: 500,
          primaryImage: '/assets/products/desi-ghee.png',
        },
      ],
      subtotal: 100,
      discountAmount: 0,
      couponCode: null,
      taxAmount: 0,
      cgst: 0,
      sgst: 0,
      igst: 0,
      deliveryCharge: 0,
      totalAmount: 100,
      currency: 'INR',
      paymentProvider: 'test_gateway',
      paymentStatus: 'Paid',
      fulfilmentStatus: 'Confirmed',
      gatewayPaymentId: `pay_test_${Date.now()}`,
      isTestOrder: true,
      history: [
        {
          timestamp: new Date().toISOString(),
          status: 'Test Order Created',
          note: 'Created via Administrator Test Generator.',
        },
        {
          timestamp: new Date().toISOString(),
          status: 'Payment Authorized (Test Gateway)',
          note: 'Cryptographic HMAC-SHA256 signature simulated successfully.',
        },
      ],
    };

    serverStore.saveOrder(testOrder);
    serverStore.log('TEST_ORDER_GENERATED', `Admin generated test order ${orderNumber} for workflow testing.`);

    const emailPayload = TRANSACTIONAL_EMAIL_TEMPLATES.paymentConfirmed(testOrder);
    serverStore.log('EMAIL_SENT_SANDBOX', `Test payment confirmed email generated for ${testOrder.customer.email}`, {
      templateId: emailPayload.templateId,
      recipient: emailPayload.recipientEmail,
    });

    return res.status(201).json({ success: true, order: testOrder });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to generate test order.' });
  }
});

// ==========================================
// 3. VITE MIDDLEWARE & STATIC ASSETS
// ==========================================

async function bootstrapServer() {
  if (IS_DEV) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Katehranchal Server] Running at http://0.0.0.0:${PORT} in ${IS_DEV ? 'development' : 'production'} mode.`);
  });
}

bootstrapServer().catch((err) => {
  console.error('[Bootstrap Error]', err);
  process.exit(1);
});
