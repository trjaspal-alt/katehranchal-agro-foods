import React, { useState } from 'react';
import { X, AlertCircle, CheckCircle2, ShieldAlert, FileText, ChevronDown, ChevronRight } from 'lucide-react';
import { CATALOG_PRODUCTS, COMING_SOON_ITEMS, REQUIRED_COMMERCIAL_SPECIFICATIONS, getMissingCommercialFields } from '../data/products';

interface CommercialDataAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommercialDataAuditModal: React.FC<CommercialDataAuditModalProps> = ({ isOpen, onClose }) => {
  const [selectedProductSlug, setSelectedProductSlug] = useState<string>(CATALOG_PRODUCTS[0].slug);

  if (!isOpen) return null;

  const selectedProduct = CATALOG_PRODUCTS.find((p) => p.slug === selectedProductSlug) || CATALOG_PRODUCTS[0];
  const missingForProduct = getMissingCommercialFields(selectedProduct);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#124328]/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-[#124328]/15 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#124328]/10 bg-[#FAF7F2] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 text-[#E0980B]" />
            <div>
              <h2 className="font-serif font-bold text-base text-[#124328]">
                Commercial & Regulatory Specification Audit
              </h2>
              <p className="text-xs text-[#132218]/70">
                Step 4 Development Data Inspector: Verified Tracking of Unsupplied Commercial Information
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#132218]/60 hover:text-[#124328] hover:bg-[#124328]/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Safeguard Notice */}
          <div className="p-4 rounded-xl bg-[#F5EFEB] border border-[#E0980B]/40 text-xs text-[#132218]/85 space-y-1.5">
            <div className="font-semibold text-[#124328] flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-[#E0980B]" />
              <span>Cart Eligibility Safeguard Policy</span>
            </div>
            <p>
              No fake prices, ₹0 values, or artificial SKUs are published to customers. Secure guest ordering remains locked until the required commercial specifications and payment gateway are officially approved.
            </p>
          </div>

          {/* Product Tabs */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#124328]/70 mb-2">
              Select Catalogue Product to Audit:
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CATALOG_PRODUCTS.map((prod) => (
                <button
                  key={prod.slug}
                  onClick={() => setSelectedProductSlug(prod.slug)}
                  className={`px-3 py-2 text-xs font-medium rounded-lg border text-center transition-all ${
                    selectedProductSlug === prod.slug
                      ? 'bg-[#124328] text-white border-[#124328] shadow-xs'
                      : 'bg-white text-[#132218]/80 border-[#124328]/15 hover:bg-[#FAF7F2]'
                  }`}
                >
                  {prod.name}
                </button>
              ))}
            </div>
          </div>

          {/* Missing Specifications Table for Selected Product */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-sm text-[#124328]">
                Required Fields for {selectedProduct.name} ({missingForProduct.length} of {REQUIRED_COMMERCIAL_SPECIFICATIONS.length} unsupplied)
              </h3>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-semibold border border-amber-300">
                Purchasing Disabled
              </span>
            </div>

            <div className="border border-[#124328]/10 rounded-xl overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-[#FAF7F2] text-[#124328] border-b border-[#124328]/10">
                  <tr>
                    <th className="p-3 font-semibold">Specification Field</th>
                    <th className="p-3 font-semibold">Category</th>
                    <th className="p-3 font-semibold">Current State</th>
                    <th className="p-3 font-semibold">Regulatory / Business Purpose</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#124328]/5">
                  {missingForProduct.map((field) => (
                    <tr key={field.key} className="hover:bg-[#FAF7F2]/50">
                      <td className="p-3 font-semibold text-[#124328]">{field.label}</td>
                      <td className="p-3 text-[#132218]/70">{field.category}</td>
                      <td className="p-3">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          {field.status}
                        </span>
                      </td>
                      <td className="p-3 text-[#132218]/75 leading-relaxed">{field.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Coming Soon Scope Summary */}
          <div className="p-4 rounded-xl bg-white border border-[#124328]/10 space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-[#124328]">
              Coming Soon Items Safeguard ({COMING_SOON_ITEMS.length} Planned Products)
            </div>
            <p className="text-xs text-[#132218]/70 leading-relaxed">
              All 6 upcoming products (Natural Wheat Flour, Cow Dung Cakes, Traditional Wood Ash, Natural Soil, Dry Neem Wood, Dry Mango Wood) are displayed for information only, without notification collection or purchase actions.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-[#FAF7F2] border-t border-[#124328]/10 flex items-center justify-between text-xs text-[#132218]/70">
          <span>Katehranchal Agro Foods • Internal Commercial Data Audit Engine</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#124328] text-white font-semibold hover:bg-[#1A5A35] transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
