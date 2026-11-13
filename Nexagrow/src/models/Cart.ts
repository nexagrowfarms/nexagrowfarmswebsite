import { Schema, model, models } from 'mongoose';
import { PRICING_UNITS } from '@/lib/pricingUnits';

interface IPricing {
  quantity: number;
  unit: 'gm' | 'kg' | 'piece' | 'dozen' | 'ml' | 'mg' | 'l';
  price: number;
  sizeLabel?: string;
}

interface ICartItem {
  productId: Schema.Types.ObjectId;
  quantity: number;
  selectedPricing?: IPricing; // Store the selected pricing option
}

interface ICart {
  userId: string;
  items: ICartItem[];
}

const PricingSchema = new Schema<IPricing>({
  quantity: { type: Number, required: true },
  unit: { 
    type: String, 
    enum: [...PRICING_UNITS],
    required: true 
  },
  price: { type: Number, required: true },
  sizeLabel: { type: String, trim: true, required: false },
});

const CartItemSchema = new Schema<ICartItem>({
  productId: { 
    type: Schema.Types.ObjectId, 
    required: true,
    ref: 'Product'
  },
  quantity: { type: Number, required: true, min: 1 },
  selectedPricing: { 
    type: PricingSchema, 
    required: false // Optional for products without pricing options
  }
});

const CartSchema = new Schema<ICart>({
  userId: { type: String, required: true, unique: true },
  items: [CartItemSchema]
}, {
  timestamps: true
});

export const Cart = models.Cart || model<ICart>("Cart", CartSchema);