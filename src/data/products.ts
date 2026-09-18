import { Product, ComingSoonItem, MissingCommercialField, ProductVariation } from '../types';

/**
 * Centrally defined missing commercial fields inventory.
 * Used for development tracking and transparent administrative audit.
 */
export const REQUIRED_COMMERCIAL_SPECIFICATIONS: {
  key: string;
  label: string;
  category: MissingCommercialField['category'];
  description: string;
}[] = [
  {
    key: 'selling_price',
    label: 'Selling Price',
    category: 'Pricing & Pack Sizes',
    description: 'Final consumer unit price in Indian Rupees (₹).',
  },
  {
    key: 'mrp',
    label: 'Maximum Retail Price (MRP)',
    category: 'Pricing & Pack Sizes',
    description: 'Mandatory declared statutory retail ceiling under Legal Metrology.',
  },
  {
    key: 'pack_sizes',
    label: 'Pack Sizes & Net Content',
    category: 'Pricing & Pack Sizes',
    description: 'Standard calibrated metric packaging units (e.g., 500 ml, 1000 ml, 5 kg).',
  },
  {
    key: 'sku_number',
    label: 'Stock Keeping Unit (SKU)',
    category: 'Inventory & SKU',
    description: 'Internal tracking identifier for warehouse and dispatch operations.',
  },
  {
    key: 'inventory_quantity',
    label: 'Inventory Quantity',
    category: 'Inventory & SKU',
    description: 'Verified physical units available in stock at fulfillment centre.',
  },
  {
    key: 'tax_rate_hsn',
    label: 'GST Rate & HSN Code',
    category: 'Taxation & Regulatory',
    description: 'Applicable Goods & Services Tax slab and Harmonized System of Nomenclature code.',
  },
  {
    key: 'product_weights_dimensions',
    label: 'Product Weights & Dimensions',
    category: 'Packaging & Shipping',
    description: 'Gross shipping weight and volumetric parcel measurements for carrier calculation.',
  },
  {
    key: 'shipping_weight',
    label: 'Dead / Volumetric Weight',
    category: 'Packaging & Shipping',
    description: 'Carrier-calibrated weight including protective transit cushioning.',
  },
  {
    key: 'processing_methods',
    label: 'Certified Processing Method',
    category: 'Testing & Origin',
    description: 'Verified and auditable manufacturing workflow documentation.',
  },
  {
    key: 'ingredients_composition',
    label: 'Declared Ingredients & Composition',
    category: 'Testing & Origin',
    description: 'Mandatory statutory food ingredients list and nutritional analysis table.',
  },
  {
    key: 'shelf_life_storage',
    label: 'Shelf Life & Storage Instructions',
    category: 'Testing & Origin',
    description: 'Validated expiry timeframe and temperature/ambient storage requirements.',
  },
  {
    key: 'manufacturer_packer_info',
    label: 'Manufacturer & Packer Information',
    category: 'Taxation & Regulatory',
    description: 'Statutory legal identity, physical manufacturing unit address, and contact.',
  },
  {
    key: 'fssai_license_number',
    label: 'FSSAI License Number',
    category: 'Taxation & Regulatory',
    description: '14-digit Food Safety and Standards Authority of India registration or license.',
  },
  {
    key: 'certifications_lab_reports',
    label: 'Certifications & Laboratory Reports',
    category: 'Testing & Origin',
    description: 'Accredited laboratory quality testing and compliance documentation.',
  },
  {
    key: 'place_of_origin',
    label: 'Place & Country of Origin',
    category: 'Testing & Origin',
    description: 'Geographical origin and processing facility location.',
  },
  {
    key: 'delivery_areas_timelines',
    label: 'Delivery Areas & Courier Transit Timelines',
    category: 'Packaging & Shipping',
    description: 'Verified service PIN codes and expected delivery transit schedules.',
  },
  {
    key: 'return_eligibility',
    label: 'Return & Replacement Eligibility',
    category: 'Packaging & Shipping',
    description: 'Product-specific return window and damaged transit claim protocols.',
  },
];

/**
 * Evaluates whether a product or product variation has all mandatory commercial specifications
 * confirmed before it is permitted to be purchased through the shopping cart.
 */
export function isProductPurchasable(product: Product, variation?: ProductVariation): boolean {
  if (product.productStatus !== 'available') {
    return false;
  }

  const targetVariation = variation || (product.variations && product.variations[0]);
  if (!targetVariation) {
    return false;
  }

  // A product becomes purchasable strictly when ALL commercial prerequisites are confirmed
  const hasValidId = Boolean(product.id && product.id.trim().length > 0);
  const hasValidSku = Boolean(targetVariation.sku && targetVariation.sku.trim().length > 0);
  const hasConfirmedPrice = typeof targetVariation.price === 'number' && targetVariation.price > 0;
  const hasConfirmedPackSize = Boolean(targetVariation.packSize && targetVariation.packSize.trim().length > 0);
  const hasConfirmedStock = targetVariation.stockState === 'in-stock';
  const hasConfirmedTax = typeof targetVariation.taxRate === 'number' && targetVariation.hsnCode !== null;
  const hasConfirmedShipping = typeof targetVariation.shippingWeight === 'number' && targetVariation.shippingWeight > 0;

  return (
    hasValidId &&
    hasValidSku &&
    hasConfirmedPrice &&
    hasConfirmedPackSize &&
    hasConfirmedStock &&
    hasConfirmedTax &&
    hasConfirmedShipping
  );
}

/**
 * Returns a list of all missing commercial fields for a given product.
 */
export function getMissingCommercialFields(product: Product): MissingCommercialField[] {
  const missing: MissingCommercialField[] = [];
  const primaryVariation = product.variations[0];

  REQUIRED_COMMERCIAL_SPECIFICATIONS.forEach((spec) => {
    let isSupplied = false;

    switch (spec.key) {
      case 'selling_price':
        isSupplied = primaryVariation?.price !== null && typeof primaryVariation?.price === 'number';
        break;
      case 'mrp':
        isSupplied = primaryVariation?.mrp !== null && typeof primaryVariation?.mrp === 'number';
        break;
      case 'pack_sizes':
        isSupplied = primaryVariation?.packSize !== null && primaryVariation?.packSize !== undefined;
        break;
      case 'sku_number':
        isSupplied = primaryVariation?.sku !== null && primaryVariation?.sku !== undefined;
        break;
      case 'inventory_quantity':
        isSupplied = primaryVariation?.inventoryQuantity !== null;
        break;
      case 'tax_rate_hsn':
        isSupplied = primaryVariation?.taxRate !== null && primaryVariation?.hsnCode !== null;
        break;
      case 'product_weights_dimensions':
        isSupplied = primaryVariation?.packagingDimensions !== null;
        break;
      case 'shipping_weight':
        isSupplied = primaryVariation?.shippingWeight !== null;
        break;
      case 'processing_methods':
        isSupplied = product.processingMethod !== null;
        break;
      case 'ingredients_composition':
        isSupplied = product.ingredients !== null;
        break;
      case 'shelf_life_storage':
        isSupplied = product.shelfLife !== null && product.storageInstructions !== null;
        break;
      case 'manufacturer_packer_info':
        isSupplied = product.manufacturerInfo !== null && product.packerInfo !== null;
        break;
      case 'fssai_license_number':
        isSupplied = product.fssaiLicenseNumber !== null;
        break;
      case 'certifications_lab_reports':
        isSupplied = product.certifications !== null && product.laboratoryReports !== null;
        break;
      case 'place_of_origin':
        isSupplied = product.countryOfOrigin !== null && product.placeOfOrigin !== null;
        break;
      case 'delivery_areas_timelines':
        isSupplied = product.deliveryAreas !== null && product.deliveryTimelines !== null;
        break;
      case 'return_eligibility':
        isSupplied = product.returnEligibility !== null;
        break;
    }

    if (!isSupplied) {
      missing.push({
        key: spec.key,
        label: spec.label,
        category: spec.category,
        status: 'Missing',
        description: spec.description,
      });
    }
  });

  return missing;
}

const pricedVariation = (
  id: string,
  packSize: string,
  unit: string,
  price: number,
  taxRate: number,
  hsnCode: string,
  isDefault = false
): ProductVariation => ({
  id,
  sku: null,
  packSize,
  unit,
  price,
  mrp: price,
  stockState: 'unconfirmed',
  inventoryQuantity: null,
  taxClass: 'Applicable GST included in listed price',
  taxRate,
  hsnCode,
  shippingWeight: null,
  packagingDimensions: null,
  purchaseLimit: null,
  isDefault,
});

/**
 * The four central available products of the Katehranchal Agro Foods catalogue.
 * All texts adhere strictly to verified, unexaggerated, supportable statements.
 * Missing commercial values are explicitly set to null.
 */
export const CATALOG_PRODUCTS: Product[] = [
  {
    id: 'prod-desi-ghee',
    slug: 'desi-ghee',
    name: 'Desi Ghee',
    category: 'ghee',
    categoryLabel: 'Ghee',
    shortDescription: 'Buffalo-milk Desi Ghee prepared using a traditional method for everyday family kitchens.',
    description:
      'Our buffalo-milk Desi Ghee is prepared using a traditional method and packed in a glass jar with a protective silver seal.',
    extendedDescription:
      'Available in 250 ml, 500 ml and 1000 ml glass jars. Listed launch prices include applicable taxes. Ordering will open after stock, SKU and statutory store details are verified.',
    suitableUses: [
      'Everyday home cooking',
      'Rotis and parathas',
      'Dal and rice',
      'Traditional recipes',
      'Family meal preparation',
    ],
    variations: [
      pricedVariation('var-desi-ghee-250ml', '250 ml', 'ml', 499, 12, '0405', true),
      pricedVariation('var-desi-ghee-500ml', '500 ml', 'ml', 999, 12, '0405'),
      pricedVariation('var-desi-ghee-1000ml', '1000 ml', 'ml', 1970, 12, '0405'),
    ],
    packOptions: [
      {
        id: 'opt-desi-ghee-250ml',
        sizeLabel: '250 ml',
        unitPrice: 499,
        sku: null,
        isDefault: true,
      },
      { id: 'opt-desi-ghee-500ml', sizeLabel: '500 ml', unitPrice: 999, sku: null },
      { id: 'opt-desi-ghee-1000ml', sizeLabel: '1000 ml', unitPrice: 1970, sku: null },
    ],
    availabilityState: 'Available Soon',
    productStatus: 'available',
    featured: true,
    imageAlt: 'Golden Desi Ghee in unlabelled glass container with traditional brass serving spoon on linen',
    primaryImage: '/assets/products/desi-ghee.svg',
    galleryImages: [
      '/assets/products/desi-ghee.svg',
      '/assets/products/desi-ghee-detail.svg',
    ],
    ingredients: 'Buffalo milk fat',
    processingMethod: 'Traditional preparation method',
    storageInstructions: null,
    shelfLife: null,
    countryOfOrigin: null,
    placeOfOrigin: null,
    manufacturerInfo: null,
    packerInfo: null,
    fssaiLicenseNumber: null,
    certifications: null,
    laboratoryReports: null,
    deliveryAreas: null,
    deliveryTimelines: null,
    returnEligibility: null,
    seoTitle: 'Desi Ghee | Katehranchal Agro Foods',
    seoDescription:
      'A traditional kitchen favourite for everyday meals, rotis, dal and family recipes. Part of the Katehranchal Agro Foods collection.',
  },
  {
    id: 'prod-black-mustard-oil',
    slug: 'black-mustard-oil',
    name: 'Black Mustard Oil',
    category: 'mustard-oils',
    categoryLabel: 'Mustard Oils',
    shortDescription: 'Cold-pressed Black Mustard Oil in protective sealed glass bottles.',
    description:
      'Cold-pressed Black Mustard Oil for traditional cooking and homemade pickles, packed in a glass bottle with a protective plastic seal.',
    extendedDescription:
      'Available in 500 ml and 1000 ml glass bottles. Listed launch prices include applicable taxes. Ordering will open after stock, SKU and statutory store details are verified.',
    suitableUses: [
      'Traditional cooking',
      'Homemade pickles',
      'Regional recipes',
      'Household food preparation',
    ],
    variations: [
      pricedVariation('var-black-mustard-oil-500ml', '500 ml', 'ml', 310, 5, '1514', true),
      pricedVariation('var-black-mustard-oil-1000ml', '1000 ml', 'ml', 608, 5, '1514'),
    ],
    packOptions: [
      {
        id: 'opt-black-mustard-500ml',
        sizeLabel: '500 ml',
        unitPrice: 310,
        sku: null,
        isDefault: true,
      },
      { id: 'opt-black-mustard-1000ml', sizeLabel: '1000 ml', unitPrice: 608, sku: null },
    ],
    availabilityState: 'Available Soon',
    productStatus: 'available',
    featured: true,
    imageAlt: 'Amber Black Mustard Oil in unlabelled glass bottle with visible whole black mustard seeds on dark stone',
    primaryImage: '/assets/products/black-mustard-oil.svg',
    galleryImages: [
      '/assets/products/black-mustard-oil.svg',
      '/assets/products/black-mustard-oil-detail.svg',
    ],
    ingredients: 'Black mustard oil',
    processingMethod: 'Cold-pressed',
    storageInstructions: null,
    shelfLife: null,
    countryOfOrigin: null,
    placeOfOrigin: null,
    manufacturerInfo: null,
    packerInfo: null,
    fssaiLicenseNumber: null,
    certifications: null,
    laboratoryReports: null,
    deliveryAreas: null,
    deliveryTimelines: null,
    returnEligibility: null,
    seoTitle: 'Black Mustard Oil | Katehranchal Agro Foods',
    seoDescription:
      'A robust mustard oil selection for traditional cooking and homemade pickles. Part of the Katehranchal Agro Foods collection.',
  },
  {
    id: 'prod-yellow-mustard-oil',
    slug: 'yellow-mustard-oil',
    name: 'Yellow Mustard Oil',
    category: 'mustard-oils',
    categoryLabel: 'Mustard Oils',
    shortDescription: 'Cold-pressed Yellow Mustard Oil in protective sealed glass bottles.',
    description:
      'Cold-pressed Yellow Mustard Oil for everyday cooking and familiar home recipes, packed in a glass bottle with a protective plastic seal.',
    extendedDescription:
      'Available in 500 ml and 1000 ml glass bottles. Listed launch prices include applicable taxes. Ordering will open after stock, SKU and statutory store details are verified.',
    suitableUses: [
      'Everyday cooking',
      'Pickle preparation',
      'Traditional food preparation',
      'Family recipes',
    ],
    variations: [
      pricedVariation('var-yellow-mustard-oil-500ml', '500 ml', 'ml', 275, 5, '1514', true),
      pricedVariation('var-yellow-mustard-oil-1000ml', '1000 ml', 'ml', 540, 5, '1514'),
    ],
    packOptions: [
      {
        id: 'opt-yellow-mustard-500ml',
        sizeLabel: '500 ml',
        unitPrice: 275,
        sku: null,
        isDefault: true,
      },
      { id: 'opt-yellow-mustard-1000ml', sizeLabel: '1000 ml', unitPrice: 540, sku: null },
    ],
    availabilityState: 'Available Soon',
    productStatus: 'available',
    featured: true,
    imageAlt: 'Golden Yellow Mustard Oil in unlabelled glass bottle with visible whole yellow mustard seeds on warm ivory stone',
    primaryImage: '/assets/products/yellow-mustard-oil.svg',
    galleryImages: [
      '/assets/products/yellow-mustard-oil.svg',
      '/assets/products/yellow-mustard-oil-detail.svg',
    ],
    ingredients: 'Yellow mustard oil',
    processingMethod: 'Cold-pressed',
    storageInstructions: null,
    shelfLife: null,
    countryOfOrigin: null,
    placeOfOrigin: null,
    manufacturerInfo: null,
    packerInfo: null,
    fssaiLicenseNumber: null,
    certifications: null,
    laboratoryReports: null,
    deliveryAreas: null,
    deliveryTimelines: null,
    returnEligibility: null,
    seoTitle: 'Yellow Mustard Oil | Katehranchal Agro Foods',
    seoDescription:
      'A balanced mustard oil selection for everyday cooking and familiar home recipes. Part of the Katehranchal Agro Foods collection.',
  },
  {
    id: 'prod-natural-wheat',
    slug: 'natural-wheat',
    name: 'Natural Wheat',
    category: 'grains',
    categoryLabel: 'Grains',
    shortDescription: 'Five selected wheat varieties for home milling, available in 5 kg and 10 kg packs.',
    description:
      'Choose from PBW 1 Chapati, PBW 872, Sharbati, Khapli and Lokwan whole wheat for home milling and everyday food preparation.',
    extendedDescription:
      'Each variety is planned in 5 kg and 10 kg packs at ₹62 per kg. Listed launch prices include applicable taxes. Ordering will open after stock, SKU and statutory store details are verified.',
    suitableUses: [
      'Home milling',
      'Rotis and chapatis',
      'Everyday family meals',
      'Traditional wheat recipes',
    ],
    variations: [
      pricedVariation('var-wheat-pbw1-5kg', 'PBW 1 Chapati Wheat • 5 kg', 'kg', 310, 5, '1001', true),
      pricedVariation('var-wheat-pbw1-10kg', 'PBW 1 Chapati Wheat • 10 kg', 'kg', 620, 5, '1001'),
      pricedVariation('var-wheat-pbw872-5kg', 'PBW 872 Wheat • 5 kg', 'kg', 310, 5, '1001'),
      pricedVariation('var-wheat-pbw872-10kg', 'PBW 872 Wheat • 10 kg', 'kg', 620, 5, '1001'),
      pricedVariation('var-wheat-sharbati-5kg', 'Sharbati Wheat • 5 kg', 'kg', 310, 5, '1001'),
      pricedVariation('var-wheat-sharbati-10kg', 'Sharbati Wheat • 10 kg', 'kg', 620, 5, '1001'),
      pricedVariation('var-wheat-khapli-5kg', 'Khapli Wheat • 5 kg', 'kg', 310, 5, '1001'),
      pricedVariation('var-wheat-khapli-10kg', 'Khapli Wheat • 10 kg', 'kg', 620, 5, '1001'),
      pricedVariation('var-wheat-lokwan-5kg', 'Lokwan Wheat • 5 kg', 'kg', 310, 5, '1001'),
      pricedVariation('var-wheat-lokwan-10kg', 'Lokwan Wheat • 10 kg', 'kg', 620, 5, '1001'),
    ],
    packOptions: [
      {
        id: 'opt-natural-wheat-5kg',
        sizeLabel: '5 kg',
        unitPrice: 310,
        sku: null,
        isDefault: true,
      },
      { id: 'opt-natural-wheat-10kg', sizeLabel: '10 kg', unitPrice: 620, sku: null },
    ],
    availabilityState: 'Available Soon',
    productStatus: 'available',
    featured: true,
    imageAlt: 'Clean whole wheat grains and wheat stalks in ceramic bowl on natural linen',
    primaryImage: '/assets/products/natural-wheat.svg',
    galleryImages: [
      '/assets/products/natural-wheat.svg',
      '/assets/products/natural-wheat-detail.svg',
    ],
    ingredients: 'Whole wheat grain',
    processingMethod: null,
    storageInstructions: null,
    shelfLife: null,
    countryOfOrigin: null,
    placeOfOrigin: null,
    manufacturerInfo: null,
    packerInfo: null,
    fssaiLicenseNumber: null,
    certifications: null,
    laboratoryReports: null,
    deliveryAreas: null,
    deliveryTimelines: null,
    returnEligibility: null,
    seoTitle: 'Natural Wheat | Katehranchal Agro Foods',
    seoDescription:
      'Whole wheat for home milling and the everyday comfort of fresh rotis. Part of the Katehranchal Agro Foods collection.',
  },
];

/**
 * Six planned additions for the Coming Soon collection.
 * None of these products display prices, pack sizes, or purchase controls.
 */
export const COMING_SOON_ITEMS: ComingSoonItem[] = [
  {
    id: 'cs-natural-wheat-flour',
    slug: 'natural-wheat-flour',
    name: 'Natural Wheat Flour',
    category: 'Grains & Flours',
    intendedPurpose: 'Everyday family cooking and fresh home-baked flatbreads.',
    status: 'Planned Addition',
    description: 'Wheat flour planned as a future addition for everyday family cooking.',
    suitableUses: [
      'Everyday home cooking',
      'Rotis and chapatis',
      'Household kitchen preparation',
    ],
    primaryImage: '/assets/products/coming-soon-flour.svg',
  },
  {
    id: 'cs-cow-dung-cakes',
    slug: 'cow-dung-cakes',
    name: 'Cow Dung Cakes',
    category: 'Household & Ceremonial',
    intendedPurpose: 'Traditional domestic ceremonial use and family rituals.',
    status: 'Domestic & Ceremonial Essential',
    description: 'Traditional cow dung cakes planned for appropriate domestic and ceremonial use.',
    suitableUses: [
      'Domestic ceremonial rituals',
      'Traditional household use',
    ],
    domesticUseOnlyNotice:
      'Traditional wood and household products are intended only for appropriate domestic and ceremonial uses. They are not offered for commercial or industrial use.',
    primaryImage: '/assets/products/coming-soon-cow-dung.svg',
  },
  {
    id: 'cs-traditional-wood-ash',
    slug: 'traditional-wood-ash',
    name: 'Traditional Wood Ash',
    category: 'Household & Gardening',
    intendedPurpose: 'Natural ash for suitable traditional household and domestic uses.',
    status: 'Planned Addition',
    description: 'Natural wood ash planned for suitable traditional household uses.',
    suitableUses: [
      'Traditional household applications',
      'Domestic gardening assistance',
    ],
    domesticUseOnlyNotice:
      'Traditional wood and household products are intended only for appropriate domestic and ceremonial uses. They are not offered for commercial or industrial use.',
    primaryImage: '/assets/products/coming-soon-wood-ash.svg',
  },
  {
    id: 'cs-natural-soil',
    slug: 'natural-soil',
    name: 'Natural Soil',
    category: 'Household & Gardening',
    intendedPurpose: 'Selected natural soil for domestic gardening and ceremonial preparations.',
    status: 'Sourcing & Quality Evaluation',
    description: 'Selected natural soil planned for suitable domestic, gardening or ceremonial use.',
    suitableUses: [
      'Domestic potting',
      'Household gardening',
      'Appropriate ceremonial use',
    ],
    primaryImage: '/assets/products/coming-soon-natural-soil.svg',
  },
  {
    id: 'cs-dry-neem-wood',
    slug: 'dry-neem-wood',
    name: 'Dry Neem Wood',
    category: 'Household & Ceremonial',
    intendedPurpose: 'Seasoned neem wood for domestic ritual fires and ceremonial use.',
    status: 'Domestic & Ceremonial Essential',
    description: 'Naturally dried neem wood planned for appropriate domestic and ceremonial use.',
    suitableUses: [
      'Domestic ceremonial rituals',
      'Traditional household fires',
    ],
    domesticUseOnlyNotice:
      'Traditional wood and household products are intended only for appropriate domestic and ceremonial uses. They are not offered for commercial or industrial use.',
    primaryImage: '/assets/products/coming-soon-neem-wood.svg',
  },
  {
    id: 'cs-dry-mango-wood',
    slug: 'dry-mango-wood',
    name: 'Dry Mango Wood',
    category: 'Household & Ceremonial',
    intendedPurpose: 'Dry mango wood for appropriate domestic ceremonial use, including havan and yagya.',
    status: 'Domestic & Ceremonial Essential',
    description: 'Dry mango wood planned for appropriate domestic ceremonial use, including havan and yagya.',
    suitableUses: [
      'Domestic ceremonial rituals',
      'Sacred family gatherings',
      'Traditional household ceremonies',
    ],
    domesticUseOnlyNotice:
      'Traditional wood and household products are intended only for appropriate domestic and ceremonial uses. They are not offered for commercial or industrial use.',
    primaryImage: '/assets/products/coming-soon-mango-wood.svg',
  },
];

/**
 * Fast lookup helper by slug.
 */
export function findProductBySlug(slug: string): Product | undefined {
  return CATALOG_PRODUCTS.find((p) => p.slug === slug);
}

/**
 * Fast lookup helper by id.
 */
export function findProductById(id: string): Product | undefined {
  return CATALOG_PRODUCTS.find((p) => p.id === id);
}

/**
 * Returns all products for a given category.
 */
export function getProductsByCategory(category: string): Product[] {
  if (!category || category === 'all') {
    return CATALOG_PRODUCTS;
  }
  return CATALOG_PRODUCTS.filter((p) => p.category === category || p.slug === category);
}

/**
 * Summary audit helper listing all missing commercial fields across all products.
 */
export function getAllMissingCommercialFields(): {
  productName: string;
  slug: string;
  missingFields: MissingCommercialField[];
}[] {
  return CATALOG_PRODUCTS.map((prod) => ({
    productName: prod.name,
    slug: prod.slug,
    missingFields: getMissingCommercialFields(prod),
  }));
}
