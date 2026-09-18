export interface CouponRule {
  code: string;
  type: 'percentage' | 'fixed_amount';
  value: number;
  minimumCartValue: number;
  maxDiscountLimit?: number;
  eligibleProductIds?: string[];
  eligibleCategories?: string[];
  startDate?: string;
  expiryDate?: string;
  usageLimit?: number;
  perCustomerLimit?: number;
  isActive: boolean;
}

export interface CouponValidationResult {
  isValid: boolean;
  code: string;
  discountAmount: number;
  message: string;
}

// In compliance with guidelines: No sample public coupons or fake discounts are enabled.
export const CONFIGURED_COUPONS: Record<string, CouponRule> = {};

export function validateCoupon(params: {
  code: string;
  cartSubtotal: number;
  cartItems: { productId: string }[];
}): CouponValidationResult {
  const clean = params.code.trim().toUpperCase();
  const rule = CONFIGURED_COUPONS[clean];

  if (!rule || !rule.isActive) {
    return {
      isValid: false,
      code: clean,
      discountAmount: 0,
      message: 'The promotion code is either invalid, expired, or currently not active.',
    };
  }

  if (params.cartSubtotal < rule.minimumCartValue) {
    return {
      isValid: false,
      code: clean,
      discountAmount: 0,
      message: `This code requires a minimum cart subtotal of ₹${rule.minimumCartValue}.`,
    };
  }

  let discount = 0;
  if (rule.type === 'percentage') {
    discount = (params.cartSubtotal * rule.value) / 100;
    if (rule.maxDiscountLimit && discount > rule.maxDiscountLimit) {
      discount = rule.maxDiscountLimit;
    }
  } else {
    discount = rule.value;
  }

  return {
    isValid: true,
    code: clean,
    discountAmount: Math.round(discount),
    message: 'Promotion code applied successfully.',
  };
}
