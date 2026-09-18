import React from 'react';
import { PageRoute, Product, ProductCategory } from '../types';
import { CATALOG_PRODUCTS, COMING_SOON_ITEMS } from '../data/products';
import { BUSINESS_INFO } from '../data/businessInfo';
import { ProductCard } from '../components/ProductCard';
import { 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  Sparkles, 
  CheckCircle2, 
  MessageCircle, 
  Package, 
  Leaf, 
  HeartHandshake,
  Clock,
  ExternalLink,
  Mail,
  SunMedium,
  Check
} from 'lucide-react';
import { VisualStorytelling } from '../components/VisualStorytelling';

interface HomePageProps {
  onNavigate: (route: PageRoute, category?: ProductCategory) => void;
  onSelectProduct: (product: Product) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onSelectProduct }) => {

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* 1. Premium Homepage Hero Section */}
      <section className="relative overflow-hidden bg-[#F5EFEB] border-b border-[#124328]/10 pt-12 sm:pt-16 lg:pt-20 pb-16 sm:pb-20 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Narrative Column */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#124328]/5 border border-[#124328]/15 text-xs font-semibold text-[#124328] tracking-wide">
                <Leaf className="w-3.5 h-3.5 text-[#1C602A]" />
                <span>{BUSINESS_INFO.parentGroupLine}</span>
              </div>

              <h1 className="font-serif text-[2.45rem] sm:text-5xl lg:text-[4.15rem] font-semibold text-[#124328] leading-[1.06] tracking-[-0.025em]">
                Traditional Village Products for Modern Homes
              </h1>

              <p className="text-base sm:text-lg text-[#132218]/78 leading-[1.8] max-w-2xl mx-auto lg:mx-0">
                Katehranchal Agro Foods presents a focused collection of traditional food staples for modern family kitchens. From time-honoured Desi Ghee and traditional mustard oils to whole natural wheat, we bring authentic rural staples directly to Indian households.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button
                  onClick={() => onNavigate('shop', 'all')}
                  className="w-full sm:w-auto px-8 py-4 rounded-lg bg-[#124328] text-[#FBF9F4] text-xs sm:text-sm font-semibold tracking-wider uppercase hover:bg-[#1A5A35] transition-all shadow-md flex items-center justify-center gap-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E0980B]"
                >
                  <span>Explore Catalog</span>
                  <ArrowRight className="w-4 h-4 text-[#E0980B] group-hover:translate-x-0.5 transition-transform" />
                </button>

                <button
                  onClick={() => onNavigate('our-story')}
                  className="w-full sm:w-auto px-8 py-4 rounded-lg border border-[#124328]/30 text-[#124328] text-xs sm:text-sm font-semibold tracking-wider uppercase hover:bg-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E0980B]"
                >
                  Our Heritage & Values
                </button>
              </div>

              {/* Foundation Trust Badges */}
              <div className="pt-6 grid grid-cols-3 gap-3 border-t border-[#124328]/10 max-w-lg mx-auto lg:mx-0">
                <div className="text-center lg:text-left">
                  <div className="font-serif font-bold text-base sm:text-lg text-[#124328]">Traditional</div>
                  <div className="text-[11px] text-[#132218]/70">Village Sourced</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="font-serif font-bold text-base sm:text-lg text-[#124328]">Glass Sealed</div>
                  <div className="text-[11px] text-[#132218]/70">Food-Grade Protection</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="font-serif font-bold text-base sm:text-lg text-[#124328]">Transparent</div>
                  <div className="text-[11px] text-[#132218]/70">Clear Specifications</div>
                </div>
              </div>
            </div>

            {/* Right Official Logo & Visual Showcase Column */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[360px] sm:max-w-[410px] min-h-[430px] sm:min-h-[500px] rounded-[2rem] bg-white/90 p-8 sm:p-10 shadow-[0_24px_70px_rgba(18,67,40,0.13)] border border-[#E0980B]/25 flex flex-col items-center justify-center text-center overflow-hidden">
                <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[#E0980B]/60 to-transparent" />
                {/* Official Logo Display */}
                <div className="w-52 h-64 sm:w-64 sm:h-80 relative flex items-center justify-center mb-5">
                  <img
                    src="/assets/katehranchal-agro-foods-logo.png"
                    alt="Katehranchal Agro Foods logo"
                    className="w-full h-full object-contain"
                    width={256}
                    height={320}
                    loading="eager"
                  />
                </div>
                <div className="font-serif text-xl sm:text-2xl font-semibold text-[#124328] tracking-[0.015em]">
                  Katehranchal Agro Foods
                </div>
                <div className="max-w-[250px] text-[11px] sm:text-xs text-[#8B5D08] font-bold tracking-[0.16em] uppercase mt-2 leading-relaxed">
                  Traditional Village Products for Modern Homes
                </div>
                <div className="text-[11px] text-[#132218]/55 mt-2">
                  {BUSINESS_INFO.parentGroupLine}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Brand Introduction Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-[#124328]/10 p-8 sm:p-12 lg:p-16 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            <div className="lg:col-span-5 space-y-4">
              <div className="text-xs font-bold uppercase tracking-widest text-[#E0980B]">
                Who We Are
              </div>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#124328] leading-tight">
                Rooted in Traditional Indian Agriculture
              </h2>
              <p className="text-xs sm:text-sm text-[#132218]/80 leading-relaxed">
                Part of the Katehranchal Group, Katehranchal Agro Foods was established to offer traditional village staples with total ingredient integrity and transparent consumer communication.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => onNavigate('our-story')}
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#124328] hover:text-[#1C602A] transition-colors"
                >
                  <span>Explore Our History & Mission</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#E0980B]" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-[#F5EFEB] border border-[#124328]/10 space-y-3">
                <div className="w-9 h-9 rounded-lg bg-[#124328] text-[#E0980B] flex items-center justify-center font-bold text-sm">
                  01
                </div>
                <h3 className="font-serif font-bold text-base text-[#124328]">
                  Focused Product Collection
                </h3>
                <p className="text-xs text-[#132218]/75 leading-relaxed">
                  A considered selection of familiar food staples for modern family kitchens, focusing on daily cooking essentials.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#F5EFEB] border border-[#124328]/10 space-y-3">
                <div className="w-9 h-9 rounded-lg bg-[#124328] text-[#E0980B] flex items-center justify-center font-bold text-sm">
                  02
                </div>
                <h3 className="font-serif font-bold text-base text-[#124328]">
                  Clear Product Information
                </h3>
                <p className="text-xs text-[#132218]/75 leading-relaxed">
                  Product details, variations, pricing and availability presented before purchase without unverified claims.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#F5EFEB] border border-[#124328]/10 space-y-3">
                <div className="w-9 h-9 rounded-lg bg-[#124328] text-[#E0980B] flex items-center justify-center font-bold text-sm">
                  03
                </div>
                <h3 className="font-serif font-bold text-base text-[#124328]">
                  Food-Grade Packaging
                </h3>
                <p className="text-xs text-[#132218]/75 leading-relaxed">
                  Every product is packaged in food-grade containers and protected by multi-layer cushioning for secure transit.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#F5EFEB] border border-[#124328]/10 space-y-3">
                <div className="w-9 h-9 rounded-lg bg-[#124328] text-[#E0980B] flex items-center justify-center font-bold text-sm">
                  04
                </div>
                <h3 className="font-serif font-bold text-base text-[#124328]">
                  Direct Customer Support
                </h3>
                <p className="text-xs text-[#132218]/75 leading-relaxed">
                  Customer support is available through official email and direct WhatsApp contact for all customer inquiries.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Collection Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-[#124328]/10 gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-[#E0980B] mb-1">
              Curated Daily Staples
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#124328]">
              Featured Traditional Foods
            </h2>
          </div>
          <button
            onClick={() => onNavigate('shop', 'all')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#124328] hover:text-[#1C602A] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E0980B] rounded"
          >
            <span>View Full Catalog</span>
            <ArrowRight className="w-4 h-4 text-[#E0980B]" />
          </button>
        </div>

        {/* Product Cards Grid using ProductCard component */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {CATALOG_PRODUCTS.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      </section>

      {/* 4. Permanent Scroll-Based Visual Storytelling Experience */}
      <VisualStorytelling onNavigate={onNavigate} />

      {/* 5. Brand-Story Preview Section */}
      <section className="bg-[#124328] text-[#FBF9F4] py-16 sm:py-24 border-y border-[#E0980B]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#E0980B] text-xs font-semibold uppercase tracking-wider">
                <SunMedium className="w-3.5 h-3.5" />
                <span>Our Heritage & Philosophy</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight leading-tight text-[#FBF9F4]">
                The Story Behind Every Drop and Grain
              </h2>
              <p className="text-xs sm:text-sm text-[#FBF9F4]/80 leading-relaxed">
                In rural India, food preparation has always been rooted in patience, seasonality and care. For generations, households relied on traditional methods for oils, ghee, and whole grains.
              </p>
              <p className="text-xs sm:text-sm text-[#FBF9F4]/80 leading-relaxed">
                Katehranchal Agro Foods brings these familiar staples to modern homes with unexaggerated honesty, clean packaging, and verified information.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => onNavigate('our-story')}
                  className="px-6 py-3 rounded-lg bg-[#E0980B] text-[#124328] text-xs font-bold uppercase tracking-wider hover:bg-[#EFA823] transition-colors shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  Read the Full Brand Story
                </button>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="p-8 sm:p-10 rounded-3xl bg-white/5 border border-white/10 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#E0980B] text-[#124328] font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-base text-[#FBF9F4]">
                        Traditional Oil Extraction
                      </h3>
                      <p className="text-xs text-[#FBF9F4]/70 mt-1 leading-relaxed">
                        Prepared to retain the distinctive character and aroma commonly associated with traditional Indian cooking.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#E0980B] text-[#124328] font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-base text-[#FBF9F4]">
                        Traditional Simmered Clarification
                      </h3>
                      <p className="text-xs text-[#FBF9F4]/70 mt-1 leading-relaxed">
                        Prepared by gently simmering butter to yield traditional golden Desi Ghee suitable for daily family recipes.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#E0980B] text-[#124328] font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-base text-[#FBF9F4]">
                        Clean Natural Wheat
                      </h3>
                      <p className="text-xs text-[#FBF9F4]/70 mt-1 leading-relaxed">
                        Offered as a familiar family-kitchen staple suitable for home milling and everyday food preparation.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Why Choose Us Preview Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-bold uppercase tracking-widest text-[#E0980B] mb-1">
            Core Differentiators
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#124328]">
            Why Discerning Families Choose Us
          </h2>
          <p className="text-xs sm:text-sm text-[#132218]/70 mt-2 leading-relaxed">
            We operate with complete ingredient integrity and packaging transparency. Here is why our products stand apart from mass-market supermarket brands.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-[#124328]/10 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#124328]/5 text-[#124328] flex items-center justify-center">
              <Leaf className="w-5 h-5 text-[#1C602A]" />
            </div>
            <h3 className="font-serif text-base font-bold text-[#124328]">
              Traditional Preparation
            </h3>
            <p className="text-xs text-[#132218]/70 leading-relaxed">
              Processing details will be documented for each product and published after batch verification.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#124328]/10 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#124328]/5 text-[#124328] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-[#1C602A]" />
            </div>
            <h3 className="font-serif text-base font-bold text-[#124328]">
              Food-Grade Glass
            </h3>
            <p className="text-xs text-[#132218]/70 leading-relaxed">
              Glass containers and protective seals are planned for applicable products, with final packaging specifications published before ordering opens.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#124328]/10 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#124328]/5 text-[#124328] flex items-center justify-center">
              <Truck className="w-5 h-5 text-[#1C602A]" />
            </div>
            <h3 className="font-serif text-base font-bold text-[#124328]">
              Multi-Layer Packaging
            </h3>
            <p className="text-xs text-[#132218]/70 leading-relaxed">
              Protective outer packaging is designed to reduce movement and leakage risk during normal transit.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#124328]/10 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#124328]/5 text-[#124328] flex items-center justify-center">
              <HeartHandshake className="w-5 h-5 text-[#1C602A]" />
            </div>
            <h3 className="font-serif text-base font-bold text-[#124328]">
              Dedicated Assistance
            </h3>
            <p className="text-xs text-[#132218]/70 leading-relaxed">
              Direct access to our customer assistance desk via WhatsApp and official email for order queries and delivery updates.
            </p>
          </div>
        </div>

        <div className="text-center mt-8">
          <button
            onClick={() => onNavigate('why-choose-us')}
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#124328] hover:text-[#1C602A]"
          >
            <span>Read Complete Quality Principles</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#E0980B]" />
          </button>
        </div>
      </section>

      {/* 6. How It Works 7-Step Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#F5EFEB] rounded-3xl p-8 sm:p-12 border border-[#124328]/10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-[#124328]/10 gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-[#E0980B] mb-1">
                Transparent Process
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#124328]">
                How Your Order Travels to Your Kitchen
              </h2>
            </div>
            <button
              onClick={() => onNavigate('how-it-works')}
              className="text-xs font-bold uppercase tracking-wider text-[#124328] hover:text-[#1C602A] flex items-center gap-1.5"
            >
              <span>Read 7-Step Guide</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#E0980B]" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {[
              { step: '1', title: 'Catalog Selection', desc: 'Choose pure ghee, cold-pressed oils, or grains.' },
              { step: '2', title: 'Pack Size Choice', desc: 'Select appropriate jar or can volume.' },
              { step: '3', title: 'Shipping Address', desc: 'Enter recipient details and postal PIN code.' },
              { step: '4', title: 'Secure Gateway', desc: 'UPI, Card, or Net Banking processing.' },
              { step: '5', title: 'Order Creation', desc: 'Instant server invoice and receipt generation.' },
              { step: '6', title: 'Safe Dispatch', desc: 'Multi-layer food protection packaging.' },
              { step: '7', title: 'Doorstep Handover', desc: 'Delivered securely to your modern home.' },
            ].map((item) => (
              <div
                key={item.step}
                className="p-4 rounded-xl bg-white border border-[#124328]/10 flex flex-col justify-between"
              >
                <div className="w-7 h-7 rounded-full bg-[#124328] text-[#E0980B] font-bold text-xs flex items-center justify-center mb-3">
                  {item.step}
                </div>
                <div>
                  <div className="font-serif font-bold text-xs text-[#124328]">{item.title}</div>
                  <div className="text-[11px] text-[#132218]/70 mt-1 leading-snug">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Upcoming Seasonal Harvests (Coming Soon Preview) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#124328] to-[#1A5A35] text-[#FBF9F4] flex flex-col lg:flex-row lg:items-center justify-between gap-8 shadow-sm">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#E0980B] font-bold">
              <Clock className="w-3.5 h-3.5" />
              <span>Upcoming Seasonal Harvests</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold">
              Future Village Harvests & Traditional Essentials
            </h3>
            <p className="text-xs sm:text-sm text-[#FBF9F4]/80 leading-relaxed">
              We are carefully preparing stone-ground Natural Wheat Flour, pure Cow Dung Cakes, Traditional Wood Ash, natural fertile soil, dry neem wood, and dry mango wood for upcoming release.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => onNavigate('coming-soon')}
              className="px-6 py-3.5 rounded-lg bg-[#E0980B] text-[#124328] text-xs font-bold uppercase tracking-wider hover:bg-[#EFA823] transition-colors shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Explore Coming Soon Items
            </button>
          </div>
        </div>
      </section>

      {/* 8. Dedicated Customer Support Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-[#124328]/10 p-8 sm:p-12 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-3">
              <div className="text-xs font-bold uppercase tracking-widest text-[#E0980B]">
                Customer Assistance Desk
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#124328]">
                Need Help with Your Order or Have Questions?
              </h2>
              <p className="text-xs sm:text-sm text-[#132218]/75 leading-relaxed">
                Our support team is on hand to assist with tracking updates, bulk inquiries, or product questions. Please note: WhatsApp is for customer support and inquiries; order placement is completed securely through our online checkout.
              </p>
            </div>

            <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-3">
              <a
                href={BUSINESS_INFO.whatsAppDirectLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 rounded-xl bg-[#F5EFEB] border border-[#124328]/10 hover:border-[#E0980B] transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#124328] text-[#25D366]">
                    <MessageCircle className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#132218]/60">WhatsApp Support</div>
                    <div className="text-sm font-bold text-[#124328]">{BUSINESS_INFO.supportWhatsAppDisplay}</div>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-[#E0980B] group-hover:translate-x-0.5 transition-transform" />
              </a>

              <a
                href={`mailto:${BUSINESS_INFO.officialEmail}`}
                className="flex items-center justify-between p-4 rounded-xl bg-[#F5EFEB] border border-[#124328]/10 hover:border-[#E0980B] transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#124328] text-[#E0980B]">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#132218]/60">Official Email</div>
                    <div className="text-sm font-bold text-[#124328]">{BUSINESS_INFO.officialEmail}</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#E0980B] group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
