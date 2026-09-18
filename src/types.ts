export type PageRoute =
  | 'home'
  | 'shop'
  | 'product-detail'
  | 'cart'
  | 'checkout'
  | 'account'
  | 'order-confirmation'
  | 'our-story'
  | 'coming-soon'
  | 'why-choose-us'
  | 'how-it-works'
  | 'faqs'
  | 'contact'
  | 'policy-shipping'
  | 'policy-returns'
  | 'policy-cancellation'
  | 'policy-privacy'
  | 'policy-terms'
  | 'policy-payment'
  | 'admin'
  | 'not-found';

export type ProductCategory =
  | 'all'
  | 'ghee'
  | 'mustard-oils'
  | 'grains'
  | 'desi-ghee'
  | 'black-mustard-oil'
  | 'yellow-mustard-oil'
  | 'natural-wheat';

export interface ProductVariation {
  id: string;
  sku: string | null;
  packSize: string | null;
  unit: string | null;
  price: number | null;
  mrp: number | null;
  stockState: 'in-stock' | 'out-of-stock' | 'unconfirmed' | null;
  inventoryQuantity: number | null;
  taxClass: string | null;
  taxRate: number | null;
  hsnCode: string | null;
  shippingWeight: number | null; // in grams
  packagingDimensions: { length?: number; width?: number; height?: number } | null;
  purchaseLimit: number | null;
  isDefault?: boolean;
}

// Backward compatibility alias for pack options
export interface ProductPackOption {
  id: string;
  sizeLabel: string;
  unitPrice: number | null;
  sku?: string | null;
  isDefault?: boolean;
}

export interface MissingCommercialField {
  key: string;
  label: string;
  category: 'Pricing & Pack Sizes' | 'Inventory & SKU' | 'Taxation & Regulatory' | 'Packaging & Shipping' | 'Testing & Origin';
  status: 'Pending Verification' | 'Missing';
  description: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  categoryLabel: string;
  shortDescription: string;
  description: string;
  extendedDescription?: string;
  suitableUses: string[];
  variations: ProductVariation[];
  // Retain packOptions for legacy helpers if needed
  packOptions: ProductPackOption[];
  availabilityState: 'Available Soon' | 'Catalogue Preview' | 'Available for Selection' | 'Coming Soon';
  productStatus: 'available' | 'coming-soon' | 'archived';
  featured: boolean;
  imageAlt: string;
  primaryImage: string;
  galleryImages: string[];
  
  // Commercial & Compliance fields (Explicit null when not yet supplied)
  ingredients: string | null;
  processingMethod: string | null;
  storageInstructions: string | null;
  shelfLife: string | null;
  countryOfOrigin: string | null;
  placeOfOrigin: string | null;
  manufacturerInfo: string | null;
  packerInfo: string | null;
  fssaiLicenseNumber: string | null;
  certifications: string[] | null;
  laboratoryReports: string | null;
  deliveryAreas: string[] | null;
  deliveryTimelines: string | null;
  returnEligibility: string | null;

  // SEO & Structured data
  seoTitle: string;
  seoDescription: string;
  structuredData?: Record<string, unknown>;

  // Optional legacy fields for backward compatibility
  usageGuidelines?: string;
  composition?: string;
  shippingInfo?: string;
}

export interface ComingSoonItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  intendedPurpose: string;
  status: 'Planned Addition' | 'Sourcing & Quality Evaluation' | 'Domestic & Ceremonial Essential';
  description: string;
  suitableUses: string[];
  domesticUseOnlyNotice?: string;
  primaryImage: string;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  slug: string;
  packOption: ProductPackOption;
  quantity: number;
  unitPrice: number;
  primaryImage: string;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  pinCode: string;
  addressType: 'Home' | 'Work';
}

export interface OrderRecord {
  orderId: string;
  orderNumber?: string;
  createdAt: string;
  updatedAt?: string;
  items: CartItem[];
  subtotal: number;
  taxAmount: number;
  cgst?: number;
  sgst?: number;
  igst?: number;
  deliveryCharge: number;
  discountAmount?: number;
  couponCode?: string | null;
  totalAmount: number;
  currency?: string;
  shippingAddress: ShippingAddress;
  billingAddress?: ShippingAddress;
  paymentMethod: string;
  paymentProvider?: string;
  gatewayOrderId?: string;
  gatewayPaymentId?: string;
  gatewaySignature?: string;
  isTestOrder?: boolean;
  trackingNumber?: string;
  courierPartner?: string;
  paymentStatus:
    | 'Awaiting Gateway Initiation'
    | 'Payment Pending'
    | 'Payment Verified'
    | 'Payment Failed'
    | 'Pending'
    | 'Processing'
    | 'Paid'
    | 'Failed'
    | 'Cancelled'
    | 'Refunded';
  deliveryStatus:
    | 'Order Placed'
    | 'Under Preparation'
    | 'Dispatched'
    | 'Delivered'
    | 'Order Received'
    | 'Confirmed'
    | 'Preparing'
    | 'Packed'
    | 'Shipped'
    | 'Cancelled'
    | 'Returned'
    | 'Refunded';
  history?: { timestamp: string; status: string; note: string }[];
}
