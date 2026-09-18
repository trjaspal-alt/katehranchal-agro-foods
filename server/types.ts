export interface ServerOrderItem {
  productId: string;
  variationId: string;
  name: string;
  slug: string;
  sku: string;
  packSize: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  hsnCode: string | null;
  taxRate: number | null;
  shippingWeight: number | null;
  primaryImage: string;
}

export interface CustomerDetails {
  fullName: string;
  phone: string;
  email: string;
}

export interface ShippingAddressData {
  fullName: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  pinCode: string;
  country: string;
  addressType: 'Home' | 'Work';
}

export type PaymentStatus =
  | 'Pending'
  | 'Processing'
  | 'Paid'
  | 'Failed'
  | 'Cancelled'
  | 'Refunded';

export type FulfilmentStatus =
  | 'Order Received'
  | 'Confirmed'
  | 'Preparing'
  | 'Packed'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled'
  | 'Returned'
  | 'Refunded';

export interface OrderAuditLog {
  timestamp: string;
  status: string;
  note: string;
}

export interface ServerOrder {
  id: string;
  orderNumber: string;
  createdAt: string;
  updatedAt: string;
  customer: CustomerDetails;
  shippingAddress: ShippingAddressData;
  billingAddress: ShippingAddressData;
  items: ServerOrderItem[];
  subtotal: number;
  discountAmount: number;
  couponCode: string | null;
  taxAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  deliveryCharge: number;
  totalAmount: number;
  currency: 'INR';
  paymentProvider: 'test_gateway' | 'razorpay' | 'cashfree' | 'payu';
  paymentStatus: PaymentStatus;
  fulfilmentStatus: FulfilmentStatus;
  gatewayOrderId?: string;
  gatewayPaymentId?: string;
  gatewaySignature?: string;
  isTestOrder: boolean;
  trackingNumber?: string;
  courierPartner?: string;
  customerNotes?: string;
  internalNotes?: string;
  history: OrderAuditLog[];
}

export interface LaunchReadinessItem {
  id: string;
  title: string;
  category: 'Products & Variations' | 'Taxation & Regulatory' | 'Shipping & Logistics' | 'Payment Gateway' | 'Policies & Legal' | 'Infrastructure & Security';
  status: 'Ready' | 'Missing / Incomplete' | 'Pending Verification';
  severity: 'CRITICAL_BLOCKER' | 'REQUIRED' | 'RECOMMENDED';
  description: string;
  remedyAction: string;
}

export interface ShippingQuote {
  pinCode: string;
  isServiceable: boolean;
  zone: string | null;
  charge: number | null;
  estimatedDeliveryTimeline: string | null;
  isConfigured: boolean;
  notice: string;
}

export interface EmailTemplatePayload {
  templateId: string;
  recipientEmail: string;
  recipientName: string;
  orderNumber?: string;
  subject: string;
  htmlContent: string;
  textContent: string;
}
