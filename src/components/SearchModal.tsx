import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, Package } from 'lucide-react';
import { CATALOG_PRODUCTS, COMING_SOON_ITEMS } from '../data/products';
import { PageRoute, Product } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
  onNavigate: (route: PageRoute) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const normalizedQuery = query.toLowerCase().trim();

  const matchedProducts = normalizedQuery
    ? CATALOG_PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(normalizedQuery) ||
          p.shortDescription.toLowerCase().includes(normalizedQuery) ||
          p.categoryLabel.toLowerCase().includes(normalizedQuery)
      )
    : [];

  const matchedComingSoon = normalizedQuery
    ? COMING_SOON_ITEMS.filter(
        (item) =>
          item.name.toLowerCase().includes(normalizedQuery) ||
          item.description.toLowerCase().includes(normalizedQuery) ||
          item.category.toLowerCase().includes(normalizedQuery)
      )
    : [];

  const quickLinks = [
    { label: 'Desi Ghee', action: () => onSelectProduct(CATALOG_PRODUCTS[0]) },
    { label: 'Black Mustard Oil', action: () => onSelectProduct(CATALOG_PRODUCTS[1]) },
    { label: 'Yellow Mustard Oil', action: () => onSelectProduct(CATALOG_PRODUCTS[2]) },
    { label: 'Natural Wheat', action: () => onSelectProduct(CATALOG_PRODUCTS[3]) },
    { label: 'Shop Catalogue', action: () => { onClose(); onNavigate('shop'); } },
    { label: 'Coming Soon Collection', action: () => { onClose(); onNavigate('coming-soon'); } },
    { label: 'Why Choose Us', action: () => { onClose(); onNavigate('why-choose-us'); } },
    { label: 'Frequently Asked Questions', action: () => { onClose(); onNavigate('faqs'); } },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-[#124328]/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-[#124328]/15 overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#124328]/10 bg-[#FBF9F4]">
          <Search className="w-5 h-5 text-[#E0980B] shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            aria-label="Search products and website information"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, traditional oils, grains, or guidelines..."
            className="w-full bg-transparent text-[#132218] text-base placeholder-[#132218]/40 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-[#132218]/50 hover:text-[#132218] mr-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-semibold px-2.5 py-1 rounded bg-[#124328]/5 text-[#124328] hover:bg-[#124328]/10 transition-colors ml-2"
          >
            ESC
          </button>
        </div>

        {/* Results Area */}
        <div className="p-5 overflow-y-auto space-y-6">
          {query ? (
            <>
              {matchedProducts.length > 0 && (
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#E0980B] mb-3">
                    Available Products ({matchedProducts.length})
                  </div>
                  <div className="space-y-2">
                    {matchedProducts.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          onClose();
                          onSelectProduct(p);
                        }}
                        className="w-full flex items-center justify-between p-3 rounded-lg border border-[#124328]/10 hover:border-[#E0980B] hover:bg-[#FBF9F4] transition-all text-left group"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={p.primaryImage}
                            alt={p.name}
                            className="w-12 h-12 object-contain rounded bg-[#F5EFEB] p-1 border border-[#124328]/10"
                          />
                          <div>
                            <div className="font-serif font-bold text-[#124328] group-hover:text-[#1C602A] transition-colors">
                              {p.name}
                            </div>
                            <div className="text-xs text-[#132218]/70 line-clamp-1">
                              {p.shortDescription}
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-[#E0980B] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {matchedComingSoon.length > 0 && (
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#1C602A] mb-3">
                    Upcoming Harvests (Coming Soon)
                  </div>
                  <div className="space-y-2">
                    {matchedComingSoon.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-lg border border-dashed border-[#1C602A]/30 bg-[#F5EFEB]/50 flex items-center justify-between"
                      >
                        <div>
                          <div className="font-semibold text-sm text-[#124328]">{item.name}</div>
                          <div className="text-xs text-[#132218]/70">{item.intendedPurpose}</div>
                        </div>
                        <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-[#1C602A]/10 text-[#1C602A]">
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {matchedProducts.length === 0 && matchedComingSoon.length === 0 && (
                <div className="py-8 text-center space-y-3">
                  <div className="w-24 h-24 mx-auto rounded-xl overflow-hidden border border-[#124328]/10 bg-[#FAF7F2]">
                    <img
                      src="/assets/illustrations/empty-cart-earthen-urn.svg"
                      alt="Traditional earthen vessel"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="text-sm font-semibold text-[#124328]">
                    No products matched &ldquo;{query}&rdquo;
                  </div>
                  <p className="text-xs text-[#132218]/60 max-w-xs mx-auto">
                    Try searching for &ldquo;Ghee&rdquo;, &ldquo;Mustard Oil&rdquo;, or &ldquo;Wheat&rdquo;, or browse our complete catalogue.
                  </p>
                </div>
              )}
            </>
          ) : (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#E0980B] mb-3">
                Quick Product & Category Access
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {quickLinks.map((link) => (
                  <button
                    key={link.label}
                    onClick={link.action}
                    className="p-3 text-left rounded-lg bg-[#FBF9F4] hover:bg-[#F5EFEB] border border-[#124328]/10 text-sm text-[#124328] font-medium transition-colors flex items-center justify-between"
                  >
                    <span>{link.label}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#E0980B]" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
