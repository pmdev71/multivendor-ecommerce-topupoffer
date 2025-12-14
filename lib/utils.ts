/**
 * Commission Calculate করার Function
 * Platform Commission Calculate করে
 */
export function calculateCommission(amount: number, commissionRate: number = 0.05): {
  commission: number;
  sellerAmount: number;
} {
  const commission = amount * commissionRate;
  const sellerAmount = amount - commission;
  return {
    commission: Math.round(commission * 100) / 100,
    sellerAmount: Math.round(sellerAmount * 100) / 100,
  };
}

/**
 * Price Format করার Function
 */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 0,
  }).format(amount);
}

/**
 * Class Name Merge করার Function
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
