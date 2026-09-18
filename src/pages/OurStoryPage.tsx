import React from 'react';
import { PageRoute } from '../types';
import { BUSINESS_INFO } from '../data/businessInfo';
import { Leaf, ShieldCheck, HeartHandshake, ArrowRight, CheckCircle2 } from 'lucide-react';

interface OurStoryPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const OurStoryPage: React.FC<OurStoryPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16">
      {/* Header Statement */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#124328]/5 border border-[#124328]/10 text-xs font-semibold text-[#124328] uppercase tracking-wider">
          <Leaf className="w-3.5 h-3.5 text-[#1C602A]" />
          <span>{BUSINESS_INFO.parentGroupLine}</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#124328] leading-tight">
          Bridging Time-Honoured Village Wisdom with Contemporary Family Living
        </h1>
        <p className="text-base sm:text-lg text-[#132218]/80 leading-relaxed">
          {BUSINESS_INFO.tagline}. At Katehranchal Agro Foods, we exist to protect the purity of India&apos;s traditional rural foodways and make them accessible to modern urban households.
        </p>
      </div>

      {/* Main Narrative Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="space-y-4 text-xs sm:text-sm text-[#132218]/80 leading-relaxed">
          <h2 className="font-serif text-2xl font-bold text-[#124328]">
            The Agricultural Heart of Katehranchal
          </h2>
          <p>
            For generations, the villages of India possessed an intimate, unhurried relationship with food. Butter was hand-churned and gently simmered into golden, aromatic Desi Ghee. Mustard seeds were harvested under the winter sun and pressed slowly through cold-crush expellers, preserving their pungent natural aroma and essential fatty acids. Wheat was grown in mineral-rich soil, ripened naturally under open skies, and kept whole.
          </p>
          <p>
            However, the demands of modern industrial food distribution introduced chemical solvent extraction, high-heat bleaching, artificial coloring, and plastic storage. Nutrition gave way to shelf-life convenience.
          </p>
          <p className="font-semibold text-[#124328]">
            Katehranchal Agro Foods was founded to reverse this compromise.
          </p>
        </div>

        <div className="rounded-2xl overflow-hidden shadow-xs border border-[#124328]/15 bg-[#FAF7F2]">
          <img
            src="/assets/illustrations/hands-cradling-harvest.svg"
            alt="Reverent hands cradling traditional golden harvest"
            className="w-full h-auto object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="p-4 bg-white/90 border-t border-[#124328]/10 text-center">
            <span className="font-serif text-sm font-bold text-[#124328]">Generations of Agricultural Custodianship</span>
            <p className="text-[11px] text-[#132218]/60 mt-0.5">Honouring the patient soil, seasonal rains, and traditional village labour.</p>
          </div>
        </div>
      </div>

      {/* Visual Editorial Storytelling Banner: Farm to Home Journey */}
      <div className="rounded-3xl overflow-hidden border border-[#124328]/15 shadow-sm bg-[#FAF7F2]">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          <div className="lg:col-span-7 p-6 sm:p-8 lg:p-12 space-y-4">
            <div className="text-xs font-bold uppercase tracking-widest text-[#E0980B]">
              The Traditional Circuit
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#124328] leading-snug">
              From Rural Fields Directly to Modern Kitchens
            </h3>
            <p className="text-xs sm:text-sm text-[#132218]/75 leading-relaxed">
              We shorten the path between smallholder harvest and your family dining table. By standardizing clean extraction and food-grade packaging without intermediate commercial blending, we ensure that every jar of ghee and every tin of oil retains its authentic nutritional value.
            </p>
            <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-[#124328]">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#1C602A]" />
                <span>Zero Solvent Extraction</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#1C602A]" />
                <span>Glass & Tin Packaging</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#1C602A]" />
                <span>Direct Farmer Remuneration</span>
              </div>
            </div>
          </div>
          <div className="lg:col-span-5 h-full min-h-[260px] bg-[#F5EFEB] flex items-center justify-center p-4">
            <img
              src="/assets/illustrations/farm-to-home-journey.svg"
              alt="Editorial illustration of farm to home agricultural journey"
              className="w-full max-w-sm h-auto object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>

      {/* Pillars of Integrity */}
      <div className="border-t border-[#124328]/10 pt-12 space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#124328]">
            Our Guiding Pillars of Truth
          </h3>
          <p className="text-xs sm:text-sm text-[#132218]/70 mt-1">
            We adhere strictly to factual transparency and genuine craftsmanship.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-white border border-[#124328]/10 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#F5EFEB] flex items-center justify-center text-[#1C602A]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-base font-bold text-[#124328]">
              No Artificial Shortcuts
            </h4>
            <p className="text-xs text-[#132218]/70 leading-relaxed">
              Ingredients, processing details and applicable batch reports will be published clearly when verification is complete.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white border border-[#124328]/10 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#F5EFEB] flex items-center justify-center text-[#1C602A]">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-base font-bold text-[#124328]">
              Village Farmer Respect
            </h4>
            <p className="text-xs text-[#132218]/70 leading-relaxed">
              Our roots lie in rural farming communities. By connecting traditional village producers directly with urban tables, we sustain agricultural dignity and fair remuneration.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white border border-[#124328]/10 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#F5EFEB] flex items-center justify-center text-[#1C602A]">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-base font-bold text-[#124328]">
              Sealed Glass Integrity
            </h4>
            <p className="text-xs text-[#132218]/70 leading-relaxed">
              Applicable products are planned for glass containers or suitable food-grade packaging with protective seals and outer transit protection.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="p-8 sm:p-10 rounded-2xl bg-[#124328] text-[#FBF9F4] text-center space-y-4">
        <h3 className="font-serif text-2xl sm:text-3xl font-bold">
          Experience Authentic Village Craftsmanship
        </h3>
        <p className="text-xs sm:text-sm text-[#FBF9F4]/80 max-w-xl mx-auto leading-relaxed">
          Invite the authentic aroma of pure Desi Ghee and cold-pressed mustard oil into your daily home cooking.
        </p>
        <button
          onClick={() => onNavigate('shop')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded bg-[#E0980B] text-[#124328] text-xs font-bold uppercase tracking-wider hover:bg-[#D9B875] transition-colors shadow-sm"
        >
          <span>Explore Product Catalogue</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
