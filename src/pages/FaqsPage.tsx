import React, { useState } from 'react';
import { PageRoute } from '../types';
import { BUSINESS_INFO } from '../data/businessInfo';
import { ChevronDown, ChevronUp, Search, MessageCircle, Mail, HelpCircle, ShieldCheck } from 'lucide-react';

interface FaqsPageProps {
  onNavigate: (route: PageRoute) => void;
}

interface FAQItem {
  question: string;
  answer: string;
  category: string;
  actionLink?: { label: string; route: PageRoute };
}

export const FaqsPage: React.FC<FaqsPageProps> = ({ onNavigate }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    'All',
    'Products & Availability',
    'Pricing & Pack Sizes',
    'Ordering & Payments',
    'Delivery & Logistics',
    'Returns & Policies',
    'Customer Support',
  ];

  const faqs: FAQItem[] = [
    {
      category: 'Products & Availability',
      question: 'Which products are currently available?',
      answer:
        'Our currently planned collection includes Desi Ghee, Black Mustard Oil, Yellow Mustard Oil and Natural Wheat. Availability is shown on each product page.',
      actionLink: { label: 'View Product Catalogue', route: 'shop' },
    },
    {
      category: 'Pricing & Pack Sizes',
      question: 'Where can I find pack sizes and prices?',
      answer:
        'Available pack sizes and current prices are displayed on each active product page. When specifications are in verification, they are explicitly marked as pending rather than showing placeholder or artificial figures.',
      actionLink: { label: 'Explore Catalogue', route: 'shop' },
    },
    {
      category: 'Delivery & Logistics',
      question: 'How can I check delivery availability?',
      answer:
        'Enter your delivery PIN code on the product page or during checkout when delivery configuration is active. Our logistics integration will calculate carrier availability and express courier transit timelines to your location.',
    },
    {
      category: 'Ordering & Payments',
      question: 'How will I know that my order is confirmed?',
      answer:
        'After a successful payment, you will receive a payment receipt and order confirmation using the contact details entered during guest checkout. Keep the payment reference for any support request.',
      actionLink: { label: 'Contact Support', route: 'contact' },
    },
    {
      category: 'Ordering & Payments',
      question: 'Which payment methods are accepted?',
      answer:
        'Payment method support will be published upon activation and verification of our authorized payment gateway partners. Our architecture supports UPI, Debit and Credit Cards, and Net Banking under RBI guidelines.',
    },
    {
      category: 'Returns & Policies',
      question: 'Can I return a food product?',
      answer:
        'Food products cannot be returned once opened due to hygiene and food-safety standards. However, in the rare event of transit damage or defective packaging, replacements or refunds are issued in accordance with our verified policy.',
      actionLink: { label: 'Read Returns and Refunds Policy', route: 'policy-returns' },
    },
    {
      category: 'Products & Availability',
      question: 'Are the products certified organic?',
      answer:
        'We do not describe a product as certified organic unless the applicable certification has been verified and displayed on its product page. We provide honest information without unverified labels.',
    },
    {
      category: 'Products & Availability',
      question: 'What are the upcoming additions in the Coming Soon collection?',
      answer:
        'Our planned additions include Natural Wheat Flour, Cow Dung Cakes, Traditional Wood Ash, Natural Soil, Dry Neem Wood, and Dry Mango Wood. Traditional wood and household products are intended solely for domestic and ceremonial use.',
      actionLink: { label: 'View Coming Soon Page', route: 'coming-soon' },
    },
    {
      category: 'Customer Support',
      question: 'How can I contact Katehranchal Agro Foods directly?',
      answer:
        'Customer support is available through our official email (agro@Katehranchal.org) and dedicated WhatsApp assistance (+91 94500 39346), Monday to Saturday from 9:00 AM to 6:00 PM IST.',
      actionLink: { label: 'Contact Us', route: 'contact' },
    },
  ];

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = activeCategory === 'All' || faq.category === activeCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      faq.question.toLowerCase().includes(q) ||
      faq.answer.toLowerCase().includes(q) ||
      faq.category.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Header */}
      <header className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-[#9E6E17] bg-[#E0980B]/10 border border-[#E0980B]/25">
          <HelpCircle className="w-3.5 h-3.5 text-[#E0980B]" />
          <span>Clear & Honest Guidance</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#124328] tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-xs sm:text-sm text-[#132218]/75 max-w-xl mx-auto leading-relaxed">
          Accurate answers regarding our products, commercial specifications, ordering processes, and customer support.
        </p>
      </header>

      {/* Search Input Bar */}
      <div className="relative max-w-lg mx-auto">
        <Search className="w-4 h-4 text-[#124328]/50 absolute left-3.5 top-3.5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by keyword, product, delivery, or returns..."
          className="w-full pl-10 pr-4 py-2.5 text-xs rounded-full border border-[#124328]/20 bg-white text-[#132218] placeholder-[#132218]/40 focus:outline-none focus:border-[#124328] shadow-2xs"
        />
      </div>

      {/* Category Chips */}
      <nav aria-label="FAQ categories" className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none justify-start sm:justify-center">
        {categories.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#124328] text-[#FBF9F4] shadow-xs'
                  : 'bg-white text-[#132218]/70 border border-[#124328]/15 hover:bg-[#FAF7F2]'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </nav>

      {/* FAQ Accordion List */}
      <div className="space-y-3">
        {filteredFaqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="bg-white rounded-xl border border-[#124328]/10 shadow-2xs overflow-hidden transition-all"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-[#FAF7F2] transition-colors"
                aria-expanded={isOpen}
              >
                <div className="font-serif font-bold text-sm sm:text-base text-[#124328]">
                  {faq.question}
                </div>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-[#E0980B] shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#132218]/45 shrink-0" />
                )}
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#132218]/80 leading-relaxed border-t border-[#124328]/5 bg-[#FAF7F2]/40 space-y-3">
                  <p>{faq.answer}</p>
                  {faq.actionLink && (
                    <button
                      onClick={() => onNavigate(faq.actionLink!.route)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#124328] hover:underline"
                    >
                      <span>{faq.actionLink.label}</span>
                      <span>→</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {filteredFaqs.length === 0 && (
          <div className="py-12 text-center text-xs text-[#132218]/60 bg-white rounded-xl border border-[#124328]/10 p-6">
            No questions matched your search criteria. Please contact our support desk directly via WhatsApp or email.
          </div>
        )}
      </div>

      {/* Support Help Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#FAF7F2] border border-[#124328]/15 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <div className="font-serif font-bold text-base text-[#124328]">
            Have a question that is not addressed here?
          </div>
          <p className="text-xs text-[#132218]/70">
            Reach out to our customer support desk. We are happy to answer any questions directly.
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <a
            href={BUSINESS_INFO.whatsAppDirectLink}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg bg-[#124328] text-white text-xs font-semibold hover:bg-[#1A5A35] transition-colors flex items-center gap-1.5"
          >
            <MessageCircle className="w-3.5 h-3.5 text-[#E0980B]" />
            <span>WhatsApp</span>
          </a>
          <button
            onClick={() => onNavigate('contact')}
            className="px-4 py-2 rounded-lg bg-white text-[#124328] border border-[#124328]/20 text-xs font-semibold hover:bg-[#FAF7F2] transition-colors"
          >
            Contact Desk
          </button>
        </div>
      </div>
    </div>
  );
};
