import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { PageRoute } from '../types';
import { 
  User, 
  Package, 
  MapPin, 
  Lock, 
  LogOut, 
  ShieldCheck, 
  CheckCircle2, 
  Info, 
  KeyRound, 
  Clock 
} from 'lucide-react';
import { BUSINESS_INFO } from '../data/businessInfo';

interface AccountPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const AccountPage: React.FC<AccountPageProps> = ({ onNavigate }) => {
  const { pastOrders } = useCart();
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'addresses' | 'security'>('orders');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {/* Header */}
      <div className="border-b border-[#124328]/10 pb-6 space-y-2">
        <div className="text-xs font-bold uppercase tracking-widest text-[#E0980B]">
          Customer Portal
        </div>
        <h1 className="font-serif text-3xl font-bold text-[#124328]">
          Customer Account Architecture
        </h1>
        <p className="text-xs sm:text-sm text-[#132218]/70">
          Manage saved addresses, track live parcel dispatches, and review authenticated transaction histories.
        </p>
      </div>

      {/* Backend Integration Structural Documentation Notice */}
      <div className="p-4 rounded-xl bg-[#F5EFEB] border border-[#E0980B]/40 text-xs space-y-2 text-[#132218]/80">
        <div className="flex items-center gap-2 font-bold text-[#124328]">
          <Info className="w-4 h-4 text-[#E0980B] shrink-0" />
          <span>Step 1 Architecture Notice: Customer Authentication & Backend Integration</span>
        </div>
        <p className="leading-relaxed">
          The layout below outlines the complete account hierarchy (Registration, OTP / Password Login, Address Book, and Order Archival). In Step 1, guest checkout is active, and session orders are retained in local state. In Step 2, persistent authentication tokens, encrypted password salting, and automated customer profile databases will connect to your designated backend service.
        </p>
      </div>

      {/* Main Account Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Navigation Sidebar */}
        <div className="md:col-span-4 space-y-2">
          <div className="p-4 rounded-xl bg-white border border-[#124328]/10 space-y-1 shadow-xs">
            <div className="p-2 mb-2 flex items-center gap-3 border-b border-[#124328]/5">
              <div className="w-10 h-10 rounded-full bg-[#F5EFEB] text-[#124328] flex items-center justify-center font-serif font-bold text-base">
                K
              </div>
              <div className="min-w-0">
                <div className="font-serif font-bold text-sm text-[#124328] truncate">
                  Guest / Registered Customer
                </div>
                <div className="text-[11px] text-[#1C602A] font-medium">Active Session</div>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'orders'
                  ? 'bg-[#124328] text-[#FBF9F4]'
                  : 'text-[#132218]/80 hover:bg-[#F5EFEB] text-left'
              }`}
            >
              <Package className="w-4 h-4 text-[#E0980B]" />
              <span>Order History & Tracking ({pastOrders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'profile'
                  ? 'bg-[#124328] text-[#FBF9F4]'
                  : 'text-[#132218]/80 hover:bg-[#F5EFEB] text-left'
              }`}
            >
              <User className="w-4 h-4 text-[#E0980B]" />
              <span>Personal Information</span>
            </button>

            <button
              onClick={() => setActiveTab('addresses')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'addresses'
                  ? 'bg-[#124328] text-[#FBF9F4]'
                  : 'text-[#132218]/80 hover:bg-[#F5EFEB] text-left'
              }`}
            >
              <MapPin className="w-4 h-4 text-[#E0980B]" />
              <span>Saved Shipping Addresses</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'security'
                  ? 'bg-[#124328] text-[#FBF9F4]'
                  : 'text-[#132218]/80 hover:bg-[#F5EFEB] text-left'
              }`}
            >
              <KeyRound className="w-4 h-4 text-[#E0980B]" />
              <span>Security & Password Reset</span>
            </button>
          </div>
        </div>

        {/* Content Pane */}
        <div className="md:col-span-8">
          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="bg-white p-6 rounded-xl border border-[#124328]/10 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-[#124328]/10 pb-3">
                <h2 className="font-serif text-lg font-bold text-[#124328]">
                  Order History & Real-Time Tracking
                </h2>
                <span className="text-xs text-[#1C602A] font-medium">
                  {pastOrders.length} Order{pastOrders.length !== 1 ? 's' : ''} on record
                </span>
              </div>

              {pastOrders.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <Package className="w-12 h-12 text-[#E0980B] mx-auto stroke-1" />
                  <div className="font-serif font-bold text-base text-[#124328]">
                    No past orders found in current browser session
                  </div>
                  <p className="text-xs text-[#132218]/60 max-w-sm mx-auto">
                    Any orders placed through the secure checkout will be archived here with detailed breakdown and status updates.
                  </p>
                  <button
                    onClick={() => onNavigate('shop')}
                    className="px-5 py-2 rounded bg-[#124328] text-[#FBF9F4] text-xs font-semibold uppercase tracking-wider hover:bg-[#1A5A35] transition-colors"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {pastOrders.map((ord) => (
                    <div
                      key={ord.orderId}
                      className="p-4 rounded-lg border border-[#124328]/15 bg-[#FBF9F4] space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#124328]/10 pb-2">
                        <div>
                          <span className="font-bold text-xs text-[#124328]">
                            Order {ord.orderId}
                          </span>
                          <span className="text-[11px] text-[#132218]/60 ml-2">
                            {new Date(ord.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <span className="text-[11px] font-bold text-[#1C602A] bg-[#1C602A]/10 px-2 py-0.5 rounded">
                          {ord.deliveryStatus}
                        </span>
                      </div>

                      <div className="space-y-1.5 text-xs text-[#132218]/80">
                        {ord.items.map((i) => (
                          <div key={i.id} className="flex justify-between">
                            <span>
                              {i.name} ({i.packOption.sizeLabel.split('(')[0]}) × {i.quantity}
                            </span>
                            <span className="font-semibold text-[#124328]">
                              ₹{i.unitPrice * i.quantity}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between border-t border-[#124328]/10 pt-2 text-xs">
                        <span className="text-[#132218]/60">Total Amount Paid</span>
                        <span className="font-bold text-sm text-[#124328]">
                          ₹{ord.totalAmount}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="bg-white p-6 rounded-xl border border-[#124328]/10 shadow-xs space-y-5">
              <div className="border-b border-[#124328]/10 pb-3">
                <h2 className="font-serif text-lg font-bold text-[#124328]">
                  Personal Profile Information
                </h2>
                <p className="text-xs text-[#132218]/60">
                  Customer contact credentials for automated dispatch notifications.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-semibold text-[#124328] block mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    defaultValue="Primary Customer"
                    className="w-full p-2.5 rounded border border-[#124328]/20 bg-[#FBF9F4]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#124328] block mb-1">Verified Email Address</label>
                  <input
                    type="email"
                    defaultValue="customer@example.com"
                    className="w-full p-2.5 rounded border border-[#124328]/20 bg-[#FBF9F4]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#124328] block mb-1">Primary Mobile Number</label>
                  <input
                    type="tel"
                    defaultValue="+91 98765 43210"
                    className="w-full p-2.5 rounded border border-[#124328]/20 bg-[#FBF9F4]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#124328] block mb-1">Account Creation Date</label>
                  <input
                    type="text"
                    disabled
                    defaultValue="Session Initialized (Guest Mode)"
                    className="w-full p-2.5 rounded border border-[#124328]/10 bg-gray-50 text-gray-500"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  className="px-5 py-2 rounded bg-[#124328] text-[#FBF9F4] text-xs font-semibold uppercase tracking-wider hover:bg-[#1A5A35]"
                >
                  Save Profile Changes (Placeholder)
                </button>
              </div>
            </div>
          )}

          {/* Addresses Tab */}
          {activeTab === 'addresses' && (
            <div className="bg-white p-6 rounded-xl border border-[#124328]/10 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-[#124328]/10 pb-3">
                <div>
                  <h2 className="font-serif text-lg font-bold text-[#124328]">
                    Saved Shipping Addresses
                  </h2>
                  <p className="text-xs text-[#132218]/60">
                    Store default residential and workplace destinations for rapid checkout.
                  </p>
                </div>
                <button
                  type="button"
                  className="px-3 py-1.5 rounded bg-[#F5EFEB] text-xs font-semibold text-[#124328] hover:bg-[#EAE4D4]"
                >
                  + Add New Address
                </button>
              </div>

              <div className="p-4 rounded-lg border border-[#124328]/15 bg-[#FBF9F4] space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[#124328]">Default Residence (Home)</span>
                  <span className="text-[10px] bg-[#1C602A]/10 text-[#1C602A] px-2 py-0.5 rounded font-bold">
                    PRIMARY
                  </span>
                </div>
                <div className="text-[#132218]/80 leading-relaxed">
                  Apartment 301, Tower B, Gomti Nagar, Lucknow, Uttar Pradesh — 226010
                </div>
                <div className="text-[11px] text-[#132218]/60">Recipient Contact: +91 94500 39346</div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="bg-white p-6 rounded-xl border border-[#124328]/10 shadow-xs space-y-5">
              <div className="border-b border-[#124328]/10 pb-3">
                <h2 className="font-serif text-lg font-bold text-[#124328]">
                  Security & Password Reset
                </h2>
                <p className="text-xs text-[#132218]/60">
                  Encrypted authentication credentials and multi-factor verification settings.
                </p>
              </div>

              <div className="space-y-4 text-xs max-w-md">
                <div>
                  <label className="font-semibold text-[#124328] block mb-1">Current Password</label>
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    className="w-full p-2.5 rounded border border-[#124328]/20 bg-[#FBF9F4]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#124328] block mb-1">New Secure Password</label>
                  <input
                    type="password"
                    placeholder="Minimum 8 characters"
                    className="w-full p-2.5 rounded border border-[#124328]/20 bg-[#FBF9F4]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#124328] block mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    placeholder="Repeat new password"
                    className="w-full p-2.5 rounded border border-[#124328]/20 bg-[#FBF9F4]"
                  />
                </div>
                <button
                  type="button"
                  className="px-5 py-2.5 rounded bg-[#124328] text-[#FBF9F4] text-xs font-semibold uppercase tracking-wider hover:bg-[#1A5A35]"
                >
                  Update Password (Backend Ready)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
