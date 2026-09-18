import React, { useState, useMemo } from 'react';
import { CATALOG_PRODUCTS, COMING_SOON_ITEMS } from '../data/products';
import { Product, PageRoute, ProductCategory } from '../types';
import { ProductCard } from '../components/ProductCard';
import { CommercialDataAuditModal } from '../components/CommercialDataAuditModal';
import { Search, X, SlidersHorizontal, ArrowRight, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';

interface ShopPageProps {
  initialCategory?: ProductCategory;
  onSelectProduct: (product: Product) => void;
  onNavigate: (route: PageRoute) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({ initialCategory, onSelectProduct, onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAuditModalOpen, setIsAuditModalOpen] = useState<boolean>(false);

  const categories = [
    { id: 'all', label: 'All Products', count: CATALOG_PRODUCTS.length },
    { id: 'ghee', label: 'Ghee', count: 1 },
    { id: 'mustard-oils', label: 'Mustard Oils', count: 2 },
    { id: 'grains', label: 'Grains', count: 1 },
  ];

  const filteredProducts = useMemo(() => {
    return CATALOG_PRODUCTS.filter((product) => {
      const matchesCategory =
        selectedCategory === 'all' ||
        product.category === selectedCategory ||
        product.slug === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        product.name.toLowerCase().includes(q) ||
        product.categoryLabel.toLowerCase().includes(q) ||
        product.shortDescription.toLowerCase().includes(q) ||
        product.suitableUses.some((use) => use.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Page Header */}
      <header className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-[#9E6E17] bg-[#E0980B]/10 border border-[#E0980B]/25">
          <span>Official Product Catalogue</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#124328] tracking-tight">
          Shop the Essential Collection
        </h1>
        <p className="text-xs sm:text-sm text-[#132218]/75 leading-relaxed">
          Explore a focused collection of traditionally inspired food staples for modern family kitchens.
        </p>
      </header>

      {/* Commercial Data Status Notice */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF7F2] border border-[#124328]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-[#124328] shrink-0 mt-0.5" />
          <div className="text-xs space-y-0.5">
            <div className="font-semibold text-[#124328]">
              Commercial Specifications & Ordering Schedule
            </div>
            <p className="text-[#132218]/70 leading-relaxed">
              Product details and nutritional information are displayed transparently. Ordering will open upon publication of verified pack sizes and commercial pricing.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsAuditModalOpen(true)}
          className="shrink-0 px-3.5 py-2 rounded-lg text-xs font-semibold bg-white text-[#124328] border border-[#124328]/20 hover:bg-[#F5EFEB] transition-colors inline-flex items-center gap-1.5 shadow-2xs"
        >
          <AlertCircle className="w-3.5 h-3.5 text-[#E0980B]" />
          <span>Inspect Commercial Audit</span>
        </button>
      </div>

      {/* Filter Toolbar & Search */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Category Navigation Pills */}
          <nav aria-label="Product categories" className="w-full min-w-0 flex items-center gap-2 overflow-x-auto overscroll-x-contain snap-x snap-mandatory pb-2 pr-4 md:pb-0 md:pr-0 scrollbar-none">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  id={`cat-btn-${cat.id}`}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`snap-start shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
                    isActive
                      ? 'bg-[#124328] text-[#FBF9F4] shadow-xs'
                      : 'bg-white text-[#132218]/70 border border-[#124328]/15 hover:bg-[#FAF7F2]'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-[#FBF9F4]/20 text-[#FBF9F4]' : 'bg-[#124328]/10 text-[#124328]'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Catalogue Search Bar */}
          <div className="relative w-full md:w-80 shrink-0">
            <Search className="w-4 h-4 text-[#124328]/50 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search staples, uses, or oils..."
              aria-label="Search product catalogue"
              className="w-full pl-10 pr-9 py-2 rounded-full text-xs border border-[#124328]/20 bg-white text-[#132218] placeholder-[#132218]/40 focus:outline-none focus:border-[#124328] shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-[#132218]/40 hover:text-[#132218]"
                aria-label="Clear search query"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Results Metadata */}
        <div className="flex items-center justify-between text-xs text-[#132218]/60 px-1">
          <div>
            Showing <span className="font-bold text-[#124328]">{filteredProducts.length}</span> of {CATALOG_PRODUCTS.length} staple products
            {searchQuery && (
              <span> for “<strong className="text-[#124328]">{searchQuery}</strong>”</span>
            )}
          </div>
          {(selectedCategory !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="text-xs font-semibold text-[#9E6E17] hover:underline"
            >
              Reset filters
            </button>
          )}
        </div>
      </div>

      {/* Main Product Grid */}
      {filteredProducts.length > 0 ? (
        <section aria-label="Available products grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
            />
          ))}
        </section>
      ) : (
        /* Empty State */
        <div className="py-16 text-center space-y-4 bg-white rounded-2xl border border-[#124328]/10 p-8">
          <div className="w-12 h-12 rounded-full bg-[#FAF7F2] flex items-center justify-center mx-auto text-[#E0980B]">
            <Search className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-serif font-bold text-lg text-[#124328]">
              No Products Matched Your Filter
            </h3>
            <p className="text-xs text-[#132218]/70 max-w-sm mx-auto">
              Try modifying your search keywords or reset category filters to view our full collection of four staple products.
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-lg bg-[#124328] text-white text-xs font-semibold hover:bg-[#1A5A35] transition-colors"
          >
            Show All Products
          </button>
        </div>
      )}

      {/* Coming Soon Invitation Banner */}
      <section
        id="coming-soon-banner"
        className="rounded-2xl p-6 sm:p-8 bg-[#FAF7F2] border border-[#124328]/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
      >
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#9E6E17]">
            <Sparkles className="w-3.5 h-3.5 text-[#E0980B]" />
            <span>Upcoming Additions</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#124328]">
            Explore 6 Planned Household & Traditional Essentials
          </h2>
          <p className="text-xs text-[#132218]/75 leading-relaxed">
            Discover upcoming additions including Natural Wheat Flour, Cow Dung Cakes, Traditional Wood Ash, Natural Soil, Dry Neem Wood, and Dry Mango Wood. Register for email notifications upon release.
          </p>
        </div>
        <button
          onClick={() => onNavigate('coming-soon')}
          className="shrink-0 px-5 py-3 rounded-xl bg-[#124328] text-[#FBF9F4] text-xs font-semibold hover:bg-[#1A5A35] transition-colors inline-flex items-center gap-2 shadow-sm"
        >
          <span>View Coming Soon</span>
          <ArrowRight className="w-4 h-4 text-[#E0980B]" />
        </button>
      </section>

      {/* Development Commercial Specifications Audit Modal */}
      <CommercialDataAuditModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
      />
    </div>
  );
};
