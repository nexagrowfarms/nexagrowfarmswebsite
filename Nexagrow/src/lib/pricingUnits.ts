/** All units accepted for moringa products (DB + APIs). */
export const PRICING_UNITS = ['gm', 'kg', 'piece', 'dozen', 'ml', 'mg', 'l'] as const;
export type PricingUnit = (typeof PRICING_UNITS)[number];

export function isValidPricingUnit(unit: string): unit is PricingUnit {
  return (PRICING_UNITS as readonly string[]).includes(unit);
}

/** Admin dropdown: ml / mg / kg / l first, then grams and pack units. */
export const ADMIN_PRODUCT_UNIT_OPTIONS: { value: PricingUnit; label: string }[] = [
  { value: 'ml', label: 'Millilitres (ml)' },
  { value: 'mg', label: 'Milligrams (mg)' },
  { value: 'kg', label: 'Kilograms (kg)' },
  { value: 'l', label: 'Litres (l)' },
  { value: 'gm', label: 'Grams (g)' },
  { value: 'piece', label: 'Pieces' },
  { value: 'dozen', label: 'Dozen' },
];
