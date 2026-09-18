/**
 * Official Business Information & Regulatory Configuration
 * Katehranchal Agro Foods
 *
 * All business details strictly verified per Step 6 guidelines.
 * Centralized configuration for business, legal, logistics, and regulatory metadata.
 */

export interface BusinessAddress {
  line1: string;
  line2: string;
  postOffice: string;
  district: string;
  state: string;
  pinCode: string;
  country: string;
  formatted: string;
  fullSingleLine: string;
}

export interface RegulatoryConfig {
  gstin: string | null;
  fssaiLicenseNumber: string | null;
  fssaiLicenseHolderName: string | null;
  udyamRegistrationNumber: string | null;
  trademarkStatus: string | null;
  cinOrLlpin: string | null; // Null because business is a Proprietorship
  panNumber: string | null;
  hsnCodes: Record<string, string>;
}

export interface GrievanceConfig {
  designatedGrievanceOfficer: string | null; // Kept null until statutory appointment is officially confirmed
  authorisedRepresentative: string;
  grievanceEmail: string;
  grievancePhone: string;
  customerSupportHours: string;
  acknowledgementTimeframe: string;
  resolutionTimeframe: string;
}

export interface ShippingLogisticsConfig {
  intendedDeliveryCoverage: string;
  dispatchLocationAddress: string;
  courierIntegrationStatus: 'pending_configuration' | 'testing' | 'active';
  activeCarrierPartner: string | null;
  shippingChargeFormula: string | null;
  freeShippingThreshold: number | null;
  standardDispatchTimeEstimate: string | null;
  deliveryTransitEstimate: string | null;
}

export const BUSINESS_INFO = {
  brandName: 'Katehranchal Agro Foods',
  tagline: 'Traditional Village Products for Modern Homes',
  parentGroupLine: 'Part of Katehranchal Group',
  businessType: 'Proprietorship',
  owner: 'Mr. J. S. Nanda',
  authorisedPerson: 'Mr. A. S. Shankdhar',
  officialWebsite: 'https://Katehranchal.org',
  canonicalDomain: 'https://Katehranchal.org',
  officialEmail: 'agro@Katehranchal.org',
  customerSupportPhone: '+91 94500 39346',
  supportWhatsAppDisplay: '+91 94500 39346',
  supportWhatsAppNumber: '919450039346',
  whatsAppDirectLink: 'https://wa.me/919450039346?text=Hello%20Katehranchal%20Agro%20Foods%2C%20I%20have%20an%20inquiry%20regarding%20your%20products.',
  socialMedia: {
    instagram: null as string | null,
    facebook: null as string | null,
    youtube: null as string | null,
  },
  targetAudience: 'Premium and upper-middle-class Indian families who value traditional foods, refined presentation, trustworthy product information, convenient online shopping and reliable customer service.',

  // Registered Address (also acts as Return and Dispatch address)
  registeredAddress: {
    line1: 'Plot No. 143',
    line2: 'Village Padariya Dalelpur',
    postOffice: 'Post Banda',
    district: 'District Shahjahanpur',
    state: 'Uttar Pradesh',
    pinCode: '242042',
    country: 'India',
    formatted: 'Plot No. 143, Village Padariya Dalelpur, Post Banda, District Shahjahanpur, Uttar Pradesh 242042, India',
    fullSingleLine: 'Plot No. 143, Village Padariya Dalelpur, Post Banda, District Shahjahanpur, Uttar Pradesh 242042, India',
  } as BusinessAddress,

  // Logistics & Delivery Intention
  shippingLogistics: {
    intendedDeliveryCoverage: 'Across India, subject to PIN-code serviceability and confirmed shipping configuration.',
    dispatchLocationAddress: 'Plot No. 143, Village Padariya Dalelpur, Post Banda, District Shahjahanpur, Uttar Pradesh 242042, India',
    courierIntegrationStatus: 'pending_configuration',
    activeCarrierPartner: null, // Carrier partner not yet confirmed
    shippingChargeFormula: null, // Charges not yet configured
    freeShippingThreshold: null, // Free shipping threshold not yet approved
    standardDispatchTimeEstimate: null, // Dispatch timelines not yet approved
    deliveryTransitEstimate: null, // Delivery timelines not yet approved
  } as ShippingLogisticsConfig,

  // Pending Regulatory Information (Strictly un-invented; zero fake claims)
  regulatory: {
    gstin: null,
    fssaiLicenseNumber: null,
    fssaiLicenseHolderName: null,
    udyamRegistrationNumber: null,
    trademarkStatus: null,
    cinOrLlpin: null, // Proprietorship does not have CIN/LLPIN
    panNumber: null,
    hsnCodes: {
      desiGhee: '0405',
      mustardOil: '1514',
      wheatGrain: '1001',
    },
  } as RegulatoryConfig,

  // Contact and Grievance Configuration
  grievance: {
    designatedGrievanceOfficer: null, // Explicitly not designated as statutory officer until confirmed
    authorisedRepresentative: 'Mr. A. S. Shankdhar',
    grievanceEmail: 'agro@Katehranchal.org',
    grievancePhone: '+91 94500 39346',
    customerSupportHours: 'Support hours will be published before launch.',
    acknowledgementTimeframe: 'To be confirmed before launch',
    resolutionTimeframe: 'To be confirmed before launch',
  } as GrievanceConfig,

  colors: {
    primaryForestGreen: '#124328',
    secondaryLeafGreen: '#1C602A',
    accentWheatGold: '#E0980B',
    surfaceWarmIvory: '#FBF9F4',
    surfaceCreamSoft: '#F5EFEB',
    textDarkCharcoalGreen: '#132218',
    restrainedRiverBlue: '#2A5C74',
    cleanWhite: '#FFFFFF',
    soilBrown: '#5C4033',
    mutedOlive: '#6B705C',
  },
};
