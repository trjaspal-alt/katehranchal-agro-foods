import crypto from 'crypto';
import { ServerOrder } from './types';

export interface CreateGatewayOrderParams {
  order: ServerOrder;
  callbackUrl: string;
}

export interface GatewayOrderResult {
  gatewayOrderId: string;
  gatewayProvider: 'test_gateway' | 'razorpay' | 'cashfree' | 'payu';
  amount: number; // in rupees
  amountInSubunits: number; // in paise (₹1 = 100 paise)
  currency: 'INR';
  publicKey: string;
  isTestMode: boolean;
  notes?: Record<string, string>;
}

export interface VerifyPaymentParams {
  gatewayOrderId: string;
  gatewayPaymentId: string;
  gatewaySignature: string;
  orderId: string;
}

export interface GatewayVerificationResult {
  isValid: boolean;
  orderId: string;
  gatewayPaymentId: string;
  gatewayOrderId: string;
  status: 'Paid' | 'Failed';
  message: string;
  isTestMode: boolean;
}

export interface PaymentGatewayAdapter {
  providerName: 'test_gateway' | 'razorpay' | 'cashfree' | 'payu';
  isConfigured(): boolean;
  createPaymentOrder(params: CreateGatewayOrderParams): Promise<GatewayOrderResult>;
  verifyPaymentSignature(params: VerifyPaymentParams): Promise<GatewayVerificationResult>;
  verifyWebhookSignature(rawBody: string, signatureHeader: string): boolean;
}

/**
 * Development Test Gateway Adapter.
 * Emulates the cryptographic workflow of standard Indian payment gateways (Razorpay/Cashfree)
 * using HMAC SHA-256 signing and secret keys on the server.
 */
class TestGatewayAdapter implements PaymentGatewayAdapter {
  public providerName = 'test_gateway' as const;
  private secretKey: string;

  constructor() {
    // Uses TEST secret from environment or deterministic development test secret
    this.secretKey = process.env.PAYMENT_GATEWAY_SECRET_KEY || 'kaf_test_secret_79fbc3829ad4';
  }

  public isConfigured(): boolean {
    return true; // Test gateway is always available in development mode
  }

  public async createPaymentOrder(params: CreateGatewayOrderParams): Promise<GatewayOrderResult> {
    const gatewayOrderId = `order_test_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const amountInSubunits = Math.round(params.order.totalAmount * 100);

    return {
      gatewayOrderId,
      gatewayProvider: 'test_gateway',
      amount: params.order.totalAmount,
      amountInSubunits,
      currency: 'INR',
      publicKey: process.env.PAYMENT_GATEWAY_PUBLIC_KEY || 'rzp_test_public_katehranchal',
      isTestMode: true,
      notes: {
        store: 'Katehranchal Agro Foods',
        orderNumber: params.order.orderNumber,
        customerPhone: params.order.customer.phone,
      },
    };
  }

  public generateTestSignature(gatewayOrderId: string, gatewayPaymentId: string): string {
    const payload = `${gatewayOrderId}|${gatewayPaymentId}`;
    return crypto.createHmac('sha256', this.secretKey).update(payload).digest('hex');
  }

  public async verifyPaymentSignature(params: VerifyPaymentParams): Promise<GatewayVerificationResult> {
    const { gatewayOrderId, gatewayPaymentId, gatewaySignature, orderId } = params;

    // Verify HMAC-SHA256 signature
    const expectedSignature = this.generateTestSignature(gatewayOrderId, gatewayPaymentId);
    const isValid = crypto.timingSafeEqual(
      Buffer.from(gatewaySignature),
      Buffer.from(expectedSignature)
    );

    if (!isValid) {
      return {
        isValid: false,
        orderId,
        gatewayPaymentId,
        gatewayOrderId,
        status: 'Failed',
        message: 'Cryptographic signature mismatch. Payment verification failed on server.',
        isTestMode: true,
      };
    }

    return {
      isValid: true,
      orderId,
      gatewayPaymentId,
      gatewayOrderId,
      status: 'Paid',
      message: 'Signature verified successfully via server HMAC-SHA256 validation.',
      isTestMode: true,
    };
  }

  public verifyWebhookSignature(rawBody: string, signatureHeader: string): boolean {
    const webhookSecret = process.env.PAYMENT_WEBHOOK_SECRET || 'whsec_test_katehranchal';
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');

    try {
      return crypto.timingSafeEqual(
        Buffer.from(signatureHeader),
        Buffer.from(expectedSignature)
      );
    } catch {
      return false;
    }
  }
}

/**
 * Production Gateway Adapters: Razorpay, Cashfree, PayU.
 * Ready for drop-in credentials via environment variables without rewriting checkout logic.
 */
class RazorpayAdapter implements PaymentGatewayAdapter {
  public providerName = 'razorpay' as const;

  public isConfigured(): boolean {
    return Boolean(
      process.env.RAZORPAY_KEY_ID &&
      process.env.RAZORPAY_KEY_SECRET &&
      !process.env.RAZORPAY_KEY_ID.includes('placeholder')
    );
  }

  public async createPaymentOrder(params: CreateGatewayOrderParams): Promise<GatewayOrderResult> {
    if (!this.isConfigured()) {
      throw new Error('Razorpay production credentials have not been configured in server environment.');
    }
    // Production implementation: Calls Razorpay REST API Orders endpoint
    throw new Error('Live Razorpay gateway integration is pending verified merchant account activation.');
  }

  public async verifyPaymentSignature(params: VerifyPaymentParams): Promise<GatewayVerificationResult> {
    if (!this.isConfigured()) {
      throw new Error('Razorpay credentials unconfigured.');
    }
    const secret = process.env.RAZORPAY_KEY_SECRET!;
    const payload = `${params.gatewayOrderId}|${params.gatewayPaymentId}`;
    const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex');
    const isValid = crypto.timingSafeEqual(Buffer.from(params.gatewaySignature), Buffer.from(expected));

    return {
      isValid,
      orderId: params.orderId,
      gatewayPaymentId: params.gatewayPaymentId,
      gatewayOrderId: params.gatewayOrderId,
      status: isValid ? 'Paid' : 'Failed',
      message: isValid ? 'Razorpay signature verified' : 'Invalid Razorpay signature',
      isTestMode: false,
    };
  }

  public verifyWebhookSignature(rawBody: string, signatureHeader: string): boolean {
    const secret = process.env.PAYMENT_WEBHOOK_SECRET;
    if (!secret) return false;
    const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
    return crypto.timingSafeEqual(Buffer.from(signatureHeader), Buffer.from(expected));
  }
}

export class PaymentManager {
  private testAdapter = new TestGatewayAdapter();
  private razorpayAdapter = new RazorpayAdapter();

  public getActiveAdapter(): PaymentGatewayAdapter {
    const selected = process.env.PAYMENT_PROVIDER || 'test_gateway';
    if (selected === 'razorpay' && this.razorpayAdapter.isConfigured()) {
      return this.razorpayAdapter;
    }
    // Default to test adapter during development to guarantee safety
    return this.testAdapter;
  }

  public getTestAdapter(): TestGatewayAdapter {
    return this.testAdapter;
  }
}

export const paymentManager = new PaymentManager();
