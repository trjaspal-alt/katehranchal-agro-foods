import React, { useState, useEffect } from 'react';
import { COMING_SOON_ITEMS } from '../data/products';
import { ComingSoonItem, PageRoute } from '../types';
import { BUSINESS_INFO } from '../data/businessInfo';
import { Bell, CheckCircle2, AlertCircle, Sparkles, ShieldCheck, Mail, ArrowRight, X } from 'lucide-react';

interface ComingSoonPageProps {
  onNavigate: (route: PageRoute) => void;
}

const NOTIFICATIONS_STORAGE_KEY = 'katehranchal_notifications_v1';

interface NotificationEntry {
  email: string;
  itemId: string;
  itemName: string;
  subscribedAt: string;
}

export const ComingSoonPage: React.FC<ComingSoonPageProps> = ({ onNavigate }) => {
  const [activeModalItem, setActiveModalItem] = useState<ComingSoonItem | null>(null);
  const [emailInput, setEmailInput] = useState<string>('');
  const [consentChecked, setConsentChecked] = useState<boolean>(false);
  const [notificationState, setNotificationState] = useState<{
    status: 'idle' | 'success' | 'already-subscribed' | 'error';
    message?: string;
  }>({ status: 'idle' });

  const [subscriptions, setSubscriptions] = useState<NotificationEntry[]>(() => {
    try {
      const saved = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(subscriptions));
    } catch {
      // safe fallback
    }
  }, [subscriptions]);

  const handleOpenNotifyModal = (item: ComingSoonItem) => {
    setActiveModalItem(item);
    setEmailInput('');
    setConsentChecked(false);

    // Check if current user is already subscribed for this item
    const existing = subscriptions.find((sub) => sub.itemId === item.id);
    if (existing) {
      setNotificationState({
        status: 'already-subscribed',
        message: `You are already registered with ${existing.email} to receive an update when ${item.name} is released.`,
      });
    } else {
      setNotificationState({ status: 'idle' });
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModalItem) return;

    const cleanEmail = emailInput.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(cleanEmail)) {
      setNotificationState({
        status: 'error',
        message: 'Please enter a valid, complete email address.',
      });
      return;
    }

    if (!consentChecked) {
      setNotificationState({
        status: 'error',
        message: 'Please accept the notification consent to proceed.',
      });
      return;
    }

    // Check duplicate
    const isDuplicate = subscriptions.some(
      (sub) => sub.itemId === activeModalItem.id && sub.email === cleanEmail
    );

    if (isDuplicate) {
      setNotificationState({
        status: 'already-subscribed',
        message: `You are already registered to be notified for ${activeModalItem.name} at ${cleanEmail}.`,
      });
      return;
    }

    // Save actual subscription record
    const newEntry: NotificationEntry = {
      email: cleanEmail,
      itemId: activeModalItem.id,
      itemName: activeModalItem.name,
      subscribedAt: new Date().toISOString(),
    };

    setSubscriptions((prev) => [...prev, newEntry]);
    setNotificationState({
      status: 'success',
      message: `Thank you. You will receive an official notification from ${BUSINESS_INFO.officialEmail} as soon as ${activeModalItem.name} is available for ordering.`,
    });
  };

  const handleUnsubscribe = (itemId: string) => {
    setSubscriptions((prev) => prev.filter((sub) => sub.itemId !== itemId));
    setNotificationState({
      status: 'idle',
      message: 'Your notification preference has been removed.',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Header */}
      <header className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-[#9E6E17] bg-[#E0980B]/10 border border-[#E0980B]/25">
          <Sparkles className="w-3.5 h-3.5 text-[#E0980B]" />
          <span>Planned Catalogue Additions</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#124328] tracking-tight">
          Upcoming Village Staples & Essentials
        </h1>
        <p className="text-xs sm:text-sm text-[#132218]/75 leading-relaxed">
          Six carefully considered household and traditional additions currently in sourcing and preparation. You may register your email for product release notices.
        </p>
      </header>

      {/* Prominent Statutory & Domestic Use Notice */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#FAF7F2] border border-[#124328]/15 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#124328]">
          <ShieldCheck className="w-4 h-4 text-[#E0980B]" />
          <span>Notice on Domestic & Ceremonial Items</span>
        </div>
        <p className="text-xs text-[#132218]/80 leading-relaxed">
          Traditional wood and household products are intended only for appropriate domestic and ceremonial uses. They are not offered for commercial or industrial use. We make no medicinal, therapeutic, or purification claims.
        </p>
      </div>

      {/* Coming Soon Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {COMING_SOON_ITEMS.map((item) => {
          const isSubscribed = subscriptions.some((sub) => sub.itemId === item.id);

          return (
            <article
              key={item.id}
              id={`coming-soon-card-${item.slug}`}
              className="flex flex-col bg-white rounded-2xl border border-[#124328]/10 shadow-xs hover:border-[#124328]/20 transition-all overflow-hidden"
            >
              {/* Image Frame */}
              <div className="relative aspect-4/3 w-full bg-[#FAF7F2] overflow-hidden">
                <img
                  src={item.primaryImage}
                  alt={item.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/95 text-[#124328] border border-[#124328]/10">
                    {item.category}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300">
                    Coming Soon
                  </span>
                </div>
              </div>

              {/* Card Details */}
              <div className="p-6 flex flex-col flex-1 justify-between gap-5">
                <div className="space-y-2">
                  <h3 className="font-serif text-xl font-bold text-[#124328]">
                    {item.name}
                  </h3>
                  <p className="text-xs text-[#132218]/75 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Domestic Notice if present */}
                  {item.domesticUseOnlyNotice && (
                    <div className="p-2.5 rounded-lg bg-[#FAF7F2] border border-[#124328]/10 text-[11px] text-[#132218]/70 italic">
                      {item.domesticUseOnlyNotice}
                    </div>
                  )}

                  {/* Suitable Applications */}
                  <div className="pt-2 space-y-1.5">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#124328]/70">
                      Planned Applications:
                    </div>
                    <ul className="space-y-1 text-xs text-[#132218]/80">
                      {item.suitableUses.map((use, uIdx) => (
                        <li key={uIdx} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-[#124328] shrink-0" />
                          <span>{use}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Notify Action */}
                <div className="pt-4 border-t border-[#124328]/10">
                  <button
                    type="button"
                    onClick={() => handleOpenNotifyModal(item)}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                      isSubscribed
                        ? 'bg-emerald-50 text-emerald-900 border border-emerald-300 hover:bg-emerald-100'
                        : 'bg-[#124328] text-white hover:bg-[#1A5A35]'
                    }`}
                  >
                    <Bell className="w-3.5 h-3.5 text-[#E0980B]" />
                    <span>{isSubscribed ? 'Notification Registered' : 'Notify Me Upon Release'}</span>
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Return to Catalogue Action */}
      <div className="text-center pt-6">
        <button
          onClick={() => onNavigate('shop')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#124328] text-white text-xs font-semibold hover:bg-[#1A5A35] transition-colors shadow-xs"
        >
          <span>Explore Available Collection (4 Staples)</span>
          <ArrowRight className="w-4 h-4 text-[#E0980B]" />
        </button>
      </div>

      {/* Notify Me Registration Modal */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#124328]/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#124328]/15 overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#FAF7F2] border-b border-[#124328]/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#E0980B]" />
                <h3 className="font-serif font-bold text-sm text-[#124328]">
                  Product Release Notification
                </h3>
              </div>
              <button
                onClick={() => setActiveModalItem(null)}
                className="p-1 rounded-lg text-[#132218]/60 hover:text-[#124328]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div>
                <div className="font-serif font-bold text-lg text-[#124328]">
                  {activeModalItem.name}
                </div>
                <p className="text-xs text-[#132218]/70 mt-1">
                  Register your email address to receive an official announcement when pack sizes and orders open for this item.
                </p>
              </div>

              {notificationState.status === 'success' ? (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Notification Saved</span>
                  </div>
                  <p className="text-xs text-emerald-800 leading-relaxed">
                    {notificationState.message}
                  </p>
                  <button
                    onClick={() => setActiveModalItem(null)}
                    className="mt-2 px-4 py-2 rounded-lg bg-emerald-800 text-white text-xs font-semibold"
                  >
                    Done
                  </button>
                </div>
              ) : notificationState.status === 'already-subscribed' ? (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                    <AlertCircle className="w-4 h-4 text-amber-700" />
                    <span>Already Subscribed</span>
                  </div>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    {notificationState.message}
                  </p>
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => handleUnsubscribe(activeModalItem.id)}
                      className="px-3 py-1.5 rounded-lg bg-white border border-amber-300 text-amber-900 text-xs font-semibold hover:bg-amber-100"
                    >
                      Remove Notification
                    </button>
                    <button
                      onClick={() => setActiveModalItem(null)}
                      className="px-3 py-1.5 rounded-lg bg-amber-900 text-white text-xs font-semibold"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-4">
                  {notificationState.status === 'error' && (
                    <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                      <span>{notificationState.message}</span>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-[#124328]">
                      Your Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="e.g. yourname@domain.com"
                      className="w-full px-3.5 py-2 text-xs rounded-lg border border-[#124328]/20 bg-[#FAF7F2] focus:outline-none focus:border-[#124328]"
                    />
                  </div>

                  <div className="flex items-start gap-2 pt-1">
                    <input
                      id="notify-consent"
                      type="checkbox"
                      required
                      checked={consentChecked}
                      onChange={(e) => setConsentChecked(e.target.checked)}
                      className="mt-0.5 rounded border-[#124328]/30 text-[#124328] focus:ring-[#124328]"
                    />
                    <label htmlFor="notify-consent" className="text-xs text-[#132218]/75 leading-relaxed">
                      I agree to receive a release notification email from {BUSINESS_INFO.officialEmail} regarding this product. View our{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setActiveModalItem(null);
                          onNavigate('policy-privacy');
                        }}
                        className="text-[#124328] font-semibold underline"
                      >
                        Privacy Policy
                      </button>
                      .
                    </label>
                  </div>

                  <div className="pt-2 flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 py-2.5 px-4 rounded-xl bg-[#124328] text-white text-xs font-semibold hover:bg-[#1A5A35] transition-colors"
                    >
                      Save Notification
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveModalItem(null)}
                      className="py-2.5 px-4 rounded-xl border border-[#124328]/20 text-xs font-semibold text-[#132218]/70 hover:bg-[#FAF7F2]"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
