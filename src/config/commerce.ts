/**
 * Central E-Commerce Safety Configuration
 * Katehranchal Agro Foods
 *
 * CRITICAL SAFETY LOCK:
 * COMMERCE_LIVE is centrally locked to false until all mandatory regulatory,
 * taxation, shipping, and food licensing prerequisites are verified.
 */

export const COMMERCE_LIVE = false;

export const COMMERCE_CONFIG = {
  isLive: COMMERCE_LIVE,
  statusMessage: 'Online purchasing will be available soon.',
  catalogueModeNotice:
    'Our products are presented as an informational catalogue. Live online ordering will be enabled once regulatory, shipping, and laboratory verifications are officially finalized.',
  allowedActions: {
    browseCatalogue: true,
    viewProductDetails: true,
    contactCustomerCare: true,
    inquireViaWhatsApp: true,
    receiveLaunchUpdates: true,
    liveAddToCart: COMMERCE_LIVE,
    liveBuyNow: COMMERCE_LIVE,
    liveCheckout: COMMERCE_LIVE,
    cashOnDelivery: COMMERCE_LIVE,
    livePaymentCollection: COMMERCE_LIVE,
  },
  supportContacts: {
    email: 'agro@Katehranchal.org',
    phone: '+91 94500 39346',
    whatsAppNumber: '919450039346',
  },
};
