import React from 'react';
import { PageRoute } from '../types';
import { BUSINESS_INFO } from '../data/businessInfo';
import {
  Sparkles,
  Layers,
  FileText,
  ShieldCheck,
  MessageCircle,
  Receipt,
  ArrowRight,
  Phone,
  Mail,
  CheckCircle2,
} from 'lucide-react';

interface WhyChooseUsPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const WhyChooseUsPage: React.FC<WhyChooseUsPageProps> = ({ onNavigate }) => {
  const pillars = [
    {
      id: 'pillar-collection',
      icon: Layers,
      title: 'Focused Product Collection',
      quote: 'A considered selection of familiar food staples for modern family kitchens.',
      description:
        'Rather than presenting an unmanageable catalogue of hundreds of items, we focus strictly on core daily essentials: Desi Ghee, Black Mustard Oil, Yellow Mustard Oil, and Natural Wheat. Every staple is chosen for genuine daily household relevance.',
    },
    {
      id: 'pillar-info',
      icon: FileText,
      title: 'Clear Product Information',
      quote: 'Product details, variations, pricing and availability presented before purchase.',
      description:
        'We believe in complete transparency. Detailed specifications, pack measurements, suitable household applications, and storage recommendations are stated clearly. When specifications are in verification, we state so openly without placeholder prices or false assurances.',
    },
    {
      id: 'pillar-security',
      icon: ShieldCheck,
      title: 'Secure Online Shopping',
      quote: 'A structured cart and secure payment process designed for convenient ordering.',
      description:
        'Our digital storefront is architected with strict checkout safeguards. Payment processing will be routed strictly through authorized, PCI-compliant payment gateway partners upon verified integration, ensuring your payment details are handled securely.',
    },
    {
      id: 'pillar-support',
      icon: MessageCircle,
      title: 'Responsive Customer Support',
      quote: 'Customer support is available through the official email and WhatsApp contact.',
      description:
        'Every customer interaction is backed by verified communication channels. You can reach our dedicated support desk directly via WhatsApp at +91 94500 39346 or by email at agro@Katehranchal.org for prompt and courteous assistance.',
    },
    {
      id: 'pillar-transparency',
      icon: Receipt,
      title: 'Transparent Ordering',
      quote: 'Charges, delivery information and order totals are presented before the customer places an order.',
      description:
        'We adhere to an upfront pricing ethos: item costs, applicable taxes, and delivery charges are computed transparently before final payment authorization. There are no hidden fees or unexpected checkout surprises.',
    },
  ];

  const trustFoundations = [
    { title: 'Accurate Product Information', text: 'Verified facts without exaggerated health or medical claims.' },
    { title: 'Clear Pricing Principles', text: 'Legitimate MRP and unit prices presented upfront prior to ordering.' },
    { title: 'Consistent Photography', text: 'Clean, unbranded culinary imagery reflecting actual physical products.' },
    { title: 'Secure Checkout Architecture', text: 'PCI-DSS and RBI compliance standards for all digital transactions.' },
    { title: 'Accessible Contact Details', text: 'Dedicated WhatsApp and official organizational email addresses.' },
    { title: 'Complete Customer Policies', text: 'Published Shipping, Privacy, Terms, and Returns and Refunds Policies.' },
    { title: 'Honest Availability', text: 'Transparent stock and catalogue preview disclosures without false scarcity.' },
    { title: 'Correct Business Identity', text: 'Proudly part of the registered Katehranchal Group in Uttar Pradesh.' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      {/* Header */}
      <header className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-[#9E6E17] bg-[#E0980B]/10 border border-[#E0980B]/25">
          <Sparkles className="w-3.5 h-3.5 text-[#E0980B]" />
          <span>Our Operating Principles</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#124328] tracking-tight">
          Why Choose Katehranchal Agro Foods
        </h1>
        <p className="text-xs sm:text-sm text-[#132218]/75 leading-relaxed">
          Our commitment to family kitchens is grounded in accurate information, focused staple selections, transparent ordering, and dependable direct customer service.
        </p>
      </header>

      {/* Five Core Content Pillars */}
      <section aria-label="Core Pillars" className="space-y-6">
        <div className="text-center">
          <h2 className="font-serif text-2xl font-bold text-[#124328]">
            The Five Pillars of Our Service
          </h2>
          <p className="text-xs text-[#132218]/70 mt-1">
            Built on supportable, verifiable business practices — not artificial seals or slogans.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.id}
                id={pillar.id}
                className="bg-white p-6 rounded-2xl border border-[#124328]/10 shadow-xs hover:border-[#124328]/25 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#124328]/10 flex items-center justify-center text-[#124328]">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#124328]">
                    {pillar.title}
                  </h3>
                  <blockquote className="text-xs font-semibold text-[#9E6E17] border-l-2 border-[#E0980B] pl-2.5 py-0.5">
                    “{pillar.quote}”
                  </blockquote>
                  <p className="text-xs text-[#132218]/75 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Group Identity Card */}
          <div className="bg-[#FAF7F2] p-6 rounded-2xl border border-[#124328]/15 shadow-xs flex flex-col justify-between space-y-4 md:col-span-2 lg:col-span-1">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#124328]/10 flex items-center justify-center text-[#124328]">
                <ShieldCheck className="w-5 h-5 text-[#E0980B]" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#124328]">
                Part of Katehranchal Group
              </h3>
              <p className="text-xs text-[#132218]/75 leading-relaxed">
                Operating with institutional accountability under the registered Katehranchal Group banner based in Basti, Uttar Pradesh. We uphold disciplined governance across sourcing and packaging.
              </p>
            </div>
            <button
              onClick={() => onNavigate('contact')}
              className="text-xs font-bold text-[#124328] hover:underline flex items-center gap-1 self-start"
            >
              <span>View Business Details</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#E0980B]" />
            </button>
          </div>
        </div>
      </section>

      {/* Trust Foundations Grid */}
      <section className="bg-white p-8 sm:p-10 rounded-3xl border border-[#124328]/10 shadow-xs space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#124328]">
            Genuine Trust Through Transparency
          </h2>
          <p className="text-xs text-[#132218]/70 leading-relaxed">
            We do not use decorative badges, unverified certificates, or invented customer counts. Our credibility rests on real, tangible standards.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {trustFoundations.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-[#FAF7F2] border border-[#124328]/5 space-y-1.5"
            >
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#124328] shrink-0 mt-0.5" />
                <h4 className="font-serif font-bold text-xs text-[#124328]">
                  {item.title}
                </h4>
              </div>
              <p className="text-[11px] text-[#132218]/70 leading-relaxed pl-6">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Direct Contact Banner */}
      <section className="p-8 rounded-2xl bg-[#FAF7F2] border border-[#124328]/15 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1.5 text-center md:text-left">
          <h3 className="font-serif text-xl font-bold text-[#124328]">
            Speak Directly With Our Customer Support
          </h3>
          <p className="text-xs text-[#132218]/70 max-w-xl">
            Have questions regarding our catalogue, upcoming items, or order policies? Contact our official desk directly.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 shrink-0">
          <a
            href={BUSINESS_INFO.whatsAppDirectLink}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-[#124328] text-white text-xs font-semibold hover:bg-[#1A5A35] transition-colors flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4 text-[#E0980B]" />
            <span>WhatsApp Support</span>
          </a>
          <button
            onClick={() => onNavigate('contact')}
            className="px-4 py-2.5 rounded-xl bg-white text-[#124328] border border-[#124328]/20 text-xs font-semibold hover:bg-[#FAF7F2] transition-colors"
          >
            Contact Details
          </button>
        </div>
      </section>
    </div>
  );
};
