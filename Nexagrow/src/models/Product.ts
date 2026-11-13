import { Schema, model, models } from 'mongoose';
import { PRICING_UNITS } from '@/lib/pricingUnits';

export enum ProductType {
  Popular = "popular",
  Latest = "latest",
  Healthy = "healthy",
}

// Interface for quantity-based pricing
export interface IPricing {
  quantity: number;
  unit: 'gm' | 'kg' | 'piece' | 'dozen' | 'ml' | 'mg' | 'l';
  price: number;
  /** Optional display label, e.g. "60ml bottle" for oils */
  sizeLabel?: string;
}
export type Product = {
  _id: string;
  name: string;
  description: string;
  image?: string;
  price: number; // Added the price property
  type?: string;
  gstPercentage?: number; // Applicable GST % (e.g. 0, 5, 12, 18)
  pricing?: Array<{
    quantity: number;
    unit: string;
    price: number;
  }>;
};


export interface IProduct {
  _id?: string;
  name: string;
  description: string;
  image: string;
  type: ProductType;
  gstPercentage?: number; // Applicable GST % (e.g. 0, 5, 12, 18)
  pricing: IPricing[]; // Array of quantity-price combinations
}

const PricingSchema = new Schema<IPricing>({
  quantity: { type: Number, required: true },
  unit: { 
    type: String, 
    enum: [...PRICING_UNITS],
    required: true 
  },
  price: { type: Number, required: true },
  sizeLabel: { type: String, trim: true },
});

const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  type: {
    type: String,
    enum: Object.values(ProductType),
    default: ProductType.Latest,
  },
  gstPercentage: { type: Number, default: 18, min: 0, max: 100 },
  pricing: { 
    type: [PricingSchema], 
    required: true,
    validate: {
      validator: function(v: IPricing[]) {
        return v && v.length > 0;
      },
      message: 'At least one pricing option is required'
    }
  }
}, {
  timestamps: true
});

export const Product = models.Product || model<IProduct>("Product", ProductSchema);