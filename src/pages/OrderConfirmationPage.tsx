import React from 'react';
import { OrderRecord, PageRoute } from '../types';
import { BUSINESS_INFO } from '../data/businessInfo';
import { 
  CheckCircle2, 
  Package, 
  MapPin, 
  CreditCard, 
  MessageCircle, 
  Mail, 
  ArrowRight, 
  Clock, 
  FileText,
  Truck,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

interface OrderConfirmationPageProps {
  order: OrderRecord | null;
  onNavigate: (route: PageRoute) => void;
  onOpenAccount: () => void;
}

export const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({
  order,
  onNavigate,
  onOpenAccount,
}) => {
  // Guard: Never display success unless an order has actually been created
  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#F5EFEB] flex items-center justify-center mx-auto text-[#124328]">
          <FileText className="w-8 h-8 text-[#E0980B]" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-[#124328]">
          No Active Order Record Found
        </h2>
        <p className="text-xs sm:text-sm text-[#132218]/70">
          An order confirmation view is only generated after an order has been successfully initiated through our secure checkout.
        </p>
        <button
          onClick={() => onNavigate('shop')}
          className="px-6 py-2.5 rounded bg-[#124328] text-[#FBF9F4] text-xs font-semibold uppercase tracking-wider hover:bg-[#1A5A35] transition-colors"
        >
          Return to Catalogue
        </button>
      </div>
    );
  }

  const orderDateFormatted = new Date(order.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const displayOrderNumber = order.orderNumber || order.orderId;
  const isPaid = order.paymentStatus === 'Paid' || order.paymentStatus === 'Payment Verified';
  const isFailed = order.paymentStatus === 'Failed' || order.paymentStatus === 'Payment Failed';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8">
      {/* Header Banner according to verified payment status */}
      <div className={`p-6 sm:p-8 rounded-2xl bg-white border ${
        isPaid 
          ? 'border-[#1C602A]/30' 
          : isFailed 
            ? 'border-red-300' 
            : 'border-amber-300'
      } shadow-sm text-center space-y-3`}>
        <div className={`w-16 h-16 rounded-full ${
          isPaid 
            ? 'bg-[#1C602A]/10 text-[#1C602A]' 
            : isFailed 
              ? 'bg-red-50 text-red-600' 
              : 'bg-amber-50 text-amber-600'
        } flex items-center justify-center mx-auto`}>
          {isPaid ? (
            <CheckCircle2 className="w-10 h-10 stroke-[2.2]" />
          ) : isFailed ? (
            <AlertTriangle className="w-10 h-10 stroke-[2.2]" />
          ) : (
            <Clock className="w-10 h-10 stroke-[2.2]" />
          )}
        </div>

        <div className={`text-xs font-bold uppercase tracking-widest ${
          isPaid ? 'text-[#1C602A]' : isFailed ? 'text-red-700' : 'text-amber-700'
        }`}>
          {isPaid 
            ? 'Order Confirmed & Payment Verified' 
            : isFailed 
              ? 'Payment Verification Unsuccessful' 
              : 'Payment Verification in Progress'}
        </div>

        <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#124328]">
          {isPaid ? 'Thank You for Your Trust' : 'Order Status Notice'}
        </h1>

        <div className="max-w-xl mx-auto text-xs sm:text-sm text-[#132218]/75 leading-relaxed">
          {isPaid ? (
            <p>
              Your order has been recorded in our dispatch queue. A formal digital confirmation notice and GST tax invoice have been generated for{' '}
              <strong className="text-[#124328]">{order.shippingAddress.email}</strong>.
            </p>
          ) : isFailed ? (
            <p className="text-red-700">
              Payment could not be verified by the banking gateway. No funds were captured. Please retry checkout or contact support if you were debited.
            </p>
          ) : (
            <div className="p-3 bg-amber-50 rounded-lg text-amber-900 text-xs font-medium">
              Your payment confirmation is being verified. Please do not make another payment until the status is updated.
            </div>
          )}
        </div>

        {/* Order Identifier Capsule */}
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#F5EFEB] border border-[#124328]/10 text-xs font-semibold text-[#124328] mt-2">
          <span>Order Number: <strong>{displayOrderNumber}</strong></span>
          <span>•</span>
          <span>Status: <strong className="text-[#1C602A]">{order.deliveryStatus}</strong></span>
        </div>
      </div>

      {/* Two Column Detailed Receipt */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shipping & Payment Meta */}
        <div className="p-6 rounded-xl bg-white border border-[#124328]/10 shadow-xs space-y-4">
          <div className="flex items-center gap-2 font-serif text-base font-bold text-[#124328] border-b border-[#124328]/10 pb-2">
            <MapPin className="w-4 h-4 text-[#E0980B]" />
            <span>Delivery Destination</span>
          </div>

          <div className="text-xs text-[#132218]/80 space-y-1 leading-relaxed">
            <div className="font-bold text-[#124328] text-sm">
              {order.shippingAddress.fullName}
            </div>
            <div>{order.shippingAddress.addressLine1}</div>
            {order.shippingAddress.landmark && (
              <div>Landmark: {order.shippingAddress.landmark}</div>
            )}
            <div>
              {order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pinCode}
            </div>
            <div className="pt-2 text-[#124328]">
              Contact: <strong>+91 {order.shippingAddress.phone}</strong>
            </div>
          </div>

          <div className="pt-4 border-t border-[#124328]/10 space-y-2">
            <div className="flex items-center gap-2 font-serif text-sm font-bold text-[#124328]">
              <CreditCard className="w-4 h-4 text-[#E0980B]" />
              <span>Payment & Gateway Information</span>
            </div>
            <div className="text-xs text-[#132218]/80 space-y-1">
              <div>Mode: <strong>{order.paymentMethod}</strong></div>
              <div>
                Payment Verification:{' '}
                <strong className={isPaid ? 'text-[#1C602A]' : 'text-amber-700'}>
                  {isPaid ? 'Verified Paid (HMAC-SHA256 Signed)' : order.paymentStatus}
                </strong>
              </div>
              <div className="text-[11px] text-[#132218]/60">Date: {orderDateFormatted}</div>
            </div>
          </div>

          {/* Tracking Area */}
          <div className="pt-4 border-t border-[#124328]/10 space-y-2">
            <div className="flex items-center gap-2 font-serif text-sm font-bold text-[#124328]">
              <Truck className="w-4 h-4 text-[#E0980B]" />
              <span>Logistics & Courier Tracking</span>
            </div>
            <div className="p-3 rounded-lg bg-[#F5EFEB] border border-[#124328]/10 text-xs space-y-1 text-[#132218]/80">
              {order.trackingNumber ? (
                <div>
                  <div className="text-[#124328] font-semibold">
                    Carrier Partner: {order.courierPartner || 'Delhivery Surface'}
                  </div>
                  <div className="font-mono text-xs mt-0.5">
                    AWB Tracking: <strong>{order.trackingNumber}</strong>
                  </div>
                </div>
              ) : (
                <div className="text-[11px] leading-relaxed">
                  <strong>Tracking Status:</strong> Scheduled for warehouse packaging & carrier scan. Tracking reference will be dispatched via email and customer account portal.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Order Itemized Summary */}
        <div className="p-6 rounded-xl bg-white border border-[#124328]/10 shadow-xs space-y-4">
          <div className="flex items-center gap-2 font-serif text-base font-bold text-[#124328] border-b border-[#124328]/10 pb-2">
            <Package className="w-4 h-4 text-[#E0980B]" />
            <span>Purchased Items ({order.items.length})</span>
          </div>

          <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between text-xs pb-2 border-b border-[#124328]/5">
                <div>
                  <div className="font-serif font-bold text-[#124328]">{item.name}</div>
                  <div className="text-[11px] text-[#1C602A]">{item.packOption.sizeLabel.split('(')[0]}</div>
                  <div className="text-[11px] text-[#132218]/60">Qty: {item.quantity} × ₹{item.unitPrice}</div>
                </div>
                <div className="font-bold text-[#124328]">
                  ₹{item.unitPrice * item.quantity}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-[#124328]/10 pt-3 space-y-1.5 text-xs text-[#132218]/80">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{order.subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>GST</span>
              <span>₹{order.taxAmount}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Charge</span>
              <span>{order.deliveryCharge === 0 ? 'Complimentary' : `₹${order.deliveryCharge}`}</span>
            </div>
            <div className="flex justify-between font-bold text-sm text-[#124328] pt-2 border-t border-[#124328]/10">
              <span>Total Paid</span>
              <span className="font-serif text-base">₹{order.totalAmount}</span>
            </div>
          </div>

          {/* Next steps notice */}
          <div className="p-3 rounded-lg bg-[#F5EFEB] border border-[#124328]/10 text-[11px] text-[#132218]/80 space-y-1">
            <div className="font-bold text-[#124328]">Next Steps</div>
            <p>
              Your order is being reviewed by our village processing center. Once quality seals are verified, packaging will be completed and handed over to our courier partner.
            </p>
          </div>
        </div>
      </div>

      {/* Customer Assistance Card */}
      <div className="p-6 rounded-xl bg-[#F5EFEB] border border-[#E0980B]/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="space-y-1 text-center sm:text-left">
          <div className="font-bold text-[#124328] text-sm">Need order assistance or dispatch updates?</div>
          <div className="text-[#132218]/70">
            Official customer support: {BUSINESS_INFO.customerSupportPhone} • {BUSINESS_INFO.officialEmail}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={`mailto:${BUSINESS_INFO.officialEmail}?subject=Order%20Inquiry%20${displayOrderNumber}`}
            className="px-4 py-2 rounded bg-white text-[#124328] border border-[#124328]/20 font-semibold hover:bg-[#FBF9F4] transition-colors flex items-center gap-1.5"
          >
            <Mail className="w-3.5 h-3.5 text-[#E0980B]" />
            <span>Email Support</span>
          </a>
          <a
            href={`https://wa.me/${BUSINESS_INFO.supportWhatsAppNumber}?text=Hello%20Katehranchal%20Agro%20Foods%2C%20I%20need%20assistance%20with%20an%20order.`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded bg-[#124328] text-[#FBF9F4] font-semibold hover:bg-[#1A5A35] transition-colors flex items-center gap-1.5"
          >
            <MessageCircle className="w-3.5 h-3.5 text-[#E0980B]" />
            <span>WhatsApp Support</span>
          </a>
        </div>
      </div>

      {/* Navigation Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <button
          onClick={() => onNavigate('shop')}
          className="w-full sm:w-auto px-6 py-3 rounded bg-[#124328] text-[#FBF9F4] text-xs font-semibold uppercase tracking-wider hover:bg-[#1A5A35] transition-colors cursor-pointer"
        >
          Continue Shopping
        </button>
        <button
          onClick={onOpenAccount}
          className="w-full sm:w-auto px-6 py-3 rounded border border-[#124328] text-[#124328] text-xs font-semibold uppercase tracking-wider hover:bg-white transition-colors cursor-pointer"
        >
          View in Customer Account
        </button>
      </div>
    </div>
  );
};
