import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, ShoppingBag, Info, Tag } from 'lucide-react';
import { PageRoute } from '../types';

interface CartDrawerProps {
  onNavigate: (route: PageRoute) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onNavigate }) => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    estimatedTaxes,
    estimatedShipping,
    discountAmount,
    totalAmount,
    activeCoupon,
    couponMessage,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponInput) {
      applyCoupon(couponInput);
      setCouponInput('');
    }
  };

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    onNavigate('checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#124328]/50 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-[#124328]/10 animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#124328]/10 flex items-center justify-between bg-[#FBF9F4]">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-[#124328]" />
              <h2 className="font-serif text-lg font-bold text-[#124328]">
                Shopping Cart ({cart.reduce((s, i) => s + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-md text-[#132218]/60 hover:text-[#124328] hover:bg-[#124328]/5 transition-colors"
              aria-label="Close Shopping Cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="py-10 text-center space-y-4">
                <div className="w-36 h-36 mx-auto rounded-2xl overflow-hidden shadow-2xs border border-[#124328]/10 bg-[#FAF7F2]">
                  <img
                    src="./assets/illustrations/empty-cart-earthen-urn.svg"
                    alt="Traditional earthen vessel with golden wheat stalk"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="font-serif text-lg font-bold text-[#124328]">
                  Your cart is currently empty
                </div>
                <p className="text-xs text-[#132218]/70 max-w-xs mx-auto leading-relaxed">
                  Browse our authentic selection of pure Desi Ghee, traditional cold-pressed mustard oils, and whole natural grains.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    onNavigate('shop');
                  }}
                  className="mt-2 px-5 py-2.5 rounded-lg bg-[#124328] text-[#FBF9F4] text-xs font-semibold tracking-wider uppercase hover:bg-[#1A5A35] transition-colors"
                >
                  Explore Catalogue
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3.5 p-3.5 rounded-lg border border-[#124328]/10 bg-[#FBF9F4]/60 hover:border-[#E0980B]/40 transition-colors"
                >
                  {/* Thumbnail */}
                  <img
                    src={item.primaryImage}
                    alt={item.name}
                    className="w-18 h-18 object-contain rounded bg-white p-1 border border-[#124328]/10 shrink-0"
                  />

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-serif text-sm font-bold text-[#124328] truncate">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-[#132218]/40 hover:text-red-700 transition-colors p-1"
                          title="Remove item"
                          aria-label={`Remove ${item.name}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="text-xs text-[#1C602A] font-medium mt-0.5">
                        {item.packOption.sizeLabel}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#124328]/5">
                      {/* Quantity Controller */}
                      <div className="flex items-center border border-[#124328]/20 rounded bg-white">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-[#132218]/70 hover:text-[#124328] hover:bg-[#F5EFEB] transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 py-0.5 text-xs font-semibold text-[#124328]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-[#132218]/70 hover:text-[#124328] hover:bg-[#F5EFEB] transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Price Calculation */}
                      <div className="text-right">
                        <div className="text-xs text-[#132218]/60">
                          ₹{item.unitPrice} × {item.quantity}
                        </div>
                        <div className="text-sm font-bold text-[#124328]">
                          ₹{item.unitPrice * item.quantity}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Order Summary */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-[#124328]/10 bg-[#FBF9F4] space-y-3.5">
              {/* Promotional Coupon Placeholder Input */}
              <div>
                {activeCoupon ? (
                  <div className="flex items-center justify-between p-2 rounded bg-[#1C602A]/10 border border-[#1C602A]/30 text-xs text-[#1C602A]">
                    <div className="flex items-center gap-1.5 font-medium">
                      <Tag className="w-3.5 h-3.5" />
                      <span>Code Active: {activeCoupon} (-₹{discountAmount})</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-xs font-bold underline hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Coupon voucher code (e.g. WELCOME10)"
                      className="flex-1 text-xs px-3 py-2 rounded border border-[#124328]/20 bg-white focus:outline-none focus:border-[#E0980B]"
                    />
                    <button
                      type="submit"
                      className="px-3.5 py-2 text-xs font-semibold rounded bg-[#F5EFEB] text-[#124328] hover:bg-[#EAE4D4] border border-[#124328]/15 transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {couponMessage && (
                  <div className="text-[11px] text-[#132218]/70 mt-1 flex items-center gap-1">
                    <Info className="w-3 h-3 text-[#E0980B] shrink-0" />
                    <span>{couponMessage}</span>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-[#132218]/80 pt-1 border-t border-[#124328]/5">
                <div className="flex justify-between">
                  <span>Product Subtotal</span>
                  <span className="font-semibold text-[#124328]">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="flex items-center gap-1">
                    <span>Estimated Taxes (GST Placeholder)</span>
                  </span>
                  <span>{estimatedTaxes > 0 ? `₹${estimatedTaxes}` : 'Pending verification'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Estimate</span>
                  <span>
                    {estimatedShipping === 0 ? (
                      <span className="text-[#1C602A] font-medium">Free Delivery Eligible</span>
                    ) : (
                      `₹${estimatedShipping}`
                    )}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#1C602A]">
                    <span>Promotional Discount</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-[#124328] pt-2 border-t border-[#124328]/10">
                  <span>Estimated Total</span>
                  <span className="font-serif text-base text-[#124328]">₹{totalAmount}</span>
                </div>
              </div>

              {/* Secure Trust Note */}
              <div className="flex items-center gap-2 p-2 rounded bg-white border border-[#124328]/10 text-[11px] text-[#132218]/70">
                <ShieldCheck className="w-4 h-4 text-[#1C602A] shrink-0" />
                <span>Encrypted checkout preparation. Indian payment gateway integration point.</span>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={handleCheckoutClick}
                  className="w-full py-3 px-4 rounded bg-[#124328] text-[#FBF9F4] text-xs font-semibold tracking-wider uppercase hover:bg-[#1A5A35] transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>Proceed to Secure Checkout</span>
                  <ArrowRight className="w-4 h-4 text-[#E0980B]" />
                </button>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-full py-2 text-xs font-medium text-[#124328] hover:underline text-center"
                >
                  Continue Browsing Products
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
