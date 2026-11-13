export interface DefaultProduct {
  name: string;
  description: string;
  image: string;
  type: string;
  gstPercentage: number;
  pricing: Array<{
    quantity: number;
    unit: string;
    price: number;
    sizeLabel?: string;
  }>;
}

export const DEFAULT_PRODUCTS: DefaultProduct[] = [
  {
    name: "Organic Moringa Leaf Powder (100g Sachet)",
    description: "100% certified organic moringa oleifera leaf powder grown sustainably on our Prayagraj farms. Packaged in a convenient 100g airtight eco-friendly freshness sachet. Rich in 9 essential amino acids, iron, calcium, and potent antioxidants.",
    image: "/powder_packaging.webp",
    type: "popular",
    gstPercentage: 5,
    pricing: [
      { quantity: 100, unit: "gm", price: 299, sizeLabel: "100g Sachet" },
      { quantity: 200, unit: "gm", price: 549, sizeLabel: "Pack of 2 (200g)" },
      { quantity: 500, unit: "gm", price: 1249, sizeLabel: "Value Pack of 5 (500g)" },
    ],
  },
  {
    name: "Organic Moringa Herbal Tea",
    description: "Gentle, whole-leaf organic moringa infusion packed with natural flavonoids and antioxidants. A clean, caffeine-free herbal brew that refreshes your body, supports immunity, and promotes calm digestion.",
    image: "/Leaves.jpg",
    type: "latest",
    gstPercentage: 5,
    pricing: [
      { quantity: 100, unit: "gm", price: 349, sizeLabel: "100g Loose Leaf / 25 Bags" },
      { quantity: 200, unit: "gm", price: 649, sizeLabel: "200g Tin Pack" },
    ],
  },
  {
    name: "Organic Moringa Capsules (500mg)",
    description: "Pure organic moringa leaf extract sealed inside 100% vegetarian plant capsules. Convenient daily superfood nutrition for sustained natural energy, metabolic balance, and cellular defense.",
    image: "/capsule.webp",
    type: "healthy",
    gstPercentage: 12,
    pricing: [
      { quantity: 60, unit: "piece", price: 499, sizeLabel: "Bottle of 60 Veg Capsules" },
      { quantity: 120, unit: "piece", price: 899, sizeLabel: "Bottle of 120 Veg Capsules" },
    ],
  },
];
