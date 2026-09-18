import React from 'react';
import { PageRoute } from '../types';
import { ArrowLeft, Home, Compass } from 'lucide-react';

interface NotFoundPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center space-y-8">
      {/* Editorial Artwork */}
      <div className="max-w-md mx-auto aspect-[3/2] rounded-2xl overflow-hidden shadow-xs border border-[#124328]/10 bg-[#FAF7F2]">
        <img
          src="./assets/illustrations/pathway-horizon-404.svg"
          alt="Peaceful village pathway winding towards the morning horizon"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Heading & Text */}
      <div className="space-y-3 max-w-lg mx-auto">
        <div className="text-xs font-bold uppercase tracking-widest text-[#E0980B]">
          Path Not Found • 404
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#124328]">
          This Trail Leads to an Open Field
        </h1>
        <p className="text-xs sm:text-sm text-[#132218]/70 leading-relaxed">
          The page you are looking for does not exist or has been relocated within our catalogue. Follow the path back to our main storefront or browse our essential harvest collection.
        </p>
      </div>

      {/* Action Navigation */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#124328] text-[#FBF9F4] text-xs font-semibold hover:bg-[#1C602A] transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>Return to Storefront</span>
        </button>
        <button
          onClick={() => onNavigate('shop')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white border border-[#124328]/20 text-[#124328] text-xs font-semibold hover:bg-[#FAF7F2] transition-colors"
        >
          <Compass className="w-4 h-4 text-[#E0980B]" />
          <span>Browse Catalogue</span>
        </button>
      </div>
    </div>
  );
};
