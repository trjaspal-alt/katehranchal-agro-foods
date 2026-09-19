import React from 'react';
import { COMING_SOON_ITEMS } from '../data/products';
import { PageRoute } from '../types';
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

interface ComingSoonPageProps { onNavigate: (route: PageRoute) => void; }

export const ComingSoonPage: React.FC<ComingSoonPageProps> = ({ onNavigate }) => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
    <header className="text-center max-w-3xl mx-auto space-y-4">
      <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-[#9E6E17] bg-[#E0980B]/10 border border-[#E0980B]/25">
        <Sparkles className="w-3.5 h-3.5 text-[#E0980B]" /><span>Planned Catalogue Additions</span>
      </div>
      <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#124328] tracking-tight">Upcoming Village Staples & Essentials</h1>
      <p className="text-xs sm:text-sm text-[#132218]/75 leading-relaxed">These products are being evaluated for sourcing, packaging and compliance. Availability and launch dates will be announced on our official website.</p>
    </header>

    <div className="p-5 sm:p-6 rounded-2xl bg-[#FAF7F2] border border-[#124328]/15 space-y-2">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#124328]"><ShieldCheck className="w-4 h-4 text-[#E0980B]" /><span>Notice on Domestic & Ceremonial Items</span></div>
      <p className="text-xs text-[#132218]/80 leading-relaxed">Traditional wood and household products are intended only for appropriate domestic and ceremonial uses. They are not offered for commercial or industrial use. We make no medicinal, therapeutic, or purification claims.</p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {COMING_SOON_ITEMS.map((item) => (
        <article key={item.id} id={`coming-soon-card-${item.slug}`} className="flex flex-col bg-white rounded-2xl border border-[#124328]/10 shadow-xs hover:border-[#124328]/20 transition-all overflow-hidden">
          <div className="relative aspect-4/3 w-full bg-[#FAF7F2] overflow-hidden">
            <img src={item.primaryImage} alt={item.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
            <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/95 text-[#124328] border border-[#124328]/10">{item.category}</span>
            <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300">Coming Soon</span>
          </div>
          <div className="p-6 flex flex-col flex-1 gap-5">
            <div className="space-y-2">
              <h3 className="font-serif text-xl font-bold text-[#124328]">{item.name}</h3>
              <p className="text-xs text-[#132218]/75 leading-relaxed">{item.description}</p>
              {item.domesticUseOnlyNotice && <div className="p-2.5 rounded-lg bg-[#FAF7F2] border border-[#124328]/10 text-[11px] text-[#132218]/70 italic">{item.domesticUseOnlyNotice}</div>}
            </div>
            <div className="space-y-1.5 mt-auto">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#124328]/70">Planned Applications</div>
              <ul className="space-y-1 text-xs text-[#132218]/80">{item.suitableUses.map((use) => <li key={use} className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-[#124328] shrink-0" /><span>{use}</span></li>)}</ul>
            </div>
          </div>
        </article>
      ))}
    </div>

    <div className="text-center pt-6">
      <button onClick={() => onNavigate('shop')} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#124328] text-white text-xs font-semibold hover:bg-[#1A5A35] transition-colors shadow-xs"><span>Explore Available Collection</span><ArrowRight className="w-4 h-4 text-[#E0980B]" /></button>
    </div>
  </div>
);
