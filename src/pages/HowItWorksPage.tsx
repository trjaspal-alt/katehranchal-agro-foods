import React from 'react';
import { PageRoute } from '../types';
import { 
  ShoppingBag, 
  Layers, 
  MapPin, 
  CreditCard, 
  CheckCircle, 
  Truck, 
  MessageCircle, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { BUSINESS_INFO } from '../data/businessInfo';

interface HowItWorksPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({ onNavigate }) => {
  const steps = [
    {
      number: '01',
      title: 'Browse Pure Traditional Staples',
      description: 'Explore our catalog of traditional Indian village staples: granular Desi Ghee, pungent cold-pressed Black Mustard Oil, mild cold-pressed Yellow Mustard Oil, and sun-ripened Natural Wheat.',
      icon: ShoppingBag,
    },
    {
      number: '02',
      title: 'Select Preferred Pack Size & Quantity',
      description: 'Choose from calibrated packaging options (glass jars, safe heritage tins, or heavy-duty grain bags). Adjust your desired quantity and click Add to Cart or Buy Now.',
      icon: Layers,
    },
    {
      number: '03',
      title: 'Provide Shipping Address & PIN Code',
      description: 'Enter recipient delivery details including full address, landmark, and 6-digit postal PIN code. Our interactive checker validates courier delivery coverage to your exact pin code.',
      icon: MapPin,
    },
    {
      number: '04',
      title: 'Choose Secure Indian Payment Method',
      description: 'Select your preferred payment gateway channel—UPI (Google Pay, PhonePe, Paytm), Debit/Credit Cards, or Internet Banking. Your credentials are authenticated directly through banking gateways with zero data retention on our servers.',
      icon: CreditCard,
    },
    {
      number: '05',
      title: 'Place Order with Server Verification',
      description: 'Review the complete order breakdown including product subtotal, applicable taxes placeholder, and delivery fees. Click Place Order to generate an authenticated server transaction.',
      icon: CheckCircle,
    },
    {
      number: '06',
      title: 'Receive Confirmation & Tracking Details',
      description: 'Instantly view your unique Order ID on our confirmation screen. A comprehensive digital invoice and tracking reference are dispatched to your registered email address.',
      icon: ShieldCheck,
    },
    {
      number: '07',
      title: 'Safe Doorstep Delivery & Support',
      description: 'Your parcel is prepared with protective outer packaging appropriate to the selected product. For any questions, our team is directly accessible via WhatsApp and email.',
      icon: Truck,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16">
      {/* Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="text-xs font-bold uppercase tracking-widest text-[#E0980B]">
          The Complete Purchasing Journey
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#124328]">
          How Ordering from Katehranchal Works
        </h1>
        <p className="text-xs sm:text-base text-[#132218]/80 leading-relaxed">
          From rural harvest to your dining table: a transparent, secure, 7-step e-commerce journey built specifically for discerning Indian households.
        </p>
      </div>

      {/* 7-Step Timeline */}
      <div className="space-y-6">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.number}
              className="p-6 sm:p-8 rounded-2xl bg-white border border-[#124328]/10 shadow-xs flex flex-col sm:flex-row items-start gap-6 group hover:border-[#E0980B] transition-all"
            >
              <div className="w-14 h-14 rounded-xl bg-[#124328] text-[#E0980B] flex items-center justify-center shrink-0 shadow-xs">
                <span className="font-serif text-xl font-bold">{step.number}</span>
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-[#1C602A]" />
                  <h2 className="font-serif text-lg sm:text-xl font-bold text-[#124328]">
                    {step.title}
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-[#132218]/75 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Customer Assistance Box */}
      <div className="p-8 rounded-2xl bg-[#F5EFEB] border border-[#E0980B]/40 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <div className="font-serif font-bold text-lg text-[#124328]">
            Questions About Ordering or Delivery?
          </div>
          <p className="text-xs text-[#132218]/75">
            Our support desk is ready to answer questions regarding product batch dates, packaging, or bulk orders.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <a
            href={BUSINESS_INFO.whatsAppDirectLink}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded bg-[#124328] text-[#FBF9F4] text-xs font-semibold hover:bg-[#1A5A35] transition-colors flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4 text-[#E0980B]" />
            <span>Chat on WhatsApp</span>
          </a>
          <button
            onClick={() => onNavigate('shop')}
            className="px-5 py-2.5 rounded bg-[#E0980B] text-[#124328] text-xs font-bold uppercase tracking-wider hover:bg-[#D9B875] transition-colors"
          >
            Start Shopping
          </button>
        </div>
      </div>
    </div>
  );
};
