'use client';

import { useState, useCallback } from 'react';
import Script from 'next/script';
import { ArrowLeft, CreditCard, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { CartItem } from '@/hooks/useCart';
import { formatPricingDisplayLabel } from '@/lib/pricingDisplay';
import { BRAND } from '@/lib/brand';

declare global {
  interface Window {
    Razorpay?: new (options: {
      key: string;
      amount: number;
      currency: string;
      name: string;
      order_id: string;
      handler: (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => void;
      prefill?: { email?: string };
      theme?: { color: string };
    }) => { open: () => void };
  }
}

interface RazorpayPaymentProps {
  cartItems: CartItem[];
  totals: {
    subtotal: number;
    shippingCost: number;
    tax: number;
    productTax?: number;
    deliveryGst?: number;
    totalAmount: number;
  };
  userEmail: string;
  shippingAddress: {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
  };
  onBack: () => void;
  onPaymentSuccess: () => void;
}

export default function RazorpayPayment({
  cartItems,
  totals,
  userEmail,
  shippingAddress,
  onBack,
  onPaymentSuccess,
}: RazorpayPaymentProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'processing' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  // TODO: remove after verifying production env
  console.log('KEY:', process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID);

  const orderData = useCallback(() => ({
    userEmail,
    shippingAddress,
    cartItems: cartItems.map((item) => ({
      productId: item.product._id,
      quantity: item.quantity,
      selectedPricing: item.selectedPricing,
    })),
    totals,
  }), [userEmail, shippingAddress, cartItems, totals]);

  const initiatePayment = useCallback(async () => {
    if (!razorpayKey) {
      setError('Razorpay is not configured');
      return;
    }
    if (!window.Razorpay) {
      setError('Payment gateway is still loading. Please try again.');
      return;
    }

    setStatus('loading');
    setError(null);

    try {
      const createRes = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: totals.totalAmount }),
      });

      const createData = await createRes.json();
      if (!createRes.ok) throw new Error(createData.error || 'Failed to create order');

      const { orderId } = createData;

      const options = {
        key: razorpayKey,
        amount: Math.round(totals.totalAmount * 100),
        currency: 'INR',
        name: BRAND.paymentName,
        order_id: orderId,
        prefill: { email: userEmail },
        theme: { color: BRAND.accentColor },
        handler: async (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
          setStatus('processing');

          try {
            const verifyRes = await fetch('/api/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderData: orderData(),
              }),
            });

            const verifyData = await verifyRes.json();

            if (!verifyRes.ok) throw new Error(verifyData.error || 'Payment verification failed');

            setStatus('success');
            onPaymentSuccess();
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Verification failed');
            setStatus('error');
          }
        },
      };

      const rzp = new (window.Razorpay as new (opts: Record<string, unknown>) => { open: () => void })(options);
      rzp.open();
      setStatus('idle');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initiate payment');
      setStatus('error');
    }
  }, [razorpayKey, totals.totalAmount, userEmail, orderData, onPaymentSuccess]);

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setScriptLoaded(true)}
      />
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h2 className="text-2xl font-semibold text-gray-800">Pay with Razorpay</h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Payment */}
          <div className="bg-white rounded-lg shadow-md p-6">
            {status === 'success' && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Payment Successful!</h3>
                <p className="text-gray-600 mb-6">Your order has been placed.</p>
                <button
                  onClick={() => window.location.href = '/my-orders'}
                  className="w-full py-3 px-6 rounded-lg font-semibold text-white"
                  style={{ backgroundColor: 'var(--leaf-600)' }}
                >
                  View My Orders
                </button>
              </div>
            )}

            {status !== 'success' && (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <CreditCard className="w-8 h-8" style={{ color: 'var(--leaf-600)' }} />
                  <h3 className="text-xl font-semibold text-gray-800">Secure Online Payment</h3>
                </div>
                <p className="text-gray-600 mb-6">
                  Pay securely with card, UPI, netbanking, or wallet via Razorpay.
                </p>
                {error && (
                  <div className="mb-4 p-4 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}
                <button
                  onClick={initiatePayment}
                  disabled={!scriptLoaded || status === 'loading' || status === 'processing'}
                  className="w-full py-4 px-6 rounded-xl font-semibold text-lg text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{ backgroundColor: 'var(--leaf-600)' }}
                >
                  {status === 'loading' && <Loader2 className="w-5 h-5 animate-spin" />}
                  {status === 'processing' && <Loader2 className="w-5 h-5 animate-spin" />}
                  {status === 'loading' || status === 'processing'
                    ? 'Processing...'
                    : scriptLoaded
                    ? `Pay ₹${totals.totalAmount.toFixed(2)}`
                    : 'Loading payment...'}
                </button>
              </>
            )}
          </div>

          {/* Right: Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h3>
            <div className="overflow-x-auto mb-3">
              <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="py-2 px-2 font-semibold text-gray-700 border-b">Particulars</th>
                    <th className="py-2 px-2 font-semibold text-gray-700 border-b text-center w-12">Qty</th>
                    <th className="py-2 px-2 font-semibold text-gray-700 border-b text-right">N/Rate</th>
                    <th className="py-2 px-2 font-semibold text-gray-700 border-b text-right">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item, index) => {
                    const unitPrice = item.selectedPricing?.price ?? item.product.price ?? 0;
                    const value = unitPrice * item.quantity;
                    const particulars =
                      item.product.name +
                      (item.selectedPricing
                        ? ` (${formatPricingDisplayLabel(item.selectedPricing, item.product.name)})`
                        : item.product.size
                          ? ` (${item.product.size})`
                          : '');
                    return (
                      <tr key={`${item.product._id}-${index}`} className="border-b border-gray-100">
                        <td className="py-1.5 px-2 text-gray-800 text-xs">{particulars}</td>
                        <td className="py-1.5 px-2 text-center">{item.quantity}</td>
                        <td className="py-1.5 px-2 text-right">₹{unitPrice.toFixed(2)}</td>
                        <td className="py-1.5 px-2 text-right">₹{value.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 mb-3">
              Items: {cartItems.length} &nbsp; Qty: {cartItems.reduce((s, i) => s + i.quantity, 0)} &nbsp; ₹{totals.subtotal.toFixed(2)}
            </p>
            <div className="space-y-2 text-sm border-t pt-4">
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className={totals.shippingCost === 0 ? 'text-green-600' : ''}>
                  {totals.shippingCost === 0 ? 'FREE' : `₹${totals.shippingCost}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tax (GST)</span>
                <span>₹{totals.tax.toFixed(2)}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Amount to pay</span>
                  <span>₹{totals.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
