# Katehranchal Agro Foods — Permanent Brand Typography System & Brand Guidelines

## 1. Brand Identity Overview
- **Brand Name**: Katehranchal Agro Foods
- **Parent Group Line**: Part of Katehranchal Group
- **Tagline**: Traditional Village Products for Modern Homes
- **Official Portal**: https://Katehranchal.org
- **Official Support Email**: agro@Katehranchal.org
- **Customer-Support WhatsApp**: +91 94500 39346
- **Language**: Strictly 100% English only across all media.

---

## 2. Typeface Selection & Philosophy

### Primary Brand & Display Typeface: Fraunces
- **Designer**: Phaedra Charles & Flavia Zimbardi (Undercase Type)
- **License**: SIL Open Font License (OFL), Version 1.1 (Free for commercial and personal use, modification, and embedding).
- **Font Source**: Official Google Fonts / Self-hosted WOFF2 local asset repository (`/public/assets/fonts/fraunces/`).
- **Approved Weights**:
  - **Regular 400**: Editorial statements, quotations, subtle narrative headers.
  - **Medium 500**: Hero titles, main page titles, major section headings.
  - **SemiBold 600**: Primary brand wordmark ("KATEHRANCHAL"), product titles, packaging titles.
- **Approved Use Cases**:
  - Wordmark text displayed alongside the official emblem
  - Main hero display titles
  - Page titles and primary section titles
  - Individual product names (e.g. Desi Ghee, Black Mustard Oil)
  - Editorial statements and brand-story highlights
  - Packaging headers and premium campaign headlines
  - Selected short quotations
- **Design Character**: Emotional warmth, traditional rural heritage, artisanal dignity, and refined food presentation. Never theatrical or ornamental.
- **Fallback Stack**:
  ```css
  font-family: 'Fraunces', Georgia, 'Times New Roman', serif;
  ```

---

### Functional & Supporting Typeface: Manrope
- **Designer**: Mikhail Sharanda
- **License**: SIL Open Font License (OFL), Version 1.1 (Free for commercial use, distribution, and print).
- **Font Source**: Official Google Fonts / Self-hosted WOFF2 local asset repository (`/public/assets/fonts/manrope/`).
- **Approved Weights**:
  - **Regular 400**: Body copy, descriptions, terms, technical details.
  - **Medium 500**: Product specifications, form labels, filters, badges.
  - **SemiBold 600**: Navigation links, call-to-action buttons, pricing, table headers.
  - **Bold 700**: Numerical values, key emphasis callouts, order confirmation metrics.
- **Approved Use Cases**:
  - Website navigation and header controls
  - Body paragraphs, editorial copy, and introductions
  - Product descriptions, nutritional information, pack sizes, and prices
  - Form inputs, labels, validation states, and checkout steps
  - Customer account, order history, and tracking details
  - Policy pages, shipping rules, and FAQs
  - Invoices, packing slips, email templates, and delivery box shipping labels
- **Design Character**: Geometric clarity, high legibility, contemporary modern balance, unyielding technical precision.
- **Fallback Stack**:
  ```css
  font-family: 'Manrope', 'Segoe UI', Arial, sans-serif;
  ```

---

## 3. Brand Wordmark Specification

When creating brand lockups for website headers, letterheads, packaging labels, and signage:

1. **Emblem Pairing**:
   - The official attached Katehranchal Agro Foods emblem (green outer leaf, sunrise, field terraces, flowing river, tall wheat stalk, rural hut) is placed to the left or top of the typeset wordmark.
   - The emblem is NEVER redrawn, recoloured, or distorted.

2. **Typeset Wordmark**:
   - **Primary Line**: `"KATEHRANCHAL"`
     - Typeface: **Fraunces SemiBold (600)**
     - Case: UPPERCASE
     - Letter Spacing: `+0.04em` to `+0.06em`
     - Color: Deep Forest Green (`#124328`) on light surfaces; Ivory White (`#FBF9F4`) on dark green backgrounds.
     - Sizing: Visually dominant (approx. 1.35x size of second line).
   - **Secondary Line**: `"AGRO FOODS"`
     - Typeface: **Manrope SemiBold (600)** or Fraunces SemiBold (600)
     - Case: UPPERCASE
     - Letter Spacing: `+0.16em` to `+0.22em` (airy, refined tracking)
     - Color: Wheat Gold (`#E0980B`)
     - Sizing: Proportionately smaller to create structured typographic balance.

3. **Supporting Tagline Positioning**:
   - Tagline: `"Traditional Village Products for Modern Homes"`
   - Tagline is NOT inside the core logo lockup; it appears underneath or in accompanying editorial layout.
   - Typeface: Manrope Medium (500), Regular casing, text-xs/sm.

---

## 4. Typography Scale & Responsive Hierarchy

| Element | Desktop Size & Weight | Mobile Size & Weight | Line Height | Tracking | Recommended Color |
|---|---|---|---|---|---|
| **Hero Display** | Fraunces Med, 56–72px | Fraunces Med, 34–44px | 1.12 | -0.015em | Deep Forest (`#124328`) |
| **Page Title (H1)** | Fraunces Med, 44–56px | Fraunces Med, 30–38px | 1.16 | -0.01em | Deep Forest (`#124328`) |
| **Section Heading (H2)**| Fraunces Med, 32–42px | Fraunces Med, 24–32px | 1.22 | -0.01em | Deep Forest (`#124328`) |
| **Subheading (H3)** | Fraunces SemiBold, 20–26px | Fraunces SemiBold, 18–22px | 1.3 | Normal | Deep Forest (`#124328`) |
| **Product Title** | Fraunces SemiBold, 22–28px | Fraunces SemiBold, 18–22px | 1.25 | Normal | Deep Forest (`#124328`) |
| **Editorial Quote** | Fraunces Reg/Med, 24–36px | Fraunces Reg, 18–24px | 1.45 | Normal | Charcoal / Forest |
| **Intro Paragraph** | Manrope Reg, 18–20px | Manrope Reg, 16–17px | 1.65 | Normal | Charcoal 85% (`#132218`) |
| **Body Copy** | Manrope Reg, 16–17px | Manrope Reg, 15–16px | 1.65 | Normal | Charcoal 80% (`#132218`) |
| **Navigation Link** | Manrope SemiBold, 14–15px | Manrope SemiBold, 15–16px | 1.2 | +0.02em | Deep Forest / Cream |
| **Buttons & CTAs** | Manrope SemiBold, 14–15px | Manrope SemiBold, 14–15px | 1.0 | +0.08em UPPER | White on Forest/Gold |
| **Product Price** | Manrope Bold, 20–26px | Manrope Bold, 18–22px | 1.1 | Normal | Deep Forest (`#124328`) |
| **Metadata / Badges**| Manrope Med, 11–13px | Manrope Med, 11–12px | 1.2 | +0.05em UPPER | Wheat / Field Green |

---

## 5. Reading & Layout Rules
- **Line Width**: Constrain all body copy to **55–72 characters per line** (`max-w-[65ch]`) to prevent reading fatigue.
- **Alignment**: Left-align editorial and descriptive body copy. Never center long multi-line paragraphs.
- **Contrast**: Ensure WCAG AA compliance (minimum 4.5:1 for body text). Never place light gold text on cream backgrounds or low-contrast gray on dark backgrounds.
- **Italics Discipline**: Use italics exclusively for short, carefully selected phrases (e.g. selected quotations, Latin botanical references). Never italicize prices, buttons, product titles, or form controls.
- **No All-Caps Paragraphs**: Uppercase is strictly restricted to short labels, buttons, badges, and the brand wordmark.

---

## 6. Packaging & Print Production Recommendations

For commercial packaging designers, box printers, and exhibition fabricators:

1. **Food Jars & Bottles (Labels)**:
   - Front label headline (e.g., *"Pure Desi Ghee"*, *"Black Mustard Oil"*): Fraunces SemiBold.
   - Net volume, batch details, ingredients, FSSAI / lab details: Manrope Regular & Medium (minimum 6.5pt for regulatory compliance).
   - Brand name lockup: Full emblem + Fraunces SemiBold wordmark.

2. **Outer Shipping Cartons**:
   - Brand lockup printed with high-contrast single-color forest green or black.
   - Fragile glass icons with Manrope SemiBold handling warnings.

3. **Invoices & Commercial Letterheads**:
   - Header: Official logo lockup with Fraunces SemiBold company title.
   - Billing addresses, line-item tables, tax summaries: Manrope Regular (table body) and Manrope SemiBold (column headers).
