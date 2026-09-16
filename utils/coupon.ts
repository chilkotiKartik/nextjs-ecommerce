/**
 * Promotional coupon validation & discount calculation engine.
 */

export interface CouponRule {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderValue: number;
}

const ACTIVE_COUPONS: Record<string, CouponRule> = {
  'WELCOME10': { code: 'WELCOME10', type: 'percentage', value: 10, minOrderValue: 20 },
  'SAVE25': { code: 'SAVE25', type: 'percentage', value: 25, minOrderValue: 100 },
  'FLAT15': { code: 'FLAT15', type: 'fixed', value: 15, minOrderValue: 50 },
};

export function validateAndApplyCoupon(code: string, subtotal: number): { valid: boolean; discountAmount: number; message: string } {
  const normalized = code.trim().toUpperCase();
  const rule = ACTIVE_COUPONS[normalized];

  if (!rule) {
    return { valid: false, discountAmount: 0, message: 'Invalid coupon code.' };
  }

  if (subtotal < rule.minOrderValue) {
    return {
      valid: false,
      discountAmount: 0,
      message: Order must be at least $ + rule.minOrderValue +  to apply this coupon.,
    };
  }

  const discountAmount = rule.type === 'percentage'
    ? Math.round((subtotal * (rule.value / 100)) * 100) / 100
    : Math.min(rule.value, subtotal);

  return {
    valid: true,
    discountAmount,
    message: 'Coupon applied successfully!',
  };
}