import React from 'react';
import { Product } from '../types';
import { isProductPurchasable } from '../data/products';
import { ArrowRight, Info, Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const purchasable = isProductPurchasable(product);
  const pricedOptions = product.packOptions.filter((option) => typeof option.unitPrice === 'number');
  const startingPrice = pricedOptions.length > 0
    ? Math.min(...pricedOptions.map((option) => option.unitPrice as number))
    : null;
  const packSummary = product.slug === 'natural-wheat'
    ? '5 kg and 10 kg'
    : pricedOptions.map((option) => option.sizeLabel).join(', ');

  return (
    <article
      id={`product-card-${product.slug}`}
      className="group flex flex-col bg-white rounded-2xl border border-[#124328]/10 shadow-xs hover:shadow-md hover:border-[#124328]/25 transition-all duration-300 overflow-hidden"
    >
      {/* Product Image Container */}
      <div className="relative aspect-square w-full bg-[#FAF7F2] overflow-hidden">
        <img
          src={product.primaryImage}
          alt={product.imageAlt}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Category Pill */}
        <div className="absolute top-3.5 left-3.5 z-10">
          <span className="px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-white/95 text-[#124328] shadow-xs backdrop-blur-xs border border-[#124328]/10">
            {product.categoryLabel}
          </span>
        </div>

        {/* Status Pill */}
        <div className="absolute top-3.5 right-3.5 z-10">
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#E0980B]/15 text-[#9E6E17] border border-[#E0980B]/30 backdrop-blur-xs">
            {product.availabilityState}
          </span>
        </div>

        {/* Illustrative Notice Overlay at bottom of image */}
        <div className="absolute inset-x-0 bottom-0 py-1 px-3 bg-gradient-to-t from-black/40 to-transparent text-[10px] text-white/90 text-center tracking-tight">
          Product imagery is illustrative. Actual packaging may vary.
        </div>
      </div>

      {/* Product Information */}
      <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between gap-4">
        <div className="space-y-2">
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#124328] group-hover:text-[#1A5A35] transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="text-xs sm:text-sm text-[#132218]/75 leading-relaxed line-clamp-2">
            {product.shortDescription}
          </p>
        </div>

        {/* Commercial Status & Ordering State */}
        <div className="pt-3 border-t border-[#124328]/5 flex flex-col gap-3">
          <div className="flex items-center gap-1.5 text-xs text-[#132218]/65">
            <Info className="w-3.5 h-3.5 text-[#E0980B] shrink-0" />
            <span>{startingPrice ? `From ₹${startingPrice.toLocaleString('en-IN')} • ${packSummary}` : 'Commercial specifications pending'}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            <button
              id={`view-btn-${product.slug}`}
              type="button"
              onClick={() => onSelect(product)}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#124328] text-[#FBF9F4] text-xs font-semibold hover:bg-[#1A5A35] transition-colors focus:outline-none focus:ring-2 focus:ring-[#124328] focus:ring-offset-2"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Product</span>
            </button>

            <button
              type="button"
              disabled={!purchasable}
              aria-disabled={!purchasable}
              title={
                purchasable
                  ? 'Continue to secure guest checkout'
                  : 'Ordering will open after stock, SKU and statutory store details are verified.'
              }
              className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-semibold border transition-all cursor-not-allowed bg-[#FAF7F2] text-[#132218]/45 border-[#124328]/10"
            >
              <span>Ordering Opens Soon</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
