/**
 * Precision pricing and localized currency formatting utilities for e-commerce checkout.
 */

export interface CartPricingItem {
  id: string;
  unitPrice: number;
  quantity: number;
  discountPercentage?: number;
}

export interface PricingBreakdown {
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  finalTotal: number;
}

export function formatCurrency(amount: number, currency: string = 'USD', locale: string = 'en-US'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function computeCartPricing(items: CartPricingItem[], taxRate: number = 0.08): PricingBreakdown {
  let subtotal = 0;
  let discountTotal = 0;

  for (const item of items) {
    const itemSubtotal = item.unitPrice * item.quantity;
    subtotal += itemSubtotal;

    if (item.discountPercentage && item.discountPercentage > 0) {
      const discount = itemSubtotal * (item.discountPercentage / 100);
      discountTotal += discount;
    }
  }

  const taxableAmount = Math.max(0, subtotal - discountTotal);
  const taxTotal = Math.round(taxableAmount * taxRate * 100) / 100;
  const finalTotal = Math.round((taxableAmount + taxTotal) * 100) / 100;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    discountTotal: Math.round(discountTotal * 100) / 100,
    taxTotal,
    finalTotal,
  };
}