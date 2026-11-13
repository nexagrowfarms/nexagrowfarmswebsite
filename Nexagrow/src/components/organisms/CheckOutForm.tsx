'use client';

import { useState, useMemo } from 'react';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { CartItem } from '@/hooks/useCart';
import axios from 'axios';
import { formatPricingDisplayLabel } from '@/lib/pricingDisplay';

export interface ShippingAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string; // Optional
  city: string;
  state: string;
  pincode: string;
  landmark?: string; // Optional
}

interface UPIPaymentData {
  userEmail: string;
  shippingAddress: ShippingAddress;
  totals: {
    subtotal: number;
    shippingCost: number;
    tax: number;
    productTax?: number;
    deliveryGst?: number;
    totalAmount: number;
  };
}

interface OrderResult {
  _id: string;
  orderId: string; 
  userEmail: string;
  shippingAddress: ShippingAddress;
  paymentMethod: 'cash_on_delivery' | 'razorpay';
  items: {
    productId: string;
    productName: string;
    quantity: number;
    selectedPricing: {
      quantity: number;
      unit: string;
      price: number;
    } | null;
    itemTotal: number;
  }[];
  createdAt?: string;
  totalAmount: number;
  updatedAt?: string;
  estimatedDelivery?: string;
  orderStatus: string;
}

interface CheckoutFormProps {
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
  userName: string;
  onBack: () => void;
  // Make sure this signature matches exactly
  onPaymentMethodSelect: (method: 'razorpay' | 'cod', data?: UPIPaymentData | undefined) => void;
}

export default function CheckoutForm({ 
  cartItems, 
  totals, 
  userEmail, 
  userName, 
  onBack, 
  onPaymentMethodSelect 
}: CheckoutFormProps) {
  const [formData, setFormData] = useState<ShippingAddress & { email: string }>({
    fullName: userName,
    email: userEmail,
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    landmark: ''
  });

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'razorpay' | ''>('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderResult, setOrderResult] = useState<OrderResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  // Use totals from useCart (already includes product-specific GST + 18% on delivery)
  const calculatedTotals = useMemo(() => {
    const subtotal = totals.subtotal;
    const shippingCost = totals.shippingCost ?? (subtotal >= 1000 ? 0 : 59);
    const tax = totals.tax;
    const productTax = totals.productTax ?? tax;
    const deliveryGst = totals.deliveryGst ?? 0;
    return {
      subtotal,
      shippingCost,
      tax,
      productTax,
      deliveryGst,
      totalAmount: totals.totalAmount
    };
  }, [totals]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Required field validation
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.addressLine1.trim()) newErrors.addressLine1 = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required';

    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation
    if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    // Pincode validation
    if (formData.pincode && !/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Please enter a valid 6-digit pincode';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ CLEAR CART FUNCTION
  const clearCart = async () => {
    try {
      console.log('🗑️ Clearing cart after successful COD order...');
      const response = await axios.post('/api/cart/clear', {}, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000, // 10 second timeout
      });

      if (response.status === 200 && response.data.success) {
        console.log('✅ Cart cleared successfully after COD order');
      } else {
        console.warn('⚠️ Cart clearing returned unexpected response:', response.data);
      }
    } catch (error) {
      console.error('❌ Error clearing cart after COD order:', error);
      // Don't fail the success flow if cart clearing fails
    }
  };

  const handlePaymentMethodChange = (method: 'cod' | 'razorpay') => {
    setPaymentMethod(method);
    
    if (method === 'razorpay') {
      if (!validateForm()) {
        setAlertMessage('Please fill in all required fields correctly before proceeding to payment');
        setShowAlertModal(true);
        setPaymentMethod('');
        return;
      }
      const shippingAddress: ShippingAddress = {
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        addressLine1: formData.addressLine1.trim(),
        addressLine2: formData.addressLine2?.trim() || '',
        city: formData.city.trim(),
        state: formData.state.trim(),
        pincode: formData.pincode.trim(),
        landmark: formData.landmark?.trim() || ''
      };
      onPaymentMethodSelect('razorpay', {
        userEmail: formData.email.trim(),
        shippingAddress,
        totals: calculatedTotals
      });
    } else {
      onPaymentMethodSelect('cod');
    }
  };

  const isFormValid = useMemo(() => {
    const requiredFields = ['fullName', 'email', 'phone', 'addressLine1', 'city', 'state', 'pincode'];
    const hasAllRequiredFields = requiredFields.every(field => 
      formData[field as keyof typeof formData]?.trim() ?? '' !== ''
    );
    
    // Check for validation errors
    const hasNoErrors = Object.keys(errors).length === 0;
    
    return hasAllRequiredFields && hasNoErrors && paymentMethod;
  }, [formData, errors, paymentMethod]);

  const placeOrder = async () => {
    if (!validateForm() || !paymentMethod) return;

    setIsPlacingOrder(true);

    try {
      // Prepare shipping address without email
      const shippingAddress: ShippingAddress = {
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        addressLine1: formData.addressLine1.trim(),
        addressLine2: formData.addressLine2?.trim() || '',
        city: formData.city.trim(),
        state: formData.state.trim(),
        pincode: formData.pincode.trim(),
        landmark: formData.landmark?.trim() || ''
      };

      const orderData = {
        userEmail: formData.email.trim(),
        shippingAddress: shippingAddress,
        paymentMethod: paymentMethod === 'cod' ? 'cash_on_delivery' : 'razorpay',
        cartItems: cartItems.map(item => ({
          productId: item.product._id,
          quantity: item.quantity,
          selectedPricing: item.selectedPricing,
          product: item.product // Include product details for the order
        })),
        totals: calculatedTotals, // ✅ Include totals for consistent calculation
        notes: '' // Add notes field if needed
      };

      console.log('📦 COD Order Data Being Sent:', {
        userEmail: orderData.userEmail,
        shippingAddress: orderData.shippingAddress,
        paymentMethod: orderData.paymentMethod,
        cartItemsCount: orderData.cartItems.length,
        totals: orderData.totals
      });

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        console.log('🎉 COD Order placed successfully!', {
          orderId: result.order?.orderId,
          totalAmount: result.order?.totalAmount
        });

        // ✅ CLEAR CART AFTER SUCCESSFUL COD ORDER
        await clearCart();

        setOrderResult(result.order);
        setShowSuccessModal(true);
      } else {
        console.error('COD Order placement failed:', result);
        setAlertMessage('Failed to place order: ' + (result.error || 'Unknown error'));
        setShowAlertModal(true);
      }
    } catch (error) {
      console.error('Error placing COD order:', error);
      setAlertMessage('Failed to place order. Please try again.');
      setShowAlertModal(true);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    window.location.href = '/my-orders'; // Redirect to orders page
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
        <h2 className="text-2xl font-semibold text-gray-800">Shipping Details</h2>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column - Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Delivery Information</h3>
          
          <div className="space-y-4">
            {/* Name and Email */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.fullName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter 10-digit mobile number"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address Line 1 *
              </label>
              <input
                type="text"
                name="addressLine1"
                value={formData.addressLine1}
                onChange={handleInputChange}
                placeholder="House no, Building name, Street"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.addressLine1 ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {errors.addressLine1 && <p className="text-red-500 text-xs mt-1">{errors.addressLine1}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address Line 2
              </label>
              <input
                type="text"
                name="addressLine2"
                value={formData.addressLine2}
                onChange={handleInputChange}
                placeholder="Area, Colony, Sector (Optional)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* City, State, Pincode */}
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.city ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State *
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.state ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pincode *
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  placeholder="6-digit code"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.pincode ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
              </div>
            </div>

            {/* Landmark */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Landmark
              </label>
              <input
                type="text"
                name="landmark"
                value={formData.landmark}
                onChange={handleInputChange}
                placeholder="Nearby landmark (Optional)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Right Column - Order Summary & Payment */}
        <div className="space-y-6">
          {/* Order Summary – Invoice-style breakdown */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h3>

            {/* Itemized list: Particulars, Qty, N/Rate, Value */}
            <div className="overflow-x-auto mb-3">
              <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="py-2 px-3 font-semibold text-gray-700 border-b">Particulars</th>
                    <th className="py-2 px-3 font-semibold text-gray-700 border-b text-center w-14">Qty</th>
                    <th className="py-2 px-3 font-semibold text-gray-700 border-b text-right">N/Rate</th>
                    <th className="py-2 px-3 font-semibold text-gray-700 border-b text-right">Value</th>
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
                        <td className="py-2 px-3 text-gray-800">{particulars}</td>
                        <td className="py-2 px-3 text-center">{item.quantity}</td>
                        <td className="py-2 px-3 text-right">₹{unitPrice.toFixed(2)}</td>
                        <td className="py-2 px-3 text-right">₹{value.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              Items: {cartItems.length} &nbsp; Qty: {cartItems.reduce((s, i) => s + i.quantity, 0)} &nbsp; ₹{calculatedTotals.subtotal.toFixed(2)}
            </p>

            {/* GST Breakup Details (Amount INR) */}
            <div className="mb-4">
              <p className="text-xs font-semibold text-gray-600 mb-2">&lt;&#8212;&#8212; GST Breakup Details &#8212;&#8212;&gt; (Amount INR)</p>
              <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="py-1.5 px-2 font-semibold text-gray-700 border-b w-12">#</th>
                    <th className="py-1.5 px-2 font-semibold text-gray-700 border-b text-right">Taxable Amt</th>
                    <th className="py-1.5 px-2 font-semibold text-gray-700 border-b text-right">CGST</th>
                    <th className="py-1.5 px-2 font-semibold text-gray-700 border-b text-right">SGST</th>
                    <th className="py-1.5 px-2 font-semibold text-gray-700 border-b text-right">Total Amt</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-1.5 px-2">1</td>
                    <td className="py-1.5 px-2 text-right">₹{calculatedTotals.subtotal.toFixed(2)}</td>
                    <td className="py-1.5 px-2 text-right">₹{((calculatedTotals.productTax || 0) / 2).toFixed(2)}</td>
                    <td className="py-1.5 px-2 text-right">₹{((calculatedTotals.productTax || 0) / 2).toFixed(2)}</td>
                    <td className="py-1.5 px-2 text-right">₹{(calculatedTotals.subtotal + (calculatedTotals.productTax || 0)).toFixed(2)}</td>
                  </tr>
                  {calculatedTotals.shippingCost > 0 && calculatedTotals.deliveryGst !== undefined && (
                    <tr className="border-b border-gray-100">
                      <td className="py-1.5 px-2">2</td>
                      <td className="py-1.5 px-2 text-right">₹{calculatedTotals.shippingCost.toFixed(2)} (Delivery)</td>
                      <td className="py-1.5 px-2 text-right">₹{((calculatedTotals.deliveryGst || 0) / 2).toFixed(2)}</td>
                      <td className="py-1.5 px-2 text-right">₹{((calculatedTotals.deliveryGst || 0) / 2).toFixed(2)}</td>
                      <td className="py-1.5 px-2 text-right">₹{(calculatedTotals.shippingCost + (calculatedTotals.deliveryGst || 0)).toFixed(2)}</td>
                    </tr>
                  )}
                  <tr className="bg-gray-50 font-semibold">
                    <td className="py-1.5 px-2">T:</td>
                    <td className="py-1.5 px-2 text-right">₹{(calculatedTotals.subtotal + calculatedTotals.shippingCost).toFixed(2)}</td>
                    <td className="py-1.5 px-2 text-right">₹{((calculatedTotals.tax || 0) / 2).toFixed(2)}</td>
                    <td className="py-1.5 px-2 text-right">₹{((calculatedTotals.tax || 0) / 2).toFixed(2)}</td>
                    <td className="py-1.5 px-2 text-right">₹{calculatedTotals.totalAmount.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Shipping & Total */}
            <div className="space-y-2 text-sm border-t pt-4">
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className={calculatedTotals.shippingCost === 0 ? 'text-green-600' : ''}>
                  {calculatedTotals.shippingCost === 0 ? 'FREE' : `₹${calculatedTotals.shippingCost}`}
                </span>
              </div>
              {calculatedTotals.subtotal >= 1000 && calculatedTotals.shippingCost === 0 && (
                <div className="text-xs text-green-600">🎉 You saved ₹59 on shipping!</div>
              )}
              {calculatedTotals.subtotal < 1000 && (
                <div className="text-xs text-blue-600">Add ₹{(1000 - calculatedTotals.subtotal).toFixed(2)} more to get FREE shipping!</div>
              )}
              <div className="border-t pt-3">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Amount to pay</span>
                  <span>₹{calculatedTotals.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Payment Method</h3>
            
            <div className="space-y-3">
              {/* Cash on Delivery */}
              <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                paymentMethod === 'cod' 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => handlePaymentMethodChange('cod')}
                  className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                />
                <div className="ml-3">
                  <div className="font-medium text-gray-800">Cash on Delivery</div>
                  <div className="text-sm text-gray-600">Pay when your order arrives</div>
                </div>
                <div className="ml-auto">
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">Recommended</span>
                </div>
              </label>

              {/* Razorpay / Online Payment */}
              <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                paymentMethod === 'razorpay' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="razorpay"
                  checked={paymentMethod === 'razorpay'}
                  onChange={() => handlePaymentMethodChange('razorpay')}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <div className="ml-3">
                  <div className="font-medium text-gray-800">Pay with Razorpay</div>
                  <div className="text-sm text-gray-600">Card, UPI, Netbanking, Wallet</div>
                </div>
                <div className="ml-auto">
                  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">Instant</span>
                </div>
              </label>
            </div>

            {!paymentMethod && (
              <p className="text-red-500 text-sm mt-2">Please select a payment method</p>
            )}
          </div>

          {/* Place Order Button */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <button
              onClick={placeOrder}
              disabled={!isFormValid || isPlacingOrder || paymentMethod === 'razorpay'}
              className={`w-full py-4 px-6 rounded-lg text-lg font-semibold transition-colors ${
                isFormValid && paymentMethod === 'cod' && !isPlacingOrder
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isPlacingOrder ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Placing Order...</span>
                </div>
              ) : (
                `Place Order - ₹${calculatedTotals.totalAmount.toFixed(2)}`
              )}
            </button>
            
            {paymentMethod === 'razorpay' && (
              <p className="text-sm text-blue-600 mt-2 text-center">
                Online payment selected - proceeding to Razorpay...
              </p>
            )}

            {paymentMethod === 'cod' && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800 text-center">
                  ✓ No advance payment required. Pay when you receive your order.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Alert Modal – themed pop-up for validation/error messages */}
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
              <h3 className="text-lg font-semibold" style={{ color: 'var(--leaf-800)' }}>Please Complete</h3>
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

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                Order Placed Successfully!
              </h3>
              
              <p className="text-gray-600 mb-2">
                Your order has been confirmed and your cart has been cleared.
              </p>

              <p className="text-gray-600 mb-4">
                Your order will be delivered soon.
              </p>
              
              {orderResult && (
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-600">Order ID</p>
                  <p className="font-semibold text-gray-800">{orderResult.orderId}</p>
                  <p className="text-sm text-gray-600 mt-2">
                    Total Amount: ₹{orderResult.totalAmount}
                  </p>
                  <p className="text-sm text-gray-600">
                    Estimated Delivery: {orderResult.estimatedDelivery ? 
                      new Date(orderResult.estimatedDelivery).toLocaleDateString() : 
                      '7-10 business days'
                    }
                  </p>
                </div>
              )}
              
              <div className="space-y-3">
                <button
                  onClick={closeSuccessModal}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
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
          </div>
        </div>
      )}
    </div>
  );
}