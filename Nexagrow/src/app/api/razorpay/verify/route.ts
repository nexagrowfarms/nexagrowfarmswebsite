import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { connectDB } from '@/lib/db';
import { Order, OrderStatus, PaymentStatus, PaymentMethod } from '@/models/Order';
import { Cart } from '@/models/Cart';
import { Product } from '@/models/Product';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

async function findProductById(productId: string) {
  const product = await Product.findById(productId);
  if (product) return { product, type: 'product' };
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderData,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderData) {
      return NextResponse.json(
        { error: 'Missing payment verification data' },
        { status: 400 }
      );
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return NextResponse.json({ error: 'Razorpay not configured' }, { status: 500 });
    }

    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 });
    }

    await connectDB();

    const userId = session.user.id;
    const { userEmail, shippingAddress, cartItems, totals } = orderData;

    if (!cartItems?.length || !totals) {
      return NextResponse.json({ error: 'Invalid order data' }, { status: 400 });
    }

    const orderItems = [];
    let calculatedSubtotal = 0;

    for (const item of cartItems) {
      const result = await findProductById(item.productId);
      if (!result) {
        return NextResponse.json(
          { error: `Product not found: ${item.productId}` },
          { status: 404 }
        );
      }

      const itemPrice =
        item.selectedPricing?.price ??
        result.product.price ??
        (result.product as { pricing?: { price: number }[] }).pricing?.[0]?.price ??
        0;
      const itemTotal = itemPrice * item.quantity;
      calculatedSubtotal += itemTotal;

      orderItems.push({
        productId: result.product._id,
        productName: result.product.name,
        productImage: result.product.image || '',
        quantity: item.quantity,
        selectedPricing: item.selectedPricing || {
          quantity: 0,
          unit: 'piece',
          price: itemPrice,
        },
        itemTotal,
      });
    }

    const subtotal = totals.subtotal ?? calculatedSubtotal;
    const shippingCost = totals.shippingCost ?? (subtotal >= 1000 ? 0 : 59);
    const tax = totals.tax ?? 0;
    const totalAmount = totals.totalAmount ?? subtotal + shippingCost + tax;

    const count = await Order.countDocuments();
    const year = new Date().getFullYear();
    const orderId = `ORD-${year}-${String(count + 1).padStart(4, '0')}`;

    const order = new Order({
      orderId,
      userId,
      userEmail: userEmail || session.user.email,
      items: orderItems,
      shippingAddress,
      paymentMethod: PaymentMethod.Razorpay,
      paymentStatus: PaymentStatus.Paid,
      orderStatus: OrderStatus.Confirmed,
      subtotal,
      shippingCost,
      tax,
      totalAmount,
      notes: `Razorpay Payment ID: ${razorpay_payment_id}, Order ID: ${razorpay_order_id}`,
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    await order.save();

    await Cart.findOneAndUpdate({ userId }, { $set: { items: [] } }, { upsert: true });

    return NextResponse.json({
      success: true,
      orderId: order.orderId,
      razorpayPaymentId: razorpay_payment_id,
    });
  } catch (error) {
    console.error('Razorpay verify error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Verification failed' },
      { status: 500 }
    );
  }
}
