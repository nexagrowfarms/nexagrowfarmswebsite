'use client';

import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Copy, CheckCircle, Smartphone, AlertCircle, Clock, Loader2 } from 'lucide-react';
import { CartItem } from '@/hooks/useCart';
import Image from 'next/image';
import axios from 'axios';
import { formatPricingDisplayLabel } from '@/lib/pricingDisplay';
import { BRAND } from '@/lib/brand';

interface UPIPaymentProps {
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

export default function UPIPayment({ 
  cartItems, 
  totals, 
  userEmail, 
  shippingAddress, 
  onBack, 
  onPaymentSuccess 
}: UPIPaymentProps) {
  const [paymentStep, setPaymentStep] = useState<'payment' | 'confirmation' | 'processing' | 'success'>('payment');
  const [customerUpiId, setCustomerUpiId] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  // Debug props on component mount
  useEffect(() => {
    console.log('🔍 UPI Payment Component Props:', {
      userEmail,
      shippingAddress,
      cartItemsCount: cartItems?.length,
      totals,
      cartItems: cartItems?.map(item => ({
        productId: item.product?._id,
        productName: item.product?.name,
        quantity: item.quantity
      }))
    });
  }, [userEmail, shippingAddress, cartItems, totals]);

  // ⚠️ Business UPI payment details
  const businessUpiId = '7011218400@pthdfccahngae';
  const businessName = BRAND.paymentName;
  const transactionNote = 'Order Payment from Website'; // Optional: Add transaction note
  
  // ✅ USE THE TOTALS PASSED FROM CHECKOUT FORM - DON'T RECALCULATE
  const calculatedTotals = totals;

  // Debug logging to verify totals are correct
  useEffect(() => {
    console.log('💰 UPI Payment Totals:', {
      passedTotals: totals,
      usingTotals: calculatedTotals,
      userWillPay: calculatedTotals.totalAmount
    });
  }, [totals, calculatedTotals]);

  // Generate UPI payment URL (for "Open in UPI App" button)
  const generateUPIUrl = useCallback(() => {
    return `upi://pay?pa=${businessUpiId}&pn=${encodeURIComponent(businessName)}&am=${calculatedTotals.totalAmount.toFixed(2)}&cu=INR&tn=${encodeURIComponent(transactionNote)}`;
  }, [businessUpiId, businessName, calculatedTotals.totalAmount, transactionNote]);

  // ✅ CLEAR CART FUNCTION
  const clearCart = async () => {
    try {
      console.log('🗑️ Clearing cart after successful order...');
      const response = await axios.post('/api/cart/clear', {}, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000, // 10 second timeout
      });

      if (response.status === 200 && response.data.success) {
        console.log('✅ Cart cleared successfully');
      } else {
        console.warn('⚠️ Cart clearing returned unexpected response:', response.data);
      }
    } catch (error) {
      console.error('❌ Error clearing cart:', error);
      // Don't fail the success flow if cart clearing fails
    }
  };

  // Copy functions
  const copyUpiId = () => {
    navigator.clipboard.writeText(businessUpiId);
    setAlertMessage('UPI ID copied to clipboard!');
    setShowAlertModal(true);
  };

  const copyAmount = () => {
    navigator.clipboard.writeText(calculatedTotals.totalAmount.toFixed(2));
    setAlertMessage('Amount copied to clipboard!');
    setShowAlertModal(true);
  };

  const copyUPIUrl = () => {
    const upiUrl = generateUPIUrl();
    navigator.clipboard.writeText(upiUrl);
    setAlertMessage('UPI payment link copied to clipboard!');
    setShowAlertModal(true);
  };

  const handlePaymentMade = () => {
    if (!customerUpiId.trim()) {
      setAlertMessage('Please enter your UPI ID for verification');
      setShowAlertModal(true);
      return;
    }
    setPaymentStep('confirmation');
  };

  const confirmPayment = async () => {
    if (!transactionId.trim()) {
      setAlertMessage('Please enter the transaction ID');
      setShowAlertModal(true);
      return;
    }
    setPaymentStep('processing');

    try {
      console.log('🚀 Starting UPI order placement...');
      
      // Prepare order data with detailed logging
      const orderData = {
        userEmail: userEmail,
        shippingAddress: shippingAddress,
        paymentMethod: 'upi',
        cartItems: cartItems.map(item => ({
          productId: item.product._id,
          quantity: item.quantity,
          selectedPricing: item.selectedPricing,
          product: item.product
        })),
        // ✅ INCLUDE THE CORRECT TOTALS FROM CHECKOUT FORM
        totals: calculatedTotals,
        // Store UPI payment details in notes field
        notes: `UPI Payment - Transaction ID: ${transactionId}, Customer UPI ID: ${customerUpiId}, Amount: ₹${calculatedTotals.totalAmount.toFixed(2)}, Payment Date: ${new Date().toISOString()}`
      };

      console.log('📦 Order Data Being Sent:', {
        userEmail: orderData.userEmail,
        shippingAddressExists: !!orderData.shippingAddress,
        shippingAddress: orderData.shippingAddress,
        paymentMethod: orderData.paymentMethod,
        cartItemsCount: orderData.cartItems.length,
        totalsBeingSent: orderData.totals,
        cartItems: orderData.cartItems.map(item => ({
          productId: item.productId,
          productName: item.product?.name,
          quantity: item.quantity
        })),
        notesLength: orderData.notes.length,
        notes: orderData.notes
      });

      console.log('🌐 Making API request to /api/orders...');
      
      const response = await axios.post('/api/orders', orderData, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000, // 30 second timeout
      });

      console.log('✅ API Response Status:', response.status);
      console.log('📄 API Response Data:', response.data);

      if (response.status === 200 || response.status === 201) {
        if (response.data.success) {
          console.log('🎉 Order placed successfully!', {
            orderId: response.data.order?.orderId,
            totalAmount: response.data.order?.totalAmount
          });
          
          // ✅ CLEAR CART AFTER SUCCESSFUL ORDER
          await clearCart();
          
          setPaymentStep('success');
          // Store order result for display
          localStorage.setItem('lastOrderResult', JSON.stringify(response.data.order));
          
          // ✅ TRIGGER CART REFRESH IN PARENT COMPONENT
          onPaymentSuccess();
        } else {
          console.error('❌ Order API returned success: false', response.data);
          alert('Failed to place order: ' + (response.data.error || 'API returned success: false'));
          setPaymentStep('confirmation');
        }
      } else {
        console.error('❌ Unexpected response status:', response.status);
        alert('Failed to place order: Unexpected response status ' + response.status);
        setPaymentStep('confirmation');
      }

    } catch (error) {
      console.error('💥 Error placing UPI order:', error);
      
      if (axios.isAxiosError(error)) {
        console.error('🔍 Axios Error Details:', {
          message: error.message,
          code: error.code,
          status: error.response?.status,
          statusText: error.response?.statusText,
          responseData: error.response?.data,
          requestData: error.config?.data
        });
        
        if (error.response?.data?.error) {
          setAlertMessage('Failed to place order: ' + error.response.data.error);
        } else if (error.response?.status === 401) {
          setAlertMessage('Authentication failed. Please sign in again.');
        } else if (error.response?.status === 400) {
          setAlertMessage('Invalid order data. Please check your details and try again.');
        } else if (error.code === 'ECONNABORTED') {
          setAlertMessage('Request timed out. Please check your connection and try again.');
        } else {
          setAlertMessage('Failed to place order: ' + (error.message || 'Network error'));
        }
      } else {
        console.error('🔍 Non-Axios Error:', error);
        setAlertMessage('Failed to place order: ' + (error instanceof Error ? error.message : 'Unknown error'));
      }
      setShowAlertModal(true);
      setPaymentStep('confirmation'); // Go back to confirmation step
    }
  };

  const resetPayment = () => {
    setPaymentStep('payment');
    setCustomerUpiId('');
    setTransactionId('');
  };

  const openUPIApp = () => {
    const upiUrl = generateUPIUrl();
    // Standard UPI scheme – opens device's default UPI handler (GPay, PhonePe, Paytm, etc.)
    window.location.href = upiUrl;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h2 className="text-2xl font-semibold text-gray-800">UPI Payment</h2>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column - Payment Instructions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {paymentStep === 'payment' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Complete Your Payment</h3>
              
              {/* QR Code Section */}
              <div className="text-center bg-gray-50 rounded-lg p-6">
                <h4 className="font-medium text-gray-800 mb-4">Scan QR Code to Pay</h4>
                <div className="bg-white p-4 rounded-lg inline-block shadow-sm">
                  <Image
                    src="/upi-qr.png"
                    alt="UPI QR Code - Scan to pay"
                    width={300}
                    height={300}
                    className="mx-auto"
                  />
                </div>
                <p className="text-sm text-gray-600 mt-3 mb-4">
                  Open any UPI app (GPay, PhonePe, Paytm, etc.) and scan this QR code. Enter amount ₹{calculatedTotals.totalAmount.toFixed(2)} when prompted.
                </p>
                
                {/* Mobile-friendly UPI app buttons */}
                <div className="space-y-2">
                  <button
                    onClick={openUPIApp}
                    className="w-full text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    style={{ backgroundColor: 'var(--leaf-600)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--leaf-700)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--leaf-600)'; }}
                  >
                    <Smartphone className="w-5 h-5" />
                    Open in UPI App
                  </button>
                  <button
                    onClick={copyUPIUrl}
                    className="w-full text-white py-2 px-4 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
                    style={{ backgroundColor: 'var(--leaf-700)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--leaf-800)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--leaf-700)'; }}
                  >
                    <Copy className="w-4 h-4" />
                    Copy Payment Link
                  </button>
                  <p className="text-xs text-gray-500 mt-2">
                    Opens your device&apos;s default UPI app. If WhatsApp opens, set GPay/PhonePe/Paytm as default in your device settings.
                  </p>
                </div>
              </div>

              {/* Manual Payment Details */}
              <div className="border-t pt-6">
                <h4 className="font-medium text-gray-800 mb-4">Or Pay Manually</h4>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">UPI ID:</span>
                      <button
                        onClick={copyUpiId}
                        className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm"
                      >
                        <Copy className="w-3 h-3" />
                        Copy
                      </button>
                    </div>
                    <p className="font-mono text-lg font-semibold text-gray-900">{businessUpiId}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Amount:</span>
                      <button
                        onClick={copyAmount}
                        className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm"
                      >
                        <Copy className="w-3 h-3" />
                        Copy
                      </button>
                    </div>
                    <p className="font-mono text-xl font-bold text-green-600">₹{calculatedTotals.totalAmount.toFixed(2)}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Merchant Name:</span>
                    <p className="font-semibold text-gray-900">{businessName}</p>
                  </div>
                </div>
              </div>

              {/* Customer UPI ID Input */}
              <div className="border-t pt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your UPI ID (for verification)
                </label>
                <input
                  type="text"
                  value={customerUpiId}
                  onChange={(e) => setCustomerUpiId(e.target.value)}
                  placeholder="yourname@paytm / yourname@gpay"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  We need this to verify your payment
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">Payment Instructions</h4>
                <ol className="text-sm text-blue-700 space-y-1">
                  <li>1. Scan QR code or click &apos;Open in UPI App&apos;</li>
                  <li>2. Verify amount ₹{calculatedTotals.totalAmount.toFixed(2)} and complete payment</li>
                  <li>3. Enter your UPI ID above for verification</li>
                  <li>4. Click &apos;I have made the payment&apos; below</li>
                  <li>5. Enter transaction ID to confirm order</li>
                </ol>
              </div>

              <button
                onClick={handlePaymentMade}
                disabled={!customerUpiId.trim()}
                className="w-full text-white py-4 px-6 rounded-lg text-lg font-semibold transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ backgroundColor: 'var(--leaf-600)' }}
                onMouseEnter={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = 'var(--leaf-700)'; }}
                onMouseLeave={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = 'var(--leaf-600)'; }}
              >
                <CheckCircle className="w-5 h-5" />
                I have made the payment
              </button>
            </div>
          )}

          {paymentStep === 'confirmation' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Confirm Your Payment</h3>
                <p className="text-gray-600">Please provide transaction details for verification</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">Payment Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount Paid:</span>
                    <span className="font-semibold">₹{calculatedTotals.totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Your UPI ID:</span>
                    <span className="font-semibold">{customerUpiId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Paid to:</span>
                    <span className="font-semibold">{businessUpiId}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transaction ID / Reference Number
                </label>
                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="e.g., 123456789012"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Find this in your UPI app&apos;s transaction history
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={confirmPayment}
                  disabled={!transactionId.trim()}
                  className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Confirm & Place Order
                </button>
                <button
                  onClick={resetPayment}
                  className="w-full bg-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Back to Payment
                </button>
              </div>
            </div>
          )}

          {paymentStep === 'processing' && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 mx-auto mb-4" style={{ borderColor: 'var(--leaf-500)' }}></div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Processing Your Order</h4>
              <p className="text-gray-600">Please wait while we confirm your payment...</p>
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  Do not close this page. We are verifying your transaction and clearing your cart.
                </p>
              </div>
            </div>
          )}

          {paymentStep === 'success' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Order Placed Successfully!</h4>
              <p className="text-gray-600 mb-2">Transaction ID: {transactionId}</p>
              <p className="text-gray-600 mb-2">Your cart has been cleared and order is being processed.</p>
              <p className="text-gray-600 mb-6">Your order will be delivered soon.</p>
              <div className="space-y-3">
                <button
                  onClick={() => window.location.href = '/my-orders'}
                  className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors"
                >
                  View My Orders
                </button>
                <button
                  onClick={() => window.location.href = '/'}
                  className="w-full bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Order Summary (Invoice-style breakdown) */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h3>

          {/* Itemized list: Particulars, Qty, N/Rate, Value */}
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
            Items: {cartItems.length} &nbsp; Qty: {cartItems.reduce((s, i) => s + i.quantity, 0)} &nbsp; ₹{calculatedTotals.subtotal.toFixed(2)}
          </p>

          {/* GST Breakup Details (Amount INR) */}
          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-600 mb-1">&lt;&#8212;&#8212; GST Breakup Details &#8212;&#8212;&gt; (Amount INR)</p>
            <table className="w-full text-xs border border-gray-200 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="py-1 px-2 font-semibold text-gray-700 border-b w-8">#</th>
                  <th className="py-1 px-2 font-semibold text-gray-700 border-b text-right">Taxable Amt</th>
                  <th className="py-1 px-2 font-semibold text-gray-700 border-b text-right">CGST</th>
                  <th className="py-1 px-2 font-semibold text-gray-700 border-b text-right">SGST</th>
                  <th className="py-1 px-2 font-semibold text-gray-700 border-b text-right">Total Amt</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-1 px-2">1</td>
                  <td className="py-1 px-2 text-right">₹{calculatedTotals.subtotal.toFixed(2)}</td>
                  <td className="py-1 px-2 text-right">₹{((calculatedTotals.productTax ?? calculatedTotals.tax) / 2).toFixed(2)}</td>
                  <td className="py-1 px-2 text-right">₹{((calculatedTotals.productTax ?? calculatedTotals.tax) / 2).toFixed(2)}</td>
                  <td className="py-1 px-2 text-right">₹{(calculatedTotals.subtotal + (calculatedTotals.productTax ?? calculatedTotals.tax)).toFixed(2)}</td>
                </tr>
                {calculatedTotals.shippingCost > 0 && (calculatedTotals.deliveryGst ?? 0) > 0 && (
                  <tr className="border-b border-gray-100">
                    <td className="py-1 px-2">2</td>
                    <td className="py-1 px-2 text-right">₹{calculatedTotals.shippingCost.toFixed(2)} (Delivery)</td>
                    <td className="py-1 px-2 text-right">₹{((calculatedTotals.deliveryGst ?? 0) / 2).toFixed(2)}</td>
                    <td className="py-1 px-2 text-right">₹{((calculatedTotals.deliveryGst ?? 0) / 2).toFixed(2)}</td>
                    <td className="py-1 px-2 text-right">₹{(calculatedTotals.shippingCost + (calculatedTotals.deliveryGst ?? 0)).toFixed(2)}</td>
                  </tr>
                )}
                <tr className="bg-gray-50 font-semibold">
                  <td className="py-1 px-2">T:</td>
                  <td className="py-1 px-2 text-right">₹{(calculatedTotals.subtotal + calculatedTotals.shippingCost).toFixed(2)}</td>
                  <td className="py-1 px-2 text-right">₹{((calculatedTotals.tax || 0) / 2).toFixed(2)}</td>
                  <td className="py-1 px-2 text-right">₹{((calculatedTotals.tax || 0) / 2).toFixed(2)}</td>
                  <td className="py-1 px-2 text-right">₹{calculatedTotals.totalAmount.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="space-y-2 text-sm border-t pt-4">
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className={calculatedTotals.shippingCost === 0 ? 'text-green-600' : ''}>
                {calculatedTotals.shippingCost === 0 ? 'FREE' : `₹${calculatedTotals.shippingCost}`}
              </span>
            </div>
            {calculatedTotals.subtotal >= 1000 && calculatedTotals.shippingCost === 0 && (
              <div className="text-xs" style={{ color: 'var(--leaf-600)' }}>You saved ₹59 on shipping!</div>
            )}
            <div className="border-t pt-3">
              <div className="flex justify-between font-semibold text-lg">
                <span>Amount to pay</span>
                <span>₹{calculatedTotals.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-2">Payment Security</h4>
            <p className="text-xs text-gray-600">
              Your payment is processed securely. We do not store your financial information.
            </p>
          </div>

          {paymentStep === 'payment' && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Need Help?</h4>
              <p className="text-xs text-blue-700">
                If you face any issues with payment, please contact our support team.
              </p>
            </div>
          )}

          {paymentStep === 'confirmation' && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-medium text-yellow-800 mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Waiting for Confirmation
              </h4>
              <p className="text-xs text-yellow-700">
                Please enter your transaction ID above to complete your order.
              </p>
            </div>
          )}

          {paymentStep === 'processing' && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing Order
              </h4>
              <p className="text-xs text-blue-700">
                Your payment is being verified and order is being created.
              </p>
            </div>
          )}

          {paymentStep === 'success' && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Order Confirmed
              </h4>
              <p className="text-xs text-green-700">
                Your shopping cart has been cleared and your order is confirmed.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Alert Modal – themed pop-up */}
      {showAlertModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowAlertModal(false)}
            aria-hidden
          />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full border-2 overflow-hidden" style={{ borderColor: 'var(--leaf-200)' }}>
            <div className="px-6 py-4 border-b flex items-center gap-3" style={{ backgroundColor: 'var(--leaf-50)', borderColor: 'var(--leaf-200)' }}>
              <div className="p-2 rounded-xl" style={{ backgroundColor: 'var(--leaf-100)' }}>
                <AlertCircle className="w-5 h-5" style={{ color: 'var(--leaf-600)' }} />
              </div>
              <h3 className="text-lg font-semibold" style={{ color: 'var(--leaf-800)' }}>Notice</h3>
            </div>
            <div className="p-6">
              <p className="text-gray-700 leading-relaxed">{alertMessage}</p>
            </div>
            <div className="px-6 py-4 border-t flex justify-end" style={{ borderColor: 'var(--leaf-200)' }}>
              <button
                onClick={() => setShowAlertModal(false)}
                className="px-6 py-2.5 rounded-xl font-semibold text-white transition-colors"
                style={{ backgroundColor: 'var(--leaf-600)' }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--leaf-700)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--leaf-600)'; }}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}