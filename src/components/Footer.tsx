import React from 'react';
import { PageRoute, ProductCategory } from '../types';
import { BrandLogo } from './BrandLogo';
import { BUSINESS_INFO } from '../data/businessInfo';
import { MessageCircle, Mail, ExternalLink, Instagram, Facebook, Youtube } from 'lucide-react';

interface FooterProps {
  onNavigate: (route: PageRoute, category?: ProductCategory) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const currentYear = new Date().getFullYear();
  const socialLinks = [
    { label: 'Instagram', href: BUSINESS_INFO.socialMedia.instagram, icon: Instagram },
    { label: 'Facebook', href: BUSINESS_INFO.socialMedia.facebook, icon: Facebook },
    { label: 'YouTube', href: BUSINESS_INFO.socialMedia.youtube, icon: Youtube },
  ];

  return (
    <footer className="bg-[#0D301C] text-[#FBF9F4] border-t border-[#E0980B]/30 pt-16 sm:pt-20 pb-24 sm:pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Brand Header Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-x-10 gap-y-12 pb-12 border-b border-[#FBF9F4]/10 items-start">
          {/* Logo & Corporate Statement */}
          <div className="sm:col-span-2 lg:col-span-5 space-y-5">
            <div className="w-full max-w-[500px] px-6 sm:px-7 py-4 sm:py-5 bg-[#FBF9F4] rounded-2xl border border-[#E0980B]/25 shadow-[0_16px_40px_rgba(0,0,0,0.12)]">
              <BrandLogo size="footer" showWordmark={true} variant="dark" />
            </div>

            <p className="text-sm text-[#FBF9F4]/80 leading-relaxed max-w-md pt-2">
              {BUSINESS_INFO.tagline}. Dedicated to bringing pure, traditionally crafted Indian rural foods, pure desi ghee, cold-pressed mustard oils, and whole natural grains directly into contemporary family kitchens.
            </p>

            <div className="pt-3 flex flex-wrap gap-4 text-xs">
              <a
                href={BUSINESS_INFO.officialWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[#E0980B] hover:underline"
              >
                <span>Official Portal: Katehranchal.org</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="space-y-2" aria-label="Official social media profiles">
              <div className="flex items-center gap-2">
                {socialLinks.map(({ label, href, icon: Icon }) => href ? (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={`Katehranchal Agro Foods on ${label}`} className="w-10 h-10 rounded-full border border-[#FBF9F4]/20 flex items-center justify-center text-[#FBF9F4] hover:text-[#E0980B] hover:border-[#E0980B]/60 transition-colors">
                    <Icon className="w-[18px] h-[18px]" />
                  </a>
                ) : (
                  <span key={label} role="img" aria-label={`${label} official profile coming soon`} title={`${label} profile coming soon`} className="w-10 h-10 rounded-full border border-[#FBF9F4]/15 flex items-center justify-center text-[#FBF9F4]/55 cursor-default">
                    <Icon className="w-[18px] h-[18px]" />
                  </span>
                ))}
              </div>
              <p className="text-[11px] text-[#FBF9F4]/55">Official social profiles coming soon</p>
            </div>
          </div>

          {/* Quick Shop Links */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-semibold tracking-widest text-[#E0980B] uppercase">
              Shop Collections
            </h4>
            <ul className="space-y-2.5 text-sm text-[#FBF9F4]/80 [&_button]:block [&_button]:w-full [&_button]:text-left [&_button]:leading-relaxed">
              <li>
                <button
                  onClick={() => onNavigate('shop', 'all')}
                  className="hover:text-[#E0980B] transition-colors"
                >
                  All Products
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('shop', 'desi-ghee')}
                  className="hover:text-[#E0980B] transition-colors"
                >
                  Desi Ghee
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('shop', 'black-mustard-oil')}
                  className="hover:text-[#E0980B] transition-colors"
                >
                  Black Mustard Oil
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('shop', 'yellow-mustard-oil')}
                  className="hover:text-[#E0980B] transition-colors"
                >
                  Yellow Mustard Oil
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('shop', 'natural-wheat')}
                  className="hover:text-[#E0980B] transition-colors"
                >
                  Natural Wheat
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('coming-soon')}
                    className="text-[#E0980B] hover:text-[#F0B33B] text-xs pt-2 pr-2"
                  >
                  Future Harvests<br className="hidden xl:block" /> (Coming Soon)
                </button>
              </li>
            </ul>
          </div>

          {/* Company & Trust */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-semibold tracking-widest text-[#E0980B] uppercase">
              Brand & Process
            </h4>
            <ul className="space-y-2.5 text-sm text-[#FBF9F4]/80 [&_button]:block [&_button]:w-full [&_button]:text-left [&_button]:leading-relaxed">
              <li>
                <button
                  onClick={() => onNavigate('our-story')}
                  className="hover:text-[#E0980B] transition-colors"
                >
                  Our Story
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('why-choose-us')}
                  className="hover:text-[#E0980B] transition-colors"
                >
                  Why Choose Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('how-it-works')}
                  className="hover:text-[#E0980B] transition-colors"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('faqs')}
                  className="hover:text-[#E0980B] transition-colors"
                >
                  Frequently Asked Questions
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Support & Contact */}
          <div className="sm:col-span-2 lg:col-span-3 space-y-4">
            <h4 className="text-xs font-semibold tracking-widest text-[#E0980B] uppercase">
              Customer Support
            </h4>
            <div className="space-y-2.5 text-sm text-[#FBF9F4]/80">
              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-[#E0980B] shrink-0 mt-0.5" />
                <div>
                  <div className="text-[11px] text-[#FBF9F4]/60 uppercase tracking-wider">Official Email</div>
                  <a
                    href={`mailto:${BUSINESS_INFO.officialEmail}`}
                    className="text-[#FBF9F4] hover:text-[#E0980B] transition-colors"
                  >
                    {BUSINESS_INFO.officialEmail}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MessageCircle className="w-4 h-4 text-[#E0980B] shrink-0 mt-0.5" />
                <div>
                  <div className="text-[11px] text-[#FBF9F4]/60 uppercase tracking-wider">WhatsApp Support Channel</div>
                  <a
                    href={BUSINESS_INFO.whatsAppDirectLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#FBF9F4] hover:text-[#E0980B] transition-colors font-medium"
                  >
                    {BUSINESS_INFO.supportWhatsAppDisplay}
                  </a>
                  <p className="text-[11px] text-[#FBF9F4]/60 mt-0.5">
                    Customer assistance channel
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onNavigate('contact')}
                  className="px-3.5 py-1.5 rounded bg-[#FBF9F4]/10 text-xs font-medium text-[#E0980B] hover:bg-[#FBF9F4]/20 transition-colors"
                >
                  Contact Desk & Feedback
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Policies & Legal Navigation */}
        <div className="py-6 border-b border-[#FBF9F4]/10 flex flex-wrap items-center justify-between gap-4 text-xs text-[#FBF9F4]/70">
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <button
              onClick={() => onNavigate('policy-shipping')}
              className="hover:text-[#E0980B] transition-colors"
            >
              Shipping Policy
            </button>
            <button
              onClick={() => onNavigate('policy-returns')}
              className="hover:text-[#E0980B] transition-colors"
            >
              Returns and Refunds
            </button>
            <button
              onClick={() => onNavigate('policy-cancellation')}
              className="hover:text-[#E0980B] transition-colors"
            >
              Cancellation Policy
            </button>
            <button
              onClick={() => onNavigate('policy-privacy')}
              className="hover:text-[#E0980B] transition-colors"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => onNavigate('policy-terms')}
              className="hover:text-[#E0980B] transition-colors"
            >
              Terms and Conditions
            </button>
            <button
              onClick={() => onNavigate('policy-payment')}
              className="hover:text-[#E0980B] transition-colors"
            >
              Payment & Security Policy
            </button>
          </div>

          <div className="text-[11px] text-[#E0980B]">
            Katehranchal Agro Foods Official E-Commerce Store
          </div>
        </div>

        {/* Copyright & Group Acknowledgement */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#FBF9F4]/60">
          <div>
            © {currentYear} Katehranchal Agro Foods. All rights reserved.
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            <span>{BUSINESS_INFO.parentGroupLine}</span>
            <span>•</span>
            <a
              href={BUSINESS_INFO.officialWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#E0980B] hover:underline"
            >
              Katehranchal.org
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
