export interface BusinessLegalTaxProfile {
  isConfigured: boolean;
  businessLegalName: string | null;
  registeredAddress: string | null;
  stateCode: string; // e.g. '09' for Uttar Pradesh
  gstin: string | null;
  fssaiLicenseNumber: string | null;
  invoicePrefix: string;
  panNumber: string | null;
}

export const CENTRAL_TAX_CONFIG: BusinessLegalTaxProfile = {
  // Flagged incomplete until official registration documents are provided
  isConfigured: false,
  businessLegalName: null, // e.g., 'Katehranchal Agro Foods Private Limited'
  registeredAddress: null,
  stateCode: '09', // Default home state circle (Uttar Pradesh)
  gstin: null, // Stored as null - DO NOT INVENT FAKE GSTIN
  fssaiLicenseNumber: null, // Stored as null - DO NOT INVENT FAKE FSSAI
  invoicePrefix: 'KAF/2026-27/',
  panNumber: null,
};

export interface TaxCalculationResult {
  taxableSubtotal: number;
  isConfigured: boolean;
  cgst: number;
  sgst: number;
  igst: number;
  totalTax: number;
  appliedRates: {
    sku: string;
    rate: number | null;
    hsnCode: string | null;
  }[];
  statutoryNotice: string;
}

/**
 * Calculates Indian GST based on customer shipping state vs store registered origin state.
 * If customer is in origin state -> Intra-state CGST + SGST (split equally).
 * If customer is outside origin state -> Inter-state IGST.
 * If tax rate is null on variation, does not invent artificial rate.
 */
export function calculateOrderTaxes(params: {
  subtotal: number;
  shippingState: string;
  items: { sku: string; price: number; quantity: number; taxRate: number | null; hsnCode: string | null }[];
}): TaxCalculationResult {
  const { subtotal, shippingState, items } = params;

  if (!CENTRAL_TAX_CONFIG.isConfigured) {
    return {
      taxableSubtotal: subtotal,
      isConfigured: false,
      cgst: 0,
      sgst: 0,
      igst: 0,
      totalTax: 0,
      appliedRates: items.map((i) => ({ sku: i.sku, rate: i.taxRate, hsnCode: i.hsnCode })),
      statutoryNotice:
        'Statutory GSTIN and HSN tax schedules are pending legal registration verification. Final GST invoices will be generated following official credential filing.',
    };
  }

  const isIntraState = shippingState.toLowerCase().includes('uttar pradesh') || shippingState.toLowerCase() === 'up';
  let totalTax = 0;

  items.forEach((item) => {
    if (typeof item.taxRate === 'number') {
      const itemTax = (item.price * item.quantity * item.taxRate) / 100;
      totalTax += itemTax;
    }
  });

  const roundedTax = Math.round(totalTax * 100) / 100;

  if (isIntraState) {
    const half = Math.round((roundedTax / 2) * 100) / 100;
    return {
      taxableSubtotal: subtotal,
      isConfigured: true,
      cgst: half,
      sgst: half,
      igst: 0,
      totalTax: roundedTax,
      appliedRates: items.map((i) => ({ sku: i.sku, rate: i.taxRate, hsnCode: i.hsnCode })),
      statutoryNotice: 'Applicable CGST & SGST calculated for intra-state supply.',
    };
  }

  return {
    taxableSubtotal: subtotal,
    isConfigured: true,
    cgst: 0,
    sgst: 0,
    igst: roundedTax,
    totalTax: roundedTax,
    appliedRates: items.map((i) => ({ sku: i.sku, rate: i.taxRate, hsnCode: i.hsnCode })),
    statutoryNotice: 'Applicable IGST calculated for inter-state supply.',
  };
}
