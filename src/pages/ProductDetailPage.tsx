import React, { useState } from 'react';
import { Product, PageRoute } from '../types';
import { CATALOG_PRODUCTS, isProductPurchasable, getMissingCommercialFields } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { CommercialDataAuditModal } from '../components/CommercialDataAuditModal';
import {
  ArrowLeft,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  Info,
  MapPin,
  Maximize2,
  X,
  AlertCircle,
  HelpCircle,
  Package,
} from 'lucide-react';

interface ProductDetailPageProps {
  product: Product;
  onNavigate: (route: PageRoute) => void;
  onSelectProduct: (product: Product) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  onNavigate,
  onSelectProduct,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [isZoomOpen, setIsZoomOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'about' | 'uses' | 'specs' | 'shipping'>('about');
  const [pinCode, setPinCode] = useState<string>('');
  const [pinStatus, setPinStatus] = useState<string | null>(null);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState<boolean>(false);

  const purchasable = isProductPurchasable(product);
  const missingFields = getMissingCommercialFields(product);
  const pricedVariations = product.variations.filter((variation) => typeof variation.price === 'number');

  const images = product.galleryImages && product.galleryImages.length > 0
    ? product.galleryImages
    : [product.primaryImage];

  const currentImage = images[selectedImageIndex] || product.primaryImage;

  // Related products (all other catalogue products except current)
  const relatedProducts = CATALOG_PRODUCTS.filter((p) => p.id !== product.id).slice(0, 3);

  const handlePinCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = pinCode.trim();
    if (!/^\d{6}$/.test(cleanPin)) {
      setPinStatus('Please enter a valid 6-digit postal PIN code.');
      return;
    }
    setPinStatus(
      `PIN code ${cleanPin} logged. Complete carrier transit schedules and delivery timelines will be activated upon store release.`
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-14">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumbs" className="flex items-center gap-2 text-xs text-[#132218]/60">
        <button
          onClick={() => onNavigate('shop')}
          className="hover:text-[#124328] font-medium transition-colors flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Catalogue</span>
        </button>
        <span>/</span>
        <span className="text-[#124328]/75 font-medium">{product.categoryLabel}</span>
        <span>/</span>
        <span className="text-[#124328] font-bold">{product.name}</span>
      </nav>

      {/* Main Product Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
        {/* Left Column: Image Gallery (5 cols) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Primary Main Image Frame */}
          <div className="relative aspect-square w-full rounded-2xl bg-[#FAF7F2] border border-[#124328]/10 overflow-hidden shadow-xs">
            <img
              src={currentImage}
              alt={product.imageAlt}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center transition-all duration-300"
            />

            {/* Expand / Zoom Button */}
            <button
              onClick={() => setIsZoomOpen(true)}
              className="absolute top-3.5 right-3.5 p-2 rounded-lg bg-white/90 text-[#124328] hover:bg-white border border-[#124328]/10 shadow-xs transition-colors"
              aria-label="Enlarge product image"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            {/* Illustrative Notice Overlay */}
            <div className="absolute inset-x-0 bottom-0 py-1.5 px-4 bg-gradient-to-t from-black/50 via-black/25 to-transparent text-[11px] text-white text-center font-medium">
              Product imagery is illustrative. Actual packaging may vary.
            </div>
          </div>

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-1" role="tablist" aria-label="Product thumbnails">
              {images.map((img, idx) => {
                const isSelected = selectedImageIndex === idx;
                return (
                  <button
                    key={idx}
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 bg-[#FAF7F2] ${
                      isSelected
                        ? 'border-[#124328] ring-2 ring-[#124328]/20 shadow-xs'
                        : 'border-[#124328]/15 hover:border-[#124328]/40 opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} view ${idx + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </button>
                );
              })}
            </div>
          )}

          {/* Development Inspector Quick Link */}
          <div className="pt-2 flex items-center justify-between text-xs text-[#132218]/60 bg-[#FAF7F2] p-3 rounded-xl border border-[#124328]/10">
            <span className="flex items-center gap-1.5 font-medium text-[#124328]">
              <ShieldCheck className="w-4 h-4 text-[#E0980B]" />
              <span>Commercial Data Audit</span>
            </span>
            <button
              onClick={() => setIsAuditModalOpen(true)}
              className="text-[#9E6E17] font-bold hover:underline"
            >
              Inspect Missing Specifications ({missingFields.length})
            </button>
          </div>
        </div>

        {/* Right Column: Product Summary & Purchasing Status (6 cols) */}
        <div className="lg:col-span-6 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Category & Availability Badges */}
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-[#FAF7F2] text-[#124328] border border-[#124328]/10">
                {product.categoryLabel}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#E0980B]/15 text-[#9E6E17] border border-[#E0980B]/30">
                {product.availabilityState}
              </span>
            </div>

            {/* Product Title */}
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#124328] tracking-tight">
              {product.name}
            </h1>

            {/* Short Description */}
            <p className="text-sm sm:text-base text-[#132218]/80 leading-relaxed">
              {product.shortDescription}
            </p>

            {/* Commercial Pricing & Pack Size State Card */}
            <div className="p-5 rounded-xl bg-[#FAF7F2] border border-[#124328]/10 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#124328]">
                <Info className="w-4 h-4 text-[#E0980B]" />
                <span>Commercial Specification Notice</span>
              </div>
              <p className="text-xs text-[#132218]/75 leading-relaxed">
                These are the planned launch prices, inclusive of applicable taxes. Ordering will activate after SKU, stock, shipping specifications and statutory store details are verified.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {pricedVariations.map((variation) => (
                  <div key={variation.id} className="flex items-center justify-between gap-3 rounded-lg bg-white border border-[#124328]/10 px-3 py-2.5 text-xs">
                    <span className="text-[#132218]/75">{variation.packSize}</span>
                    <strong className="text-[#124328] whitespace-nowrap">₹{variation.price!.toLocaleString('en-IN')}</strong>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#124328]/5 text-xs">
                <div>
                  <div className="text-[#132218]/60 font-medium">Pack Sizes</div>
                  <div className="font-bold text-[#124328]">Launch Range Published</div>
                </div>
                <div>
                  <div className="text-[#132218]/60 font-medium">Ordering Status</div>
                  <div className="font-bold text-[#9E6E17]">Catalogue Preview</div>
                </div>
              </div>
            </div>

            {/* Purchasing Action Section */}
            <div className="space-y-3 pt-2">
              <div className="p-3.5 rounded-lg bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  Secure guest ordering will open after stock, shipping details, required registrations and payment gateway approval are verified.
                </span>
              </div>

              <div>
                <button
                  type="button"
                  disabled={!purchasable}
                  aria-disabled="true"
                  className="w-full py-3.5 px-6 rounded-xl font-semibold text-xs transition-all cursor-not-allowed bg-[#124328]/20 text-[#124328]/50 text-center"
                >
                  Secure Guest Ordering Opens Soon
                </button>
              </div>
            </div>

            {/* Delivery Availability Checker */}
            <div className="p-4 rounded-xl border border-[#124328]/10 bg-white space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#124328]">
                <MapPin className="w-4 h-4 text-[#E0980B]" />
                <span>Delivery Coverage Checker</span>
              </div>
              <form onSubmit={handlePinCheck} className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 6-digit postal PIN"
                  className="w-full px-3.5 py-2 text-xs rounded-lg border border-[#124328]/20 focus:outline-none focus:border-[#124328] bg-[#FAF7F2]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#124328] text-white text-xs font-semibold hover:bg-[#1A5A35] transition-colors shrink-0"
                >
                  Check PIN
                </button>
              </form>
              {pinStatus && (
                <div className="text-xs text-[#124328] bg-[#FAF7F2] p-2.5 rounded-lg border border-[#124328]/10">
                  {pinStatus}
                </div>
              )}
            </div>
          </div>

          {/* Trust Value Summary Props */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-[#124328]/10 text-xs text-[#132218]/80">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-[#124328] shrink-0" />
              <span>Food-Grade Packaging</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#124328] shrink-0" />
              <span>Secure Transit</span>
            </div>
            <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
              <RotateCcw className="w-4 h-4 text-[#124328] shrink-0" />
              <span>Clear Return Policy</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Information Accordion & Details Tabs */}
      <section className="bg-white rounded-2xl border border-[#124328]/10 shadow-xs overflow-hidden">
        {/* Navigation Tabs Header */}
        <div className="flex border-b border-[#124328]/10 bg-[#FAF7F2] overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('about')}
            className={`px-6 py-4 text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors border-b-2 ${
              activeTab === 'about'
                ? 'border-[#124328] text-[#124328] bg-white'
                : 'border-transparent text-[#132218]/65 hover:text-[#124328]'
            }`}
          >
            About This Product
          </button>
          <button
            onClick={() => setActiveTab('uses')}
            className={`px-6 py-4 text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors border-b-2 ${
              activeTab === 'uses'
                ? 'border-[#124328] text-[#124328] bg-white'
                : 'border-transparent text-[#132218]/65 hover:text-[#124328]'
            }`}
          >
            Suitable Uses ({product.suitableUses.length})
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`px-6 py-4 text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors border-b-2 ${
              activeTab === 'specs'
                ? 'border-[#124328] text-[#124328] bg-white'
                : 'border-transparent text-[#132218]/65 hover:text-[#124328]'
            }`}
          >
            Verified Specifications
          </button>
          <button
            onClick={() => setActiveTab('shipping')}
            className={`px-6 py-4 text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors border-b-2 ${
              activeTab === 'shipping'
                ? 'border-[#124328] text-[#124328] bg-white'
                : 'border-transparent text-[#132218]/65 hover:text-[#124328]'
            }`}
          >
            Shipping & Returns
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 sm:p-8">
          {activeTab === 'about' && (
            <div className="space-y-4 max-w-3xl">
              <h3 className="font-serif text-xl font-bold text-[#124328]">
                Product Overview & Kitchen Character
              </h3>
              <p className="text-sm text-[#132218]/80 leading-relaxed">
                {product.extendedDescription || product.description}
              </p>
              <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#124328]/10 text-xs text-[#132218]/75 space-y-1">
                <div className="font-semibold text-[#124328]">Transparency in Product Description</div>
                <p>
                  Katehranchal Agro Foods presents every staple with honest, unexaggerated information. We do not make unsupported health, medicinal, or laboratory-tested claims.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'uses' && (
            <div className="space-y-4 max-w-2xl">
              <h3 className="font-serif text-xl font-bold text-[#124328]">
                Suitable Domestic & Kitchen Applications
              </h3>
              <p className="text-xs text-[#132218]/70">
                Recommended everyday household culinary applications for {product.name}:
              </p>
              <ul className="space-y-2.5 pt-1">
                {product.suitableUses.map((use, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-[#132218]/85">
                    <CheckCircle2 className="w-4 h-4 text-[#124328] shrink-0 mt-0.5" />
                    <span>{use}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-xl font-bold text-[#124328]">
                  Verified Specifications Matrix
                </h3>
                <span className="text-xs text-[#9E6E17] font-semibold bg-[#E0980B]/10 px-2.5 py-1 rounded-full">
                  Status: Specifications in Verification
                </span>
              </div>

              <div className="border border-[#124328]/10 rounded-xl overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs border-collapse">
                  <tbody className="divide-y divide-[#124328]/5">
                    <tr className="hover:bg-[#FAF7F2]/50">
                      <th className="p-3.5 font-semibold text-[#124328] w-1/3 bg-[#FAF7F2]">Product Name</th>
                      <td className="p-3.5 text-[#132218]/85">{product.name}</td>
                    </tr>
                    <tr className="hover:bg-[#FAF7F2]/50">
                      <th className="p-3.5 font-semibold text-[#124328] bg-[#FAF7F2]">Category</th>
                      <td className="p-3.5 text-[#132218]/85">{product.categoryLabel}</td>
                    </tr>
                    <tr className="hover:bg-[#FAF7F2]/50">
                      <th className="p-3.5 font-semibold text-[#124328] bg-[#FAF7F2]">Commercial Availability</th>
                      <td className="p-3.5 text-[#132218]/85">{product.availabilityState}</td>
                    </tr>
                    <tr className="hover:bg-[#FAF7F2]/50">
                      <th className="p-3.5 font-semibold text-[#124328] bg-[#FAF7F2]">Statutory Pack Sizes</th>
                      <td className="p-3.5 text-[#9E6E17] italic">Awaiting commercial packaging calibration</td>
                    </tr>
                    <tr className="hover:bg-[#FAF7F2]/50">
                      <th className="p-3.5 font-semibold text-[#124328] bg-[#FAF7F2]">MRP & Selling Price</th>
                      <td className="p-3.5 text-[#9E6E17] italic">Awaiting release batch finalization</td>
                    </tr>
                    <tr className="hover:bg-[#FAF7F2]/50">
                      <th className="p-3.5 font-semibold text-[#124328] bg-[#FAF7F2]">FSSAI License</th>
                      <td className="p-3.5 text-[#9E6E17] italic">Statutory registration in verification</td>
                    </tr>
                    <tr className="hover:bg-[#FAF7F2]/50">
                      <th className="p-3.5 font-semibold text-[#124328] bg-[#FAF7F2]">Certified Organic Status</th>
                      <td className="p-3.5 text-[#132218]/85">
                        Not certified organic. We do not claim organic status unless certified.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="space-y-4 max-w-3xl">
              <h3 className="font-serif text-xl font-bold text-[#124328]">
                Packaging, Shipping & Returns Overview
              </h3>
              <div className="space-y-3 text-xs sm:text-sm text-[#132218]/80 leading-relaxed">
                <p>
                  Every Katehranchal Agro Foods parcel is packaged securely using protective transit cushioning to prevent damage during national logistics courier handling.
                </p>
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#124328]/10 space-y-2">
                  <div className="font-bold text-[#124328]">Verified Policy References</div>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>
                      <button onClick={() => onNavigate('policy-shipping')} className="text-[#124328] font-semibold underline">
                        Shipping & Delivery Policy
                      </button>{' '}
                      — Carrier transit schedules and delivery tracking.
                    </li>
                    <li>
                      <button onClick={() => onNavigate('policy-returns')} className="text-[#124328] font-semibold underline">
                        Cancellation & Returns Policy
                      </button>{' '}
                      — Food safety returns and damaged shipment claim protocols.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Related Products Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#124328]">
              More from the Essential Collection
            </h2>
            <p className="text-xs text-[#132218]/70">
              Explore companion staples for your family kitchen.
            </p>
          </div>
          <button
            onClick={() => onNavigate('shop')}
            className="text-xs font-semibold text-[#124328] hover:underline"
          >
            View All Products
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedProducts.map((rel) => (
            <ProductCard
              key={rel.id}
              product={rel}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      </section>

      {/* Image Modal Lightbox */}
      {isZoomOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="relative max-w-4xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl">
            <button
              onClick={() => setIsZoomOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black transition-colors z-10"
              aria-label="Close image preview"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="aspect-square w-full bg-[#FAF7F2]">
              <img
                src={currentImage}
                alt={product.imageAlt}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="p-4 bg-white text-center text-xs text-[#132218]/70 border-t border-[#124328]/10">
              {product.name} — Product imagery is illustrative. Actual packaging may vary.
            </div>
          </div>
        </div>
      )}

      {/* Development Commercial Specifications Audit Modal */}
      <CommercialDataAuditModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
      />
    </div>
  );
};
