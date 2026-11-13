'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import CartSummary from '@/components/CartSummary';
import CheckoutForm from '@/components/CheckOutForm';
import RazorpayPayment from '@/components/organisms/RazorpayPayment';

// Import shared types to ensure consistency
export interface ShippingAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string; // Optional to match CheckoutForm
  city: string;
  state: string;
  pincode: string;
  landmark?: string; // Optional to match CheckoutForm
}

interface UPIPaymentData {
  userEmail: string;
  shippingAddress: ShippingAddress;
  totals: {
    subtotal: number;
    shippingCost: number;
    tax: number;
    totalAmount: number;
  };
}

interface CheckoutPageProps {
  /** When true, rendered inside slide-in drawer (no full page layout) */
  embedded?: boolean;
  /** Called when drawer should close (e.g. after success or user cancel) */
  onCloseDrawer?: () => void;
}

export default function CheckoutPage({ embedded, onCloseDrawer }: CheckoutPageProps = {}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [step, setStep] = useState<'cart' | 'form' | 'upi'>('cart');
  
  const [razorpayPaymentData, setRazorpayPaymentData] = useState<UPIPaymentData | null>(null);
  
  const {
    cartItems,
    totals,
    error,
  } = useCart();

  // Debug logging
  useEffect(() => {
    console.log('🔍 Checkout Page State:', { step, cartItemsCount: cartItems?.length, totals });
  }, [step, cartItems, totals]);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  const handleProceedToPay = () => {
    if (cartItems.length === 0) {
      console.warn('⚠️ Cannot proceed: Cart is empty');
      return;
    }
    console.log('📝 Proceeding to form step');
    setStep('form');
  };

  const handleBackToCart = () => {
    console.log('⬅️ Going back to cart');
    setStep('cart');
  };

  // Handle payment method selection from CheckoutForm
  // This signature must match exactly what CheckoutForm expects
  const handlePaymentMethodSelect = (method: 'razorpay' | 'cod', data?: UPIPaymentData | undefined) => {
    console.log('💳 Payment method selected:', method);
    
    if (method === 'razorpay') {
      if (!data || !data.userEmail || !data.shippingAddress || !data.totals) {
        alert('Missing required information for payment. Please try again.');
        return;
      }
      setRazorpayPaymentData(data);
      setStep('upi');
    } else if (method === 'cod') {
      // COD is handled within the CheckoutForm component
      console.log('💰 COD payment selected - handled in CheckoutForm');
    }
  };

  const handleBackToForm = () => {
    console.log('⬅️ Going back to form from UPI');
    setStep('form');
  };

  const handlePaymentSuccess = () => {
    console.log('🎉 Payment successful, redirecting to orders');
    onCloseDrawer?.();
    router.push('/my-orders');
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: 'var(--leaf-500)' }}></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null; // Will redirect
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-4">Error loading cart</h2>
          <button
            onClick={() => router.push('/cart')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Go to Cart
          </button>
        </div>
      </div>
    );
  }

  if (step === 'upi') {
    if (!razorpayPaymentData || !razorpayPaymentData.userEmail || !razorpayPaymentData.shippingAddress || cartItems.length === 0) {
      setStep('form');
      alert('Session data lost. Please complete the checkout form again.');
      return null;
    }
  }

  return (
    <div className={embedded ? 'min-h-0 bg-gray-50' : 'min-h-screen bg-gray-50'}>
      <div className="container mx-auto px-4 py-6">
        {!embedded && <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>}
        
        {step === 'cart' && (
          <CartSummary
            cartItems={cartItems}
            totals={totals}
            onProceedToPay={handleProceedToPay}
          />
        )}
        
        {step === 'form' && (
          <CheckoutForm
            cartItems={cartItems}
            totals={totals}
            userEmail={session?.user?.email || ''}
            userName={session?.user?.name || ''}
            onBack={handleBackToCart}
            onPaymentMethodSelect={handlePaymentMethodSelect}
          />
        )}
        
        {step === 'upi' && razorpayPaymentData && (
          <RazorpayPayment
            cartItems={cartItems}
            totals={razorpayPaymentData.totals}
            userEmail={razorpayPaymentData.userEmail}
            shippingAddress={{
              fullName: razorpayPaymentData.shippingAddress.fullName,
              phone: razorpayPaymentData.shippingAddress.phone,
              addressLine1: razorpayPaymentData.shippingAddress.addressLine1,
              addressLine2: razorpayPaymentData.shippingAddress.addressLine2 || '',
              city: razorpayPaymentData.shippingAddress.city,
              state: razorpayPaymentData.shippingAddress.state,
              pincode: razorpayPaymentData.shippingAddress.pincode,
              landmark: razorpayPaymentData.shippingAddress.landmark || '',
            }}
            onBack={handleBackToForm}
            onPaymentSuccess={handlePaymentSuccess}
          />
        )}
      </div>
    </div>
  );
}