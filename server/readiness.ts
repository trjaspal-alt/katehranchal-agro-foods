import { LaunchReadinessItem } from './types';

/**
 * 21-Point Launch Safety Gate Evaluator
 * Enforces strict commercial readiness gating before production live orders are authorized.
 */
export function getLaunchSafetyGateReport(): {
  isLiveAllowed: boolean;
  totalChecks: number;
  readyChecks: number;
  blockerCount: number;
  checklist: LaunchReadinessItem[];
} {
  const checklist: LaunchReadinessItem[] = [
    {
      id: 'gate_1_prices',
      title: 'Real Consumer Selling Prices',
      category: 'Products & Variations',
      status: 'Missing / Incomplete',
      severity: 'CRITICAL_BLOCKER',
      description: 'Official verified retail unit selling prices in INR for catalog items.',
      remedyAction: 'Supply verified selling prices and MRPs for Desi Ghee, Mustard Oils, and Natural Wheat.',
    },
    {
      id: 'gate_2_pack_sizes',
      title: 'Real Pack Sizes & Net Contents',
      category: 'Products & Variations',
      status: 'Missing / Incomplete',
      severity: 'CRITICAL_BLOCKER',
      description: 'Declared statutory packaging volume and net metric weights.',
      remedyAction: 'Confirm calibrated metric pack options (e.g., 500ml, 1000ml, 5kg).',
    },
    {
      id: 'gate_3_skus',
      title: 'Valid Warehouse SKUs',
      category: 'Products & Variations',
      status: 'Missing / Incomplete',
      severity: 'CRITICAL_BLOCKER',
      description: 'Standardized operational stock-keeping unit codes for barcode scanning.',
      remedyAction: 'Assign unique SKU identifiers for all product packaging variations.',
    },
    {
      id: 'gate_4_stock',
      title: 'Physical Inventory Counts',
      category: 'Products & Variations',
      status: 'Missing / Incomplete',
      severity: 'CRITICAL_BLOCKER',
      description: 'Verified stock inventory count stored at primary dispatch warehouse.',
      remedyAction: 'Input authenticated opening batch unit counts.',
    },
    {
      id: 'gate_5_tax_config',
      title: 'GST Tax Rate & HSN Mapping',
      category: 'Taxation & Regulatory',
      status: 'Missing / Incomplete',
      severity: 'CRITICAL_BLOCKER',
      description: 'Official statutory Goods and Services Tax slabs and HSN classification.',
      remedyAction: 'Map 4-to-8 digit HSN codes and applicable GST percentages (e.g., 040590 for Ghee, 151491 for Mustard Oil).',
    },
    {
      id: 'gate_6_business_billing',
      title: 'Business Legal Name & Registered Address',
      category: 'Taxation & Regulatory',
      status: 'Missing / Incomplete',
      severity: 'CRITICAL_BLOCKER',
      description: 'Official corporate registration legal identity and registered office address.',
      remedyAction: 'Provide full registered enterprise entity name and physical registered office address.',
    },
    {
      id: 'gate_7_licenses',
      title: 'FSSAI License & Statutory Registrations',
      category: 'Taxation & Regulatory',
      status: 'Missing / Incomplete',
      severity: 'CRITICAL_BLOCKER',
      description: '14-digit FSSAI Central/State Food License and GSTIN registration certificate.',
      remedyAction: 'Enter validated 14-digit FSSAI license and 15-digit state GSTIN.',
    },
    {
      id: 'gate_8_shipping_rules',
      title: 'Contracted Courier Shipping Rate Matrix',
      category: 'Shipping & Logistics',
      status: 'Missing / Incomplete',
      severity: 'CRITICAL_BLOCKER',
      description: 'Carrier rate contract (flat-rate or weight-slab shipping tables).',
      remedyAction: 'Configure logistics rate agreement with designated Indian courier partners.',
    },
    {
      id: 'gate_9_serviceable_regions',
      title: 'Verified PIN-Code Serviceability Matrix',
      category: 'Shipping & Logistics',
      status: 'Pending Verification',
      severity: 'REQUIRED',
      description: 'List of courier-serviceable Indian postal PIN codes.',
      remedyAction: 'Import courier partner serviceability API or verified postal circle directory.',
    },
    {
      id: 'gate_10_delivery_estimates',
      title: 'Published Transit Timelines',
      category: 'Shipping & Logistics',
      status: 'Missing / Incomplete',
      severity: 'REQUIRED',
      description: 'Committed delivery turnaround timelines by geographical zone.',
      remedyAction: 'Confirm standard regional dispatch and transit schedule SLA.',
    },
    {
      id: 'gate_11_return_policy',
      title: 'Return and Refund Policy',
      category: 'Policies & Legal',
      status: 'Ready',
      severity: 'REQUIRED',
      description: 'Published legal policy detailing return eligibility and claims process.',
      remedyAction: 'Reviewed by legal counsel for final sign-off.',
    },
    {
      id: 'gate_12_cancellation_policy',
      title: 'Order Cancellation Policy',
      category: 'Policies & Legal',
      status: 'Ready',
      severity: 'REQUIRED',
      description: 'Statutory guidelines on pre-dispatch and post-dispatch cancellation rights.',
      remedyAction: 'Reviewed by business owner.',
    },
    {
      id: 'gate_13_privacy_policy',
      title: 'Privacy Policy (DPDP Act Ready)',
      category: 'Policies & Legal',
      status: 'Ready',
      severity: 'REQUIRED',
      description: 'Consumer data protection disclosure meeting India Digital Personal Data Protection standards.',
      remedyAction: 'Completed.',
    },
    {
      id: 'gate_14_terms_conditions',
      title: 'Terms & Conditions',
      category: 'Policies & Legal',
      status: 'Ready',
      severity: 'REQUIRED',
      description: 'Storefront commercial contract governing customer transactions.',
      remedyAction: 'Completed.',
    },
    {
      id: 'gate_15_gateway_selection',
      title: 'Selected Payment Gateway Partner',
      category: 'Payment Gateway',
      status: 'Ready',
      severity: 'REQUIRED',
      description: 'Modular gateway adapter configured (Razorpay/Cashfree/PayU ready).',
      remedyAction: 'Select primary gateway contract.',
    },
    {
      id: 'gate_16_gateway_approval',
      title: 'Live Payment Gateway Merchant Approval',
      category: 'Payment Gateway',
      status: 'Missing / Incomplete',
      severity: 'CRITICAL_BLOCKER',
      description: 'Approved KYC merchant account with bank aggregator for INR payment capture.',
      remedyAction: 'Submit company incorporation, PAN, and bank account for live payment gateway KYC.',
    },
    {
      id: 'gate_17_production_credentials',
      title: 'Secure Production API Secret Keys',
      category: 'Payment Gateway',
      status: 'Missing / Incomplete',
      severity: 'CRITICAL_BLOCKER',
      description: 'Server environment secrets for live key ID and secret HMAC tokens.',
      remedyAction: 'Set production RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in server secrets manager.',
    },
    {
      id: 'gate_18_production_database',
      title: 'Persistent Order Storage & Redundancy',
      category: 'Infrastructure & Security',
      status: 'Ready',
      severity: 'REQUIRED',
      description: 'Server store initialized with encrypted file persistence and audit logs.',
      remedyAction: 'Operational.',
    },
    {
      id: 'gate_19_transactional_email',
      title: 'Transactional Email Service Configuration',
      category: 'Infrastructure & Security',
      status: 'Pending Verification',
      severity: 'REQUIRED',
      description: 'Authenticated SMTP / transactional API provider (e.g., Postmark/SendGrid/SES).',
      remedyAction: 'Configure verified DKIM/SPF domain keys on Katehranchal.org DNS.',
    },
    {
      id: 'gate_20_domain_https',
      title: 'Production Domain & SSL/TLS Configuration',
      category: 'Infrastructure & Security',
      status: 'Ready',
      severity: 'REQUIRED',
      description: '256-Bit TLS certificate and HTTPS redirect active.',
      remedyAction: 'Active under Google Cloud Run HTTPS proxy.',
    },
    {
      id: 'gate_21_e2e_live_test',
      title: 'End-to-End Live Payment Verification Audit',
      category: 'Infrastructure & Security',
      status: 'Pending Verification',
      severity: 'CRITICAL_BLOCKER',
      description: 'Successful zero-loss live payment capture and reconciliation test.',
      remedyAction: 'Execute end-to-end test order once live credentials are added.',
    },
  ];

  const blockers = checklist.filter(
    (c) => c.status !== 'Ready' && c.severity === 'CRITICAL_BLOCKER'
  );
  const readyChecks = checklist.filter((c) => c.status === 'Ready').length;

  return {
    isLiveAllowed: blockers.length === 0,
    totalChecks: checklist.length,
    readyChecks,
    blockerCount: blockers.length,
    checklist,
  };
}
