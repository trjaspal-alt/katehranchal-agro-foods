/**
 * Katehranchal Agro Foods - Permanent Brand Typography System
 * 
 * Primary Brand & Display: Fraunces (SIL Open Font License)
 * Functional & Supporting: Manrope (SIL Open Font License)
 */

export const BRAND_TYPOGRAPHY = {
  fonts: {
    primaryDisplay: 'Fraunces, Georgia, "Times New Roman", serif',
    functional: 'Manrope, "Segoe UI", Arial, sans-serif',
  },
  weights: {
    fraunces: {
      regular: 400,
      medium: 500,
      semiBold: 600,
    },
    manrope: {
      regular: 400,
      medium: 500,
      semiBold: 600,
      bold: 700,
    },
  },
  scale: {
    // Desktop & Mobile responsive scale with clamp
    heroDisplay: 'text-3xl sm:text-5xl lg:text-6xl font-serif font-medium leading-[1.12]',
    pageTitle: 'text-2xl sm:text-4xl lg:text-5xl font-serif font-medium leading-tight',
    sectionHeading: 'text-xl sm:text-3xl lg:text-4xl font-serif font-medium leading-snug',
    productTitle: 'text-lg sm:text-xl font-serif font-semibold leading-snug',
    editorialQuote: 'text-lg sm:text-2xl font-serif font-normal italic leading-relaxed',
    introParagraph: 'text-base sm:text-lg font-sans font-normal leading-relaxed text-[#132218]/85 max-w-[68ch]',
    bodyCopy: 'text-sm sm:text-base font-sans font-normal leading-relaxed text-[#132218]/80 max-w-[65ch]',
    bodyCopySmall: 'text-xs sm:text-sm font-sans font-normal leading-relaxed text-[#132218]/75',
    navigation: 'text-xs sm:text-sm font-sans font-semibold tracking-wide',
    button: 'text-xs sm:text-sm font-sans font-semibold tracking-wider uppercase',
    productMeta: 'text-xs font-sans font-medium',
    captionMeta: 'text-[11px] sm:text-xs font-sans font-normal text-[#132218]/60',
  },
  prose: {
    optimalLineLength: 'max-w-[65ch]',
    lineHeightTight: 'leading-[1.15]',
    lineHeightHeading: 'leading-[1.25]',
    lineHeightBody: 'leading-[1.65]',
  },
  rules: {
    language: 'Strictly 100% English only',
    noDecorativeFlourishes: true,
    italicsUsage: 'Restricted to short, curated editorial emphasis phrases only',
    buttonTypography: 'Manrope SemiBold only; never decorative or script',
    noAllUppercaseParagraphs: true,
  }
} as const;
