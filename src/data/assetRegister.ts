/**
 * Internal Asset & Copyright Governance Register
 * Katehranchal Agro Foods
 *
 * Comprehensive tracking of all visual, typographic, and graphic assets.
 * Enforces verified commercial usage basis and strict compliance standards.
 */

export interface AssetRecord {
  id: string;
  filename: string;
  assetType: 'logo' | 'editorial_illustration' | 'product_render' | 'font' | 'icon' | 'placeholder';
  websiteLocation: string[];
  source: string;
  creationDate: string;
  generationPrompt?: string | null;
  toolOrModelUsed: string;
  licenseOrUsageBasis: string;
  proofOfPurchaseOrDocRef: string;
  ownerSuppliedStatus: boolean;
  modificationNotes: string;
  humanReviewer: string;
  approvalStatus: 'approved_for_launch' | 'approved_editorial_only' | 'pending_owner_photo' | 'pending_review' | 'conditional';
  rightsNotes: string;
}

export const ASSET_REGISTER: AssetRecord[] = [
  {
    id: 'asset-001',
    filename: 'katehranchal-agro-foods-logo.svg',
    assetType: 'logo',
    websiteLocation: ['Header Navigation', 'Footer', 'Order Confirmation', 'Transactional Emails', 'Favicon'],
    source: 'Official Brand Asset (Supplied by Katehranchal Group)',
    creationDate: 'Not recorded',
    generationPrompt: null,
    toolOrModelUsed: 'Vector Design Suite / Original Brand Identity',
    licenseOrUsageBasis: 'Proprietary Brand Trademark owned by Katehranchal Agro Foods & Katehranchal Group',
    proofOfPurchaseOrDocRef: 'Owner-supplied official source file retained with the project',
    ownerSuppliedStatus: true,
    modificationNotes: 'Maintained exact SVG path fidelity and official agricultural green (#124328), wheat gold (#E0980B), and river blue (#2A5C74) palette. Reinterpreted strictly in SVG/PNG without third-party modifications.',
    humanReviewer: 'Owner supplied; separate review record not created',
    approvalStatus: 'approved_for_launch',
    rightsNotes: 'Official primary brand logo. Protected proprietary asset.',
  },
  {
    id: 'asset-002',
    filename: 'katehranchal-agro-foods-logo.png',
    assetType: 'logo',
    websiteLocation: ['Email Templates', 'OpenGraph Meta Card', 'Social Share Previews'],
    source: 'Official Brand Asset (Supplied by Katehranchal Group)',
    creationDate: 'Not recorded',
    generationPrompt: null,
    toolOrModelUsed: 'High-Resolution Raster Export (1024x1024)',
    licenseOrUsageBasis: 'Proprietary Brand Trademark owned by Katehranchal Agro Foods',
    proofOfPurchaseOrDocRef: 'Owner-supplied official source file retained with the project',
    ownerSuppliedStatus: true,
    modificationNotes: 'High-density transparent PNG export for OpenGraph and email client fallback.',
    humanReviewer: 'Owner supplied; separate review record not created',
    approvalStatus: 'approved_for_launch',
    rightsNotes: 'Official primary brand raster logo.',
  },
  {
    id: 'asset-003',
    filename: 'landscape-fields-sunrise.svg',
    assetType: 'editorial_illustration',
    websiteLocation: ['Homepage Transition', 'Our Story Page', 'Brand Narrative Accent'],
    source: 'Original Editorial Artwork Created for Katehranchal Agro Foods',
    creationDate: '2026-09-18',
    generationPrompt:
      'Premium contemporary Indian agricultural editorial illustration. Serene rural landscape with gentle geometric cultivated fields, early morning sunrise casting warm glow over tranquil village horizon, delicate wheat stalks and yellow mustard blossoms along a quiet village pathway. Minimal hand-drawn charcoal linework, warm ivory paper texture background, earthy palette of deep agricultural green, muted olive, wheat gold, mustard yellow, and soft clay brown. Generous negative space, refined minimalist composition.',
    toolOrModelUsed: 'Handcrafted Vector Editorial Architecture (Strict Brand Color Palette)',
    licenseOrUsageBasis: 'Original Work Made for Hire / Proprietary to Katehranchal Agro Foods',
    proofOfPurchaseOrDocRef: 'No external licence document; original project vector pending human similarity review',
    ownerSuppliedStatus: false,
    modificationNotes: 'Original editorial composition designed strictly to brand guidelines with zero copied elements, no third-party IP, and no misleading claims.',
    humanReviewer: 'Pending human review',
    approvalStatus: 'pending_review',
    rightsNotes: 'Editorial decorative artwork only. Not presented as documentary photograph of the physical facility.',
  },
  {
    id: 'asset-004',
    filename: 'farm-to-home-journey.svg',
    assetType: 'editorial_illustration',
    websiteLocation: ['Brand Story Flow', 'Packaging & Heritage Section', 'Story Timeline'],
    source: 'Original Editorial Artwork Created for Katehranchal Agro Foods',
    creationDate: '2026-09-18',
    generationPrompt:
      'Contemporary editorial composition showing the journey from fertile soil layers and village harvest fields toward a modern warm kitchen table, linked by delicate rhythmic agricultural contours and traditional brass vessel.',
    toolOrModelUsed: 'Vector Editorial Engine (Brand Palette)',
    licenseOrUsageBasis: 'Original Work Made for Hire / Proprietary to Katehranchal Agro Foods',
    proofOfPurchaseOrDocRef: 'No external licence document; original project vector pending human similarity review',
    ownerSuppliedStatus: false,
    modificationNotes: 'Visual metaphor connecting rural Padariya Dalelpur with urban contemporary kitchens.',
    humanReviewer: 'Pending human review',
    approvalStatus: 'pending_review',
    rightsNotes: 'Editorial metaphor. Cannot be misconstrued as physical packaging.',
  },
  {
    id: 'asset-005',
    filename: 'hands-cradling-harvest.svg',
    assetType: 'editorial_illustration',
    websiteLocation: ['Quality Sourcing Section', 'Why Choose Us Page', 'Newsletter Card'],
    source: 'Original Editorial Artwork Created for Katehranchal Agro Foods',
    creationDate: '2026-09-18',
    generationPrompt:
      'Minimalist contemporary editorial illustration of gentle hands cradling golden wheat grains and natural mustard seeds, symbolizing respectful harvest and traditional agrarian care. Hand-drawn charcoal linework, subtle geometric curves, warm ivory background texture, deep agricultural green accents.',
    toolOrModelUsed: 'Vector Linework Engine',
    licenseOrUsageBasis: 'Original Work Made for Hire / Proprietary to Katehranchal Agro Foods',
    proofOfPurchaseOrDocRef: 'No external licence document; original project vector pending human similarity review',
    ownerSuppliedStatus: false,
    modificationNotes: 'Respectful harvest gesture emphasizing agrarian care.',
    humanReviewer: 'Pending human review',
    approvalStatus: 'pending_review',
    rightsNotes: 'Editorial artwork.',
  },
  {
    id: 'asset-006',
    filename: 'empty-cart-earthen-urn.svg',
    assetType: 'editorial_illustration',
    websiteLocation: ['Cart Drawer (Empty State)', 'Catalogue Filter (Zero Results State)'],
    source: 'Original Editorial Artwork Created for Katehranchal Agro Foods',
    creationDate: '2026-09-18',
    generationPrompt:
      'Minimalist elegant editorial illustration of a single traditional earthen vessel with graceful wheat stalk resting beside it on warm textured ivory paper. Delicate charcoal linework, restrained muted olive, warm wheat gold, natural clay tones.',
    toolOrModelUsed: 'Vector Linework Engine',
    licenseOrUsageBasis: 'Original Work Made for Hire / Proprietary to Katehranchal Agro Foods',
    proofOfPurchaseOrDocRef: 'No external licence document; original project vector pending human similarity review',
    ownerSuppliedStatus: false,
    modificationNotes: 'Calm, non-pushy empty state artwork.',
    humanReviewer: 'Pending human review',
    approvalStatus: 'pending_review',
    rightsNotes: 'Quiet empty state indicator.',
  },
  {
    id: 'asset-007',
    filename: 'pathway-horizon-404.svg',
    assetType: 'editorial_illustration',
    websiteLocation: ['404 Not Found Page'],
    source: 'Original Editorial Artwork Created for Katehranchal Agro Foods',
    creationDate: '2026-09-18',
    generationPrompt:
      'Tranquil country path winding gracefully through open fields towards the sunrise horizon, evoking quiet navigation and returning to the main path.',
    toolOrModelUsed: 'Vector Linework Engine',
    licenseOrUsageBasis: 'Original Work Made for Hire / Proprietary to Katehranchal Agro Foods',
    proofOfPurchaseOrDocRef: 'No external licence document; original project vector pending human similarity review',
    ownerSuppliedStatus: false,
    modificationNotes: 'Gentle navigational fallback illustration for 404 page.',
    humanReviewer: 'Pending human review',
    approvalStatus: 'pending_review',
    rightsNotes: '404 route illustration.',
  },
  {
    id: 'asset-008',
    filename: 'Fraunces Font Family (Fraunces-VariableFont_opsz,wght.ttf)',
    assetType: 'font',
    websiteLocation: ['Global Typography - Headings (H1-H4)', 'Brand Display Elements'],
    source: 'Google Fonts / Undercase Type',
    creationDate: '2020-10-01',
    toolOrModelUsed: 'Open Source Variable Typeface',
    licenseOrUsageBasis: 'SIL Open Font License, 1.1 (OFL-1.1)',
    proofOfPurchaseOrDocRef: 'https://fonts.google.com/specimen/Fraunces',
    ownerSuppliedStatus: false,
    modificationNotes: 'Locally served in /public/assets/fonts/ for privacy and performance without external Google Fonts CDN ping.',
    humanReviewer: 'Licence source recorded; owner review pending',
    approvalStatus: 'approved_for_launch',
    rightsNotes: 'Permits free commercial bundling and web embedding under OFL-1.1.',
  },
  {
    id: 'asset-009',
    filename: 'Manrope Font Family (Manrope-VariableFont_wght.ttf)',
    assetType: 'font',
    websiteLocation: ['Global Typography - Body Copy', 'UI Buttons', 'Form Controls', 'Navigation'],
    source: 'Google Fonts / Mikhail Sharanda',
    creationDate: '2019-06-01',
    toolOrModelUsed: 'Open Source Variable Typeface',
    licenseOrUsageBasis: 'SIL Open Font License, 1.1 (OFL-1.1)',
    proofOfPurchaseOrDocRef: 'https://fonts.google.com/specimen/Manrope',
    ownerSuppliedStatus: false,
    modificationNotes: 'Locally served in /public/assets/fonts/ with font-display: swap.',
    humanReviewer: 'Licence source recorded; owner review pending',
    approvalStatus: 'approved_for_launch',
    rightsNotes: 'Permits free commercial bundling and web embedding under OFL-1.1.',
  },
  {
    id: 'asset-010',
    filename: 'Lucide React Icon Suite',
    assetType: 'icon',
    websiteLocation: ['Throughout UI (Search, Cart, Chevron, Shields, Truck, Info, Phone, Mail)'],
    source: 'Lucide Project (lucide-react npm package)',
    creationDate: '2024-01-01',
    toolOrModelUsed: 'Open Source Feather Icon Evolution',
    licenseOrUsageBasis: 'ISC License (Open Source Commercial Permission)',
    proofOfPurchaseOrDocRef: 'https://github.com/lucide-icons/lucide/blob/main/LICENSE',
    ownerSuppliedStatus: false,
    modificationNotes: 'Rendered as inline React SVG nodes with customized strokeWidth and brand colors.',
    humanReviewer: 'Licence source recorded; owner review pending',
    approvalStatus: 'approved_for_launch',
    rightsNotes: 'Permits free commercial and open distribution.',
  },
  {
    id: 'asset-011',
    filename: 'Products: Desi Ghee, Mustard Oils, Natural Wheat (Renders / Placeholders)',
    assetType: 'product_render',
    websiteLocation: ['Product Listing Cards', 'Product Detail Gallery', 'Pack Size Selection'],
    source: 'Editorial Conceptual Product Visualizations',
    creationDate: '2026-09-18',
    generationPrompt: null,
    toolOrModelUsed: 'Vector Product Visualization Template',
    licenseOrUsageBasis: 'Internal Visual Mockups for Prototype Catalogue',
    proofOfPurchaseOrDocRef: 'Internal prototype asset; replacement with owner photographs required',
    ownerSuppliedStatus: false,
    modificationNotes:
      'CRITICAL COMPLIANCE SAFEGUARD: Clearly labeled as conceptual mockups until authentic studio photographs of physical packaging and bottled products are supplied by the owner. Under no circumstances are AI-generated images to be represented as actual certified products.',
    humanReviewer: 'Owner verification pending',
    approvalStatus: 'pending_owner_photo',
    rightsNotes:
      'FLAGGED FOR PHYSICAL REPLACEMENT: Must be replaced with verified high-resolution studio photographs of manufactured containers before commercial e-commerce launch is enabled.',
  },
];


