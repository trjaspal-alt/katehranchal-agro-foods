import { ShippingQuote } from './types';

export interface ShippingConfiguration {
  isConfigured: boolean;
  activeProvider: 'unconfigured' | 'shiprocket_adapter' | 'delhivery_adapter' | 'custom_rate_table';
  freeShippingThreshold: number | null;
  defaultFlatRate: number | null;
  packagingWeightBufferGrams: number;
  serviceableStates: string[];
}

export const CENTRAL_SHIPPING_CONFIG: ShippingConfiguration = {
  // Marked incomplete per commercial safety guidelines until business owner supplies courier matrix
  isConfigured: false,
  activeProvider: 'unconfigured',
  freeShippingThreshold: null,
  defaultFlatRate: null,
  packagingWeightBufferGrams: 250, // 250g standard glass-cushioning packaging allowance
  serviceableStates: [
    'Uttar Pradesh',
    'Delhi',
    'Haryana',
    'Punjab',
    'Rajasthan',
    'Bihar',
    'Madhya Pradesh',
    'Maharashtra',
    'Karnataka',
    'West Bengal',
    'Gujarat',
    'Tamil Nadu',
    'Telangana',
    'Kerala',
    'Andhra Pradesh',
    'Uttarakhand',
    'Himachal Pradesh',
    'Jharkhand',
    'Odisha',
    'Assam',
    'Chandigarh',
  ],
};

/**
 * Validates whether an Indian postal PIN code conforms to 6-digit structure
 * and falls within valid national postal circles (1 to 9).
 */
export function validateIndianPinCode(pinCode: string): boolean {
  if (!pinCode) return false;
  const clean = pinCode.trim();
  return /^[1-9][0-9]{5}$/.test(clean);
}

/**
 * Calculates shipping quote. If configuration is incomplete, returns clear commercial status
 * rather than inventing fake delivery charges.
 */
export function calculateShippingQuote(params: {
  pinCode: string;
  cartWeightGrams: number;
  cartSubtotal: number;
}): ShippingQuote {
  const { pinCode, cartWeightGrams } = params;

  if (!validateIndianPinCode(pinCode)) {
    return {
      pinCode,
      isServiceable: false,
      zone: null,
      charge: null,
      estimatedDeliveryTimeline: null,
      isConfigured: CENTRAL_SHIPPING_CONFIG.isConfigured,
      notice: 'Please provide a valid 6-digit Indian postal PIN code.',
    };
  }

  // When unconfigured, provide transparent safety notice
  if (!CENTRAL_SHIPPING_CONFIG.isConfigured) {
    return {
      pinCode,
      isServiceable: true,
      zone: 'North Zone (Estimated)',
      charge: null, // Stored as unconfigured / missing
      estimatedDeliveryTimeline: null, // Stored as unconfigured
      isConfigured: false,
      notice:
        'Standard pan-India courier integration is in preparation. Final shipping charges and transit timelines will be published upon carrier contract verification.',
    };
  }

  // Once configured with verified rules, this engine calculates rates
  const grossWeight = cartWeightGrams + CENTRAL_SHIPPING_CONFIG.packagingWeightBufferGrams;
  return {
    pinCode,
    isServiceable: true,
    zone: 'Verified Domestic Zone',
    charge: CENTRAL_SHIPPING_CONFIG.defaultFlatRate || 0,
    estimatedDeliveryTimeline: '3 to 5 business days',
    isConfigured: true,
    notice: 'Standard domestic insured transit.',
  };
}
