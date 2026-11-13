import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Cart } from '@/models/Cart';
import { Product } from '@/models/Product';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Types } from 'mongoose';
import { formatPricingDisplayLabel } from '@/lib/pricingDisplay';
import { isValidPricingUnit } from '@/lib/pricingUnits';

interface Pricing {
  quantity: number;
  unit: string;
  price: number;
  sizeLabel?: string;
}

interface CartDbItem {
  productId: Types.ObjectId;
  quantity: number;
  selectedPricing?: Pricing;
  _id?: string;
}

interface ProductData {
  _id: string;
  name: string;
  pricing?: Pricing[];
  image?: string;
  type?: string;
  price?: number;
  gstPercentage?: number;
}

interface CartItem {
  product: {
    _id: string;
    name: string;
    price: number;
    originalPrice?: number;
    image?: string;
    size?: string;
    type?: string;
    gstPercentage?: number;
    pricing?: Pricing[];
  };
  quantity: number;
  selectedPricing?: Pricing;
}

export async function GET() {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return NextResponse.json({ items: [] });
    }

    // Manually populate items by fetching from Product collection
    const populatedItems: CartItem[] = [];

    for (const item of cart.items) {
      const productData: ProductData | null = await Product.findById(item.productId);

      if (productData) {
        const cartItem: CartItem = {
          product: {
            _id: productData._id.toString(),
            name: productData.name,
            price: item.selectedPricing?.price || productData.price || (productData.pricing?.[0]?.price ?? 0),
            image: productData.image,
            size: item.selectedPricing 
              ? formatPricingDisplayLabel(item.selectedPricing, productData.name)
              : undefined,
            type: productData.type || 'latest',
            gstPercentage: productData.gstPercentage ?? 18,
            pricing: productData.pricing,
          },
          quantity: item.quantity,
          selectedPricing: item.selectedPricing,
        };
        populatedItems.push(cartItem);
      } else {
        console.log('Product not found for ID:', item.productId);
      }
    }

    console.log('Final populated items:', populatedItems.length); // Debug log
    return NextResponse.json({ items: populatedItems });
  } catch (error) {
    console.error('GET /api/cart error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { 
      productId, 
      quantity, 
      selectedPricing 
    }: { 
      productId: string; 
      quantity: number; 
      selectedPricing?: Pricing;
    } = await req.json();
    
    console.log('POST request received:', { productId, quantity, selectedPricing }); // Debug log
    
    if (!productId || quantity < 1) {
      return NextResponse.json({ error: 'Invalid product ID or quantity' }, { status: 400 });
    }

    // Validate ObjectId format
    if (!Types.ObjectId.isValid(productId)) {
      return NextResponse.json({ error: 'Invalid product ID format' }, { status: 400 });
    }

    // Verify the product exists in Product collection
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    if (selectedPricing && !isValidPricingUnit(selectedPricing.unit)) {
      return NextResponse.json({ error: 'Invalid pricing unit' }, { status: 400 });
    }

    let cart = await Cart.findOne({ userId });

    const cartItem: {
      productId: Types.ObjectId;
      quantity: number;
      selectedPricing?: Pricing;
    } = {
      productId: new Types.ObjectId(productId),
      quantity,
    };
    
    // Add pricing information if provided
    if (selectedPricing) {
      const row: Pricing = {
        quantity: selectedPricing.quantity,
        unit: selectedPricing.unit,
        price: selectedPricing.price,
      };
      const sl = typeof selectedPricing.sizeLabel === 'string' ? selectedPricing.sizeLabel.trim() : '';
      if (sl) row.sizeLabel = sl;
      cartItem.selectedPricing = row;
      console.log('Adding pricing info:', cartItem.selectedPricing); // Debug log
    }

    if (!cart) {
      console.log('Creating new cart'); // Debug log
      cart = await Cart.create({ 
        userId, 
        items: [cartItem] 
      });
    } else {
      console.log('Existing cart found, checking for duplicate items'); // Debug log
      const existingItemIndex = cart.items.findIndex((item: CartDbItem) => {
        const sameProduct = item.productId.equals(productId);
        
        if (!selectedPricing && !item.selectedPricing) {
          return sameProduct; // Both have no pricing
        }
        
        if (selectedPricing && item.selectedPricing) {
          const sameSizeLabel = (item.selectedPricing.sizeLabel || '') === (selectedPricing.sizeLabel || '');
          return sameProduct &&
            item.selectedPricing.quantity === selectedPricing.quantity &&
            item.selectedPricing.unit === selectedPricing.unit &&
            item.selectedPricing.price === selectedPricing.price &&
            sameSizeLabel;
        }
        
        return false; // One has pricing, other doesn't
      });

      console.log('Existing item index:', existingItemIndex); // Debug log

      if (existingItemIndex >= 0) {
        // Update existing item quantity
        cart.items[existingItemIndex].quantity += quantity;
        console.log('Updated existing item quantity'); // Debug log
      } else {
        // Add new item
        cart.items.push(cartItem);
        console.log('Added new item to cart'); // Debug log
      }
      
      await cart.save();
    }

    console.log('Cart operation successful'); // Debug log
    return NextResponse.json({ success: true, message: 'Item added to cart' });
  } catch (error) {
    console.error('POST /api/cart error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { productId, quantity }: { productId: string; quantity: number } = await req.json();
    
    console.log('PUT request:', { productId, quantity }); // Debug log
    
    if (!productId || quantity < 0) {
      return NextResponse.json({ error: 'Invalid product ID or quantity' }, { status: 400 });
    }

    // Validate ObjectId format
    if (!Types.ObjectId.isValid(productId)) {
      return NextResponse.json({ error: 'Invalid product ID format' }, { status: 400 });
    }

    const cart = await Cart.findOne({ userId });
    
    if (!cart) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
    }

    const itemIndex = cart.items.findIndex((item: CartDbItem) =>
      item.productId.equals(productId)
    );

    console.log('Found item at index:', itemIndex); // Debug log

    if (itemIndex === -1) {
      return NextResponse.json({ error: 'Item not found in cart' }, { status: 404 });
    }

    if (quantity === 0) {
      // Remove item if quantity is 0
      cart.items.splice(itemIndex, 1);
      console.log('Removed item from cart'); // Debug log
    } else {
      // Update quantity
      cart.items[itemIndex].quantity = quantity;
      console.log('Updated quantity to:', quantity); // Debug log
    }

    await cart.save();
    console.log('Cart saved successfully'); // Debug log
    return NextResponse.json({ success: true, message: 'Cart updated successfully' });
  } catch (error) {
    console.error('PUT /api/cart error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { productId }: { productId: string } = await req.json();

    if (!productId) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }

    // Validate ObjectId format
    if (!Types.ObjectId.isValid(productId)) {
      return NextResponse.json({ error: 'Invalid product ID format' }, { status: 400 });
    }

    const cart = await Cart.findOne({ userId });
    
    if (cart) {
      const itemIndex = cart.items.findIndex((item: CartDbItem) =>
        item.productId.equals(productId)
      );

      if (itemIndex >= 0) {
        cart.items.splice(itemIndex, 1);
        await cart.save();
      }
    }

    return NextResponse.json({ success: true, message: 'Item removed from cart' });
  } catch (error) {
    console.error('DELETE /api/cart error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}