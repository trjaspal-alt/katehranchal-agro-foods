import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { PageRoute, ShippingAddress, OrderRecord } from '../types';
import { 
  ShieldCheck, 
  Lock, 
  Truck, 
  CreditCard, 
  QrCode, 
  Building2, 
  Wallet, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle,
  Info,
  ExternalLink,
  X,
  Loader2
} from 'lucide-react';
import { BUSINESS_INFO } from '../data/businessInfo';

interface CheckoutPageProps {
  onNavigate: (route: PageRoute) => void;
  onOrderSuccess: (order: OrderRecord) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  onNavigate,
  onOrderSuccess,
}) => {
  const {
    cart,
    subtotal,
    estimatedTaxes,
    estimatedShipping,
    discountAmount,
    totalAmount,
    clearCart,
    addToCart,
  } = useCart();

  // Form State
  const [formData, setFormData] = useState<ShippingAddress>({
    fullName: '',
    phone: '',
    email: '',
    addressLine1: '',
    addressLine2: '',
    landmark: '',
    city: '',
    state: 'Uttar Pradesh',
    pinCode: '',
    addressType: 'Home',
  });

  const [billingData, setBillingData] = useState<ShippingAddress>({
    fullName: '',
    phone: '',
    email: '',
    addressLine1: '',
    addressLine2: '',
    landmark: '',
    city: '',
    state: 'Uttar Pradesh',
    pinCode: '',
    addressType: 'Home',
  });

  const [sameAsShippingBilling, setSameAsShippingBilling] = useState(true);
  const [selectedPaymentCategory, setSelectedPaymentCategory] = useState<string>('upi');
  const [customerNotes, setCustomerNotes] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Shipping Quote Calculation State
  const [shippingQuote, setShippingQuote] = useState<{
    serviceable: boolean;
    shippingFee: number;
    estimatedDays: string;
    carrierPartner: string;
    message?: string;
  } | null>(null);
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);

  // Test Gateway Modal State
  const [pendingGatewayOrder, setPendingGatewayOrder] = useState<{
    internalOrderId: string;
    internalOrderNumber: string;
    gatewayOrderId: string;
    amount: number;
    currency: string;
    isTestMode: boolean;
  } | null>(null);
  const [isSimulatingPayment, setIsSimulatingPayment] = useState(false);

  // Query shipping quote when PIN code reaches 6 digits
  useEffect(() => {
    if (formData.pinCode.length === 6 && /^\d+$/.test(formData.pinCode)) {
      handleCalculateShipping(formData.pinCode);
    }
  }, [formData.pinCode]);

  const handleCalculateShipping = async (pin: string) => {
    setIsCalculatingShipping(true);
    try {
      const res = await fetch('/api/shipping/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pinCode: pin,
          cartWeightGrams: cart.length * 750,
          cartSubtotal: subtotal,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setShippingQuote(data);
      }
    } catch (e) {
      console.error('Shipping calculation error', e);
    } finally {
      setIsCalculatingShipping(false);
    }
  };

  // If cart is empty and not viewing gateway modal
  if (cart.length === 0 && !pendingGatewayOrder && !isProcessing) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#F5EFEB] flex items-center justify-center mx-auto text-[#124328]">
          <ShieldCheck className="w-8 h-8 text-[#E0980B]" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-[#124328]">
          Your Shopping Cart is Empty
        </h2>
        <p className="text-sm text-[#132218]/70 max-w-md mx-auto">
          Please add items to your cart before proceeding through our secure checkout.
        </p>
        <button
          onClick={() => onNavigate('shop')}
          className="px-6 py-3 rounded bg-[#124328] text-[#FBF9F4] text-xs font-bold uppercase tracking-wider hover:bg-[#1A5A35] transition-colors"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const validateForm = () => {
    const err: Record<string, string> = {};
    if (!formData.fullName.trim()) err.fullName = 'Please enter your full name.';
    if (!formData.phone.trim() || formData.phone.replace(/\D/g, '').length < 10) {
      err.phone = 'Please enter a valid 10-digit Indian mobile number.';
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      err.email = 'Please enter a valid email address for order confirmation.';
    }
    if (!formData.addressLine1.trim()) err.addressLine1 = 'Please provide street and building address.';
    if (!formData.city.trim()) err.city = 'Please specify city.';
    if (!formData.state.trim()) err.state = 'Please specify state.';
    if (!formData.pinCode.trim() || formData.pinCode.length !== 6 || !/^\d+$/.test(formData.pinCode)) {
      err.pinCode = 'Please provide a valid 6-digit postal PIN code.';
    }
    if (!termsAccepted) {
      err.terms = 'Please acknowledge the store Terms & Conditions and Privacy Policy to proceed.';
    }

    if (!sameAsShippingBilling) {
      if (!billingData.fullName.trim()) err.billingFullName = 'Please enter billing contact name.';
      if (!billingData.addressLine1.trim()) err.billingAddress = 'Please enter billing address.';
      if (!billingData.city.trim()) err.billingCity = 'Please enter billing city.';
      if (!billingData.pinCode.trim() || billingData.pinCode.length !== 6) err.billingPin = 'Please enter billing PIN.';
    }

    setErrors(err);
    if (Object.keys(err).length > 0) {
      // Scroll to first error
      window.scrollTo({ top: 100, behavior: 'smooth' });
    }
    return Object.keys(err).length === 0;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);

    try {
      // Step 1: Call Backend to create internal order with validation
      const createOrderPayload = {
        items: cart.map((item) => ({
          productId: item.productId,
          variationId: item.packOption.id,
          name: item.name,
          slug: item.slug,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          packSize: item.packOption.sizeLabel,
        })),
        customer: {
          fullName: formData.fullName,
          phone: formData.phone,
          email: formData.email,
        },
        shippingAddress: {
          ...formData,
          country: 'India',
        },
        billingAddress: sameAsShippingBilling
          ? { ...formData, country: 'India' }
          : { ...billingData, country: 'India' },
        paymentMethod: selectedPaymentCategory.toUpperCase(),
        pinCode: formData.pinCode,
        state: formData.state,
        customerNotes,
      };

      const orderRes = await fetch('/api/checkout/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createOrderPayload),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok || !orderData.success) {
        setServerError(
          orderData.error ||
            'Failed to create order on server. Please check the items and try again.'
        );
        setIsProcessing(false);
        return;
      }

      // Step 2: Initialize Payment Gateway Order
      const gwRes = await fetch('/api/payments/create-gateway-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: orderData.orderId }),
      });

      const gwData = await gwRes.json();

      if (!gwRes.ok || !gwData.success) {
        setServerError(gwData.error || 'Payment gateway order initialization failed.');
        setIsProcessing(false);
        return;
      }

      // Step 3: Present Gateway Dialog (Emulates Razorpay / Gateway Modal)
      setPendingGatewayOrder({
        internalOrderId: orderData.orderId,
        internalOrderNumber: orderData.orderNumber,
        gatewayOrderId: gwData.gatewayOrder.gatewayOrderId,
        amount: gwData.gatewayOrder.amount,
        currency: gwData.gatewayOrder.currency,
        isTestMode: gwData.gatewayOrder.isTestMode,
      });

      setIsProcessing(false);
    } catch (err: any) {
      console.error('[Checkout Error]', err);
      setServerError('An unexpected network error occurred while contacting the checkout server.');
      setIsProcessing(false);
    }
  };

  // Gateway Simulation Action (Authorize with HMAC-SHA256 vs. Decline)
  const handleSimulatePayment = async (simulateFailure: boolean) => {
    if (!pendingGatewayOrder) return;

    setIsSimulatingPayment(true);
    setServerError(null);

    try {
      const res = await fetch('/api/payments/test-simulate-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: pendingGatewayOrder.internalOrderId,
          simulateFailure,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.verified) {
        if (simulateFailure) {
          setServerError('Simulated payment was cancelled or declined. The reservation has been released.');
        } else {
          setServerError(data.message || 'Payment verification failed on server.');
        }
        setPendingGatewayOrder(null);
        setIsSimulatingPayment(false);
        return;
      }

      // Successful verification!
      clearCart();
      setPendingGatewayOrder(null);
      setIsSimulatingPayment(false);

      // Convert server order structure to client OrderRecord
      const serverOrder = data.order;
      const clientOrderRecord: OrderRecord = {
        orderId: serverOrder.id,
        orderNumber: serverOrder.orderNumber,
        createdAt: serverOrder.createdAt,
        updatedAt: serverOrder.updatedAt,
        items: serverOrder.items.map((i: any) => ({
          id: `${i.productId}-${i.variationId}`,
          productId: i.productId,
          name: i.name,
          slug: i.slug,
          packOption: {
            id: i.variationId,
            sizeLabel: i.packSize,
            unitPrice: i.unitPrice,
            isDefault: true,
          },
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          primaryImage: i.primaryImage,
        })),
        subtotal: serverOrder.subtotal,
        taxAmount: serverOrder.taxAmount,
        cgst: serverOrder.cgst,
        sgst: serverOrder.sgst,
        igst: serverOrder.igst,
        deliveryCharge: serverOrder.deliveryCharge,
        discountAmount: serverOrder.discountAmount,
        totalAmount: serverOrder.totalAmount,
        currency: serverOrder.currency,
        shippingAddress: {
          fullName: serverOrder.shippingAddress.fullName,
          phone: serverOrder.shippingAddress.phone,
          email: serverOrder.shippingAddress.email,
          addressLine1: serverOrder.shippingAddress.addressLine1,
          addressLine2: serverOrder.shippingAddress.addressLine2,
          landmark: serverOrder.shippingAddress.landmark,
          city: serverOrder.shippingAddress.city,
          state: serverOrder.shippingAddress.state,
          pinCode: serverOrder.shippingAddress.pinCode,
          addressType: serverOrder.shippingAddress.addressType || 'Home',
        },
        paymentMethod: selectedPaymentCategory.toUpperCase(),
        paymentProvider: serverOrder.paymentProvider,
        paymentStatus: 'Paid',
        deliveryStatus: 'Confirmed',
        trackingNumber: serverOrder.trackingNumber,
        courierPartner: serverOrder.courierPartner,
        isTestOrder: true,
        history: serverOrder.history || [],
      };

      onOrderSuccess(clientOrderRecord);
    } catch (err: any) {
      console.error('[Payment Simulation Error]', err);
      setServerError('Failed to complete payment verification with server.');
      setIsSimulatingPayment(false);
    }
  };

  const paymentOptions = [
    {
      id: 'upi',
      label: 'UPI (Google Pay / PhonePe / Paytm / BHIM)',
      description: 'Instant UPI Intent and QR authorization with zero extra fees.',
      icon: QrCode,
    },
    {
      id: 'card',
      label: 'Debit / Credit Card (Visa, Mastercard, RuPay)',
      description: 'Processed securely via bank 3D-Secure 2.0 cryptographic channel.',
      icon: CreditCard,
    },
    {
      id: 'netbanking',
      label: 'Internet Banking',
      description: 'Direct authorization through 50+ major Indian scheduled banks.',
      icon: Building2,
    },
    {
      id: 'wallet',
      label: 'Digital Wallets',
      description: 'Airtel Money, Mobikwik, and supported verified balance wallets.',
      icon: Wallet,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Top Header & Breadcrumb */}
      <div className="flex items-center justify-between border-b border-[#124328]/10 pb-4 mb-8">
        <button
          onClick={() => onNavigate('shop')}
          className="flex items-center gap-1.5 text-xs text-[#132218]/70 hover:text-[#124328] font-medium transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Shopping</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-semibold text-[#1C602A]">
          <Lock className="w-4 h-4 text-[#1C602A]" />
          <span>256-Bit SSL Encrypted Checkout</span>
        </div>
      </div>

      {/* Global Server Notice / Error */}
      {serverError && (
        <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold">Checkout Notice</div>
            <p className="leading-relaxed">{serverError}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Form Column */}
        <div className="lg:col-span-7 space-y-8">
          {/* Architecture Compliance Notice */}
          <div className="p-4 rounded-xl bg-[#F5EFEB] border border-[#E0980B]/40 text-xs space-y-1.5 text-[#132218]/80">
            <div className="flex items-center gap-2 font-bold text-[#124328]">
              <ShieldCheck className="w-4 h-4 text-[#E0980B]" />
              <span>PCI-DSS Strict Compliant Architecture</span>
            </div>
            <p className="leading-relaxed text-[11px]">
              Customer card details, UPI PINs, and banking credentials are never collected or stored on our servers. When placing an order, transactions are authorized through a certified Indian payment gateway adapter with cryptographic HMAC-SHA256 signature verification.
            </p>
          </div>

          <form onSubmit={handlePlaceOrder} className="space-y-8">
            {/* 1. Customer Contact */}
            <div className="bg-white p-6 rounded-xl border border-[#124328]/10 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#124328]/10 pb-3">
                <h3 className="font-serif text-lg font-bold text-[#124328]">
                  1. Contact Information
                </h3>
                <span className="text-xs text-[#E0980B] font-medium">Guest Checkout Allowed</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#124328] block mb-1">
                    Email Address (for order tracking & invoice) *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full text-xs p-2.5 rounded border border-[#124328]/20 focus:outline-none focus:border-[#E0980B]"
                  />
                  {errors.email && (
                    <p className="text-[11px] text-red-600 mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#124328] block mb-1">
                    Mobile Phone Number (10 digits) *
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l border border-r-0 border-[#124328]/20 bg-[#F5EFEB] text-xs text-[#132218]/70 font-semibold">
                      +91
                    </span>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                      placeholder="94500 39346"
                      maxLength={10}
                      className="w-full text-xs p-2.5 rounded-r border border-[#124328]/20 focus:outline-none focus:border-[#E0980B]"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-[11px] text-red-600 mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>
            </div>

            {/* 2. Shipping Address */}
            <div className="bg-white p-6 rounded-xl border border-[#124328]/10 shadow-xs space-y-4">
              <div className="border-b border-[#124328]/10 pb-3">
                <h3 className="font-serif text-lg font-bold text-[#124328]">
                  2. Shipping Destination
                </h3>
                <p className="text-xs text-[#132218]/70 mt-0.5">
                  Orders are dispatched from our processing facility in Sambhal / Amroha, Uttar Pradesh.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-[#124328] block mb-1">
                    Full Recipient Name *
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Ramesh Chandra"
                    className="w-full text-xs p-2.5 rounded border border-[#124328]/20 focus:outline-none focus:border-[#E0980B]"
                  />
                  {errors.fullName && (
                    <p className="text-[11px] text-red-600 mt-1">{errors.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#124328] block mb-1">
                    Flat / House No., Building Name & Street *
                  </label>
                  <input
                    type="text"
                    value={formData.addressLine1}
                    onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                    placeholder="e.g. House No. 42, Civil Lines Road"
                    className="w-full text-xs p-2.5 rounded border border-[#124328]/20 focus:outline-none focus:border-[#E0980B]"
                  />
                  {errors.addressLine1 && (
                    <p className="text-[11px] text-red-600 mt-1">{errors.addressLine1}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-[#124328] block mb-1">
                      Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.landmark || ''}
                      onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                      placeholder="e.g. Near Shiv Temple"
                      className="w-full text-xs p-2.5 rounded border border-[#124328]/20 focus:outline-none focus:border-[#E0980B]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#124328] block mb-1">
                      Postal PIN Code *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.pinCode}
                        onChange={(e) => setFormData({ ...formData, pinCode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                        placeholder="6-digit Indian PIN code"
                        maxLength={6}
                        className="w-full text-xs p-2.5 rounded border border-[#124328]/20 focus:outline-none focus:border-[#E0980B]"
                      />
                      {isCalculatingShipping && (
                        <Loader2 className="w-4 h-4 text-[#E0980B] animate-spin absolute right-2.5 top-3" />
                      )}
                    </div>
                    {errors.pinCode && (
                      <p className="text-[11px] text-red-600 mt-1">{errors.pinCode}</p>
                    )}
                  </div>
                </div>

                {/* Shipping Quote feedback */}
                {shippingQuote && (
                  <div className="p-3 rounded-lg bg-[#F5EFEB] border border-[#124328]/10 text-xs text-[#132218] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-[#1C602A]" />
                      <span>
                        Courier Dispatch: <strong>{shippingQuote.carrierPartner}</strong> ({shippingQuote.estimatedDays})
                      </span>
                    </div>
                    <span className="font-bold text-[#124328]">
                      {shippingQuote.shippingFee === 0 ? 'Complimentary' : `₹${shippingQuote.shippingFee}`}
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-[#124328] block mb-1">
                      City / District *
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="e.g. Lucknow, Delhi, Bengaluru"
                      className="w-full text-xs p-2.5 rounded border border-[#124328]/20 focus:outline-none focus:border-[#E0980B]"
                    />
                    {errors.city && (
                      <p className="text-[11px] text-red-600 mt-1">{errors.city}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#124328] block mb-1">
                      State / Union Territory *
                    </label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      placeholder="e.g. Uttar Pradesh"
                      className="w-full text-xs p-2.5 rounded border border-[#124328]/20 focus:outline-none focus:border-[#E0980B]"
                    />
                    {errors.state && (
                      <p className="text-[11px] text-red-600 mt-1">{errors.state}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-2">
                  <span className="text-xs font-semibold text-[#124328]">Address Type:</span>
                  {(['Home', 'Work'] as const).map((type) => (
                    <label key={type} className="inline-flex items-center gap-1.5 text-xs text-[#132218] cursor-pointer">
                      <input
                        type="radio"
                        name="addressType"
                        checked={formData.addressType === type}
                        onChange={() => setFormData({ ...formData, addressType: type })}
                        className="text-[#124328] focus:ring-[#E0980B]"
                      />
                      <span>{type}</span>
                    </label>
                  ))}
                </div>

                {/* Billing Address Toggle */}
                <div className="pt-3 border-t border-[#124328]/10">
                  <label className="inline-flex items-center gap-2 text-xs text-[#132218] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sameAsShippingBilling}
                      onChange={(e) => setSameAsShippingBilling(e.target.checked)}
                      className="rounded text-[#124328] focus:ring-[#E0980B]"
                    />
                    <span>Billing address is identical to shipping address</span>
                  </label>
                </div>

                {/* Separate Billing Address Fields if unchecked */}
                {!sameAsShippingBilling && (
                  <div className="pt-3 border-t border-dashed border-[#124328]/20 space-y-3">
                    <div className="font-semibold text-xs text-[#124328]">Billing Address Details</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] text-[#124328] block mb-1">Billing Name *</label>
                        <input
                          type="text"
                          value={billingData.fullName}
                          onChange={(e) => setBillingData({ ...billingData, fullName: e.target.value })}
                          className="w-full text-xs p-2 rounded border border-[#124328]/20"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-[#124328] block mb-1">Billing Address Line 1 *</label>
                        <input
                          type="text"
                          value={billingData.addressLine1}
                          onChange={(e) => setBillingData({ ...billingData, addressLine1: e.target.value })}
                          className="w-full text-xs p-2 rounded border border-[#124328]/20"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-[#124328] block mb-1">Billing City *</label>
                        <input
                          type="text"
                          value={billingData.city}
                          onChange={(e) => setBillingData({ ...billingData, city: e.target.value })}
                          className="w-full text-xs p-2 rounded border border-[#124328]/20"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-[#124328] block mb-1">Billing PIN Code *</label>
                        <input
                          type="text"
                          value={billingData.pinCode}
                          onChange={(e) => setBillingData({ ...billingData, pinCode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                          maxLength={6}
                          className="w-full text-xs p-2 rounded border border-[#124328]/20"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 3. Secure Payment Selection */}
            <div className="bg-white p-6 rounded-xl border border-[#124328]/10 shadow-xs space-y-4">
              <div className="border-b border-[#124328]/10 pb-3">
                <h3 className="font-serif text-lg font-bold text-[#124328]">
                  3. Online Payment Gateway Selection
                </h3>
                <p className="text-xs text-[#132218]/70 mt-0.5">
                  Select payment mode. All payments are verified securely on the server with HMAC-SHA256 signatures.
                </p>
              </div>

              <div className="space-y-3">
                {paymentOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = selectedPaymentCategory === opt.id;
                  return (
                    <label
                      key={opt.id}
                      className={`flex items-start gap-3.5 p-3.5 rounded-lg border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[#124328] bg-[#F5EFEB]/70 shadow-xs'
                          : 'border-[#124328]/15 hover:border-[#E0980B]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={isSelected}
                        onChange={() => setSelectedPaymentCategory(opt.id)}
                        className="mt-1 text-[#124328] focus:ring-[#E0980B]"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 font-semibold text-xs text-[#124328]">
                          <Icon className="w-4 h-4 text-[#E0980B]" />
                          <span>{opt.label}</span>
                        </div>
                        <div className="text-[11px] text-[#132218]/70 mt-0.5 leading-normal">
                          {opt.description}
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>

              <div className="p-3 rounded-md bg-[#FBF9F4] border border-[#124328]/10 text-[11px] text-[#132218]/70 flex items-center gap-2">
                <Info className="w-4 h-4 text-[#E0980B] shrink-0" />
                <span>
                  Cash on Delivery (COD) is currently inactive pending regional logistics cash-handling approval.
                </span>
              </div>
            </div>

            {/* 4. Customer Dispatch Notes */}
            <div className="bg-white p-6 rounded-xl border border-[#124328]/10 shadow-xs space-y-2">
              <label className="text-xs font-semibold text-[#124328] block">
                Dispatch / Delivery Instructions (Optional)
              </label>
              <textarea
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
                placeholder="e.g. Leave package with society security guard if unavailable."
                rows={2}
                className="w-full text-xs p-2.5 rounded border border-[#124328]/20 focus:outline-none focus:border-[#E0980B]"
              />
            </div>

            {/* 5. Terms & Privacy Consent (Unchecked by default as mandated) */}
            <div className="space-y-2">
              <label className="flex items-start gap-2.5 text-xs text-[#132218] cursor-pointer">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 rounded text-[#124328] focus:ring-[#E0980B]"
                />
                <span className="leading-relaxed">
                  I have read and unconditionally agree to the Katehranchal Agro Foods{' '}
                  <button
                    type="button"
                    onClick={() => onNavigate('policy-terms')}
                    className="underline text-[#124328] font-semibold hover:text-[#E0980B]"
                  >
                    Terms and Conditions
                  </button>{' '}
                  and{' '}
                  <button
                    type="button"
                    onClick={() => onNavigate('policy-privacy')}
                    className="underline text-[#124328] font-semibold hover:text-[#E0980B]"
                  >
                    Privacy Policy
                  </button>
                  .
                </span>
              </label>
              {errors.terms && (
                <p className="text-[11px] text-red-600 pl-6">{errors.terms}</p>
              )}
            </div>

            {/* Place Order Submit Action */}
            <div>
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-4 px-6 rounded-lg bg-[#124328] text-[#FBF9F4] font-serif text-base font-bold tracking-wider hover:bg-[#1A5A35] transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Communicating with Secure Server...</span>
                  </>
                ) : (
                  <span>Proceed to Payment Gateway • ₹{totalAmount}</span>
                )}
              </button>
              <div className="text-center text-[11px] text-[#132218]/60 mt-2">
                Clicking opens the secure payment authorization dialog.
              </div>
            </div>
          </form>
        </div>

        {/* Right Summary Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-[#124328]/10 shadow-xs space-y-5 sticky top-24">
            <h3 className="font-serif text-lg font-bold text-[#124328] border-b border-[#124328]/10 pb-3">
              Order Summary ({cart.length} item{cart.length > 1 ? 's' : ''})
            </h3>

            {/* Item Breakdown */}
            <div className="space-y-3.5 max-h-60 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-3 text-xs">
                  <img
                    src={item.primaryImage}
                    alt={item.name}
                    className="w-12 h-12 object-contain rounded bg-[#F5EFEB] p-1 border border-[#124328]/10 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-serif font-bold text-[#124328] truncate">
                      {item.name}
                    </div>
                    <div className="text-[11px] text-[#1C602A] truncate">
                      {item.packOption.sizeLabel.split('(')[0]}
                    </div>
                    <div className="text-[11px] text-[#132218]/60">
                      Qty: {item.quantity} × ₹{item.unitPrice}
                    </div>
                  </div>
                  <div className="font-bold text-[#124328] shrink-0">
                    ₹{item.unitPrice * item.quantity}
                  </div>
                </div>
              ))}
            </div>

            {/* Financial Totals */}
            <div className="space-y-2 border-t border-[#124328]/10 pt-4 text-xs text-[#132218]/80">
              <div className="flex justify-between">
                <span>Cart Subtotal</span>
                <span className="font-semibold text-[#124328]">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Applicable Taxes</span>
                <span>{estimatedTaxes > 0 ? `₹${estimatedTaxes}` : 'Calculated after verification'}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery & Packaging</span>
                <span>
                  {estimatedShipping === 0 ? (
                    <span className="text-[#1C602A] font-semibold">Free Delivery Active</span>
                  ) : (
                    `₹${estimatedShipping}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#124328] border-t border-[#124328]/10 pt-3">
                <span>Total Amount</span>
                <span className="font-serif text-xl text-[#124328]">₹{totalAmount}</span>
              </div>
            </div>

            {/* Quality Seal */}
            <div className="p-3 rounded-lg bg-[#F5EFEB] border border-[#E0980B]/30 text-[11px] text-[#132218]/80 space-y-1">
              <div className="font-bold text-[#124328]">Katehranchal Quality Assured</div>
              <p>
                All products dispatched in food-grade, tamper-evident glass or recyclable containers. Official support available via WhatsApp: {BUSINESS_INFO.supportWhatsAppDisplay}.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SECURE PAYMENT GATEWAY DIALOG (Test Mode Simulator)       */}
      {/* ========================================================= */}
      {pendingGatewayOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-[#124328]/20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-[#124328] text-[#FBF9F4] p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#E0980B] flex items-center justify-center text-[#124328] font-bold text-sm">
                  ₹
                </div>
                <div>
                  <div className="text-xs uppercase tracking-widest text-[#E0980B] font-semibold">
                    Payment Gateway • Test Mode
                  </div>
                  <div className="font-serif text-base font-bold">
                    Katehranchal Agro Foods
                  </div>
                </div>
              </div>
              <button
                onClick={() => setPendingGatewayOrder(null)}
                className="text-[#FBF9F4]/70 hover:text-[#FBF9F4] p-1 rounded transition-colors"
                title="Cancel Gateway Dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {/* Order Meta Header */}
              <div className="p-4 rounded-xl bg-[#F5EFEB] border border-[#124328]/10 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-[#132218]/60 uppercase tracking-wider">
                    Order Reference
                  </div>
                  <div className="font-mono text-xs font-bold text-[#124328]">
                    {pendingGatewayOrder.internalOrderNumber}
                  </div>
                  <div className="text-[10px] text-[#132218]/50 mt-0.5">
                    Gateway ID: {pendingGatewayOrder.gatewayOrderId}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] text-[#132218]/60 uppercase tracking-wider">
                    Payable
                  </div>
                  <div className="font-serif text-xl font-bold text-[#124328]">
                    ₹{pendingGatewayOrder.amount}
                  </div>
                </div>
              </div>

              {/* Gateway Cryptographic Badge */}
              <div className="p-3 rounded-lg border border-[#1C602A]/20 bg-[#1C602A]/5 text-xs text-[#124328] space-y-1">
                <div className="flex items-center gap-2 font-bold text-[#1C602A]">
                  <ShieldCheck className="w-4 h-4" />
                  <span>HMAC-SHA256 Cryptographic Verification Sandbox</span>
                </div>
                <p className="text-[11px] text-[#132218]/80 leading-relaxed">
                  The server validates every transaction signature before updating order status or committing inventory deductions. Live gateway payments remain safely disarmed until business legal reviews and merchant credentials are provided.
                </p>
              </div>

              {/* Simulation Options */}
              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  disabled={isSimulatingPayment}
                  onClick={() => handleSimulatePayment(false)}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#1C602A] text-white font-semibold text-xs tracking-wider uppercase hover:bg-[#154c21] transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {isSimulatingPayment ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Verifying Cryptographic Signature...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Authorize Payment (Simulate Gateway Success)</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  disabled={isSimulatingPayment}
                  onClick={() => handleSimulatePayment(true)}
                  className="w-full py-2.5 px-4 rounded-xl bg-white border border-red-200 text-red-700 font-semibold text-xs tracking-wider uppercase hover:bg-red-50 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <span>Decline / Cancel (Test Reservation Release)</span>
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-[#F5EFEB] px-6 py-3 border-t border-[#124328]/10 text-center text-[10px] text-[#132218]/60">
              Katehranchal Group • Safe Commerce Gateway Integration
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
