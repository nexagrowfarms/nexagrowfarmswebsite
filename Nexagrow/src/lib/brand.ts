/**
 * ============================================================
 *  BRAND CONSTANTS — Single Source of Truth
 * ============================================================
 *  To rename or rebrand the company, edit the values here.
 *  Every component, page, API route, and metadata block that
 *  imports from this file will update automatically.
 *
 *  Usage:
 *    import { BRAND } from '@/lib/brand';
 *    <title>{BRAND.fullTitle}</title>
 *    <p>{BRAND.name}</p>
 * ============================================================
 */

export const BRAND = {
  // ── Core Identity ──────────────────────────────────────────
  /** Full public-facing brand name, e.g. in headings and copy */
  name: 'Nexa Grow Farms',

  /** Short brand name used in tight UI spaces (navbar, payment modals, chatbot) */
  shortName: 'Nexa Grow',

  /** Official registered legal name — do not abbreviate */
  legalName: 'NEXA GROW FARMER PRODUCER COMPANY LIMITED',

  /** Company Identification Number (CIN) */
  cin: 'U01111UP2026PTC241871',

  // ── Tagline & SEO ──────────────────────────────────────────
  /** Brand tagline used in page titles and meta */
  tagline: 'Organic Moringa & Wellness',

  /** Default <title> for pages that don't override it */
  get fullTitle() {
    return `${this.name} | ${this.tagline}`;
  },

  /** Default meta description for pages/products */
  defaultDescription:
    'Nexa Grow Farms brings pure, organic moringa products and wellness from farm to table.',

  /** SEO keywords */
  keywords: [
    'Nexa Grow Farms',
    'NexaGrow',
    'Moringa',
    'Organic Moringa',
    'Wellness',
    'Organic Supplements',
    'Farmer Producer Company',
  ],

  // ── Contact ────────────────────────────────────────────────
  /** Primary customer-facing email */
  email: 'contact@nexagrowfarms.com',

  /** Phone / WhatsApp (optional — add if used in components) */
  // phone: '+91-XXXXXXXXXX',

  // ── URLs & Domain ──────────────────────────────────────────
  /** Primary production domain (no trailing slash) */
  domain: 'nexagrowfarms.com',

  /** Full canonical origin URL */
  url: 'https://nexagrowfarms.com',

  // ── Location ───────────────────────────────────────────────
  /** Farm village */
  farmLocation: 'Kanewra, Uttar Pradesh',

  /** Khasra reference used in product origin copy */
  khasra: 'Khasra No. 355',

  // ── Assets ─────────────────────────────────────────────────
  /** Default logo (dark backgrounds or main usage) */
  logo: '/nexagrow-logo.png',

  /** Light version of the logo (dark sections / footers) */
  logoLight: '/nexagrow-logo-light.png',

  /** Compact navbar logo */
  navbarLogo: '/nexagrow-navbar-logo.png',

  /** Favicon path */
  favicon: '/nexagrow-favicon.png',

  // ── Storage Keys ───────────────────────────────────────────
  /** localStorage / sessionStorage key namespacing */
  storageKeys: {
    wishlist: 'nexagrow-wishlist',
    cart: 'nexagrow-cart',
  },

  // ── Payments ───────────────────────────────────────────────
  /** Business name displayed in payment modals (Razorpay / UPI) */
  paymentName: 'NexaGrow',

  /** Brand accent colour used in payment UI (Razorpay theme) */
  accentColor: '#26473C',
} as const;

// ── Convenience named exports for common lookups ─────────────
/** Full brand name: "Nexa Grow Farms" */
export const BRAND_NAME = BRAND.name;

/** Short brand name: "NexaGrow" */
export const BRAND_SHORT = BRAND.shortName;

/** Legal name: "NEXA GROW FARMER PRODUCER COMPANY LIMITED" */
export const BRAND_LEGAL = BRAND.legalName;

/** Primary email: "contact@nexagrowfarms.com" */
export const BRAND_EMAIL = BRAND.email;

/** Canonical URL: "https://nexagrowfarms.com" */
export const BRAND_URL = BRAND.url;
