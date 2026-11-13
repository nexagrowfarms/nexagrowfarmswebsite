/** Optional label stored on a pricing row (e.g. "60ml bottle") */
export type PricingLike = {
  quantity: number;
  unit: string;
  price: number;
  sizeLabel?: string;
};

const isOilName = (productName?: string) => /\boil\b/i.test(productName || '');

/**
 * Human-readable size line for product cards / PDP / cart.
 * - Uses `sizeLabel` from DB when set.
 * - Oils sold as `piece`: never "pc"; maps 1→60ml bottle, 2→120ml bottle, n→n×60ml bottle.
 * - `ml`: quantity is volume (e.g. 60 → "60ml" or "60ml bottle" for oils).
 */
export function formatPricingDisplayLabel(pricing: PricingLike, productName?: string): string {
  const label = pricing.sizeLabel?.trim();
  if (label) return label;

  const oil = isOilName(productName);
  const q = pricing.quantity;

  if (oil && pricing.unit === 'piece') {
    if (q === 1) return '60ml bottle';
    if (q === 2) return '120ml bottle';
    if (Number.isFinite(q) && q > 0) return `${q * 60}ml bottle`;
  }

  if (pricing.unit === 'ml') {
    return oil ? `${q}ml bottle` : `${q}ml`;
  }
  if (pricing.unit === 'mg') {
    return `${q}mg`;
  }
  if (pricing.unit === 'l') {
    return `${q}l`;
  }
  if (pricing.unit === 'gm') {
    return `${q} g`;
  }
  if (pricing.unit === 'kg') {
    return `${q} kg`;
  }
  if (pricing.unit === 'piece') {
    return `${q} pc`;
  }
  if (pricing.unit === 'dozen') {
    return `${q} dz`;
  }
  return `${q} ${pricing.unit}`;
}
