/**
 * Central, editable site configuration.
 *
 * Every value marked PLACEHOLDER is NOT verified company information.
 * Replace via environment variables (see .env.example) or edit here.
 */

const env = (key: string, fallback = "") => process.env[key]?.trim() || fallback;

export const siteConfig = {
  name: "Cloud Trek",
  tagline: "For Events Management, Publicity and Advertising",
  description:
    "Cloud Trek is a Bahrain-based B2B partner for promotional products, corporate gifting, events management, publicity and advertising.",
  url: env("NEXT_PUBLIC_SITE_URL", "http://localhost:3000"),
  locationLabel: "Kingdom of Bahrain",

  contact: {
    email: env("NEXT_PUBLIC_CONTACT_EMAIL"), // PLACEHOLDER until supplied
    phone: env("NEXT_PUBLIC_CONTACT_PHONE"), // PLACEHOLDER until supplied
    whatsapp: env("NEXT_PUBLIC_WHATSAPP_NUMBER"), // digits only, e.g. 973XXXXXXXX
    address: env("NEXT_PUBLIC_CONTACT_ADDRESS"), // PLACEHOLDER until supplied
    mapEmbedUrl: env("NEXT_PUBLIC_MAP_EMBED_URL"), // Google Maps embed URL, optional
    instagram: "https://www.instagram.com/cloudtrekbh/",
    instagramHandle: "@cloudtrekbh",
  },

  /** Featured sections that should stay hidden until verified content exists. */
  features: {
    testimonials: false,
    clientLogos: false,
  },
} as const;

export function whatsappLink(message = "Hello Cloud Trek, I would like to discuss a corporate gifting enquiry.") {
  const n = siteConfig.contact.whatsapp.replace(/\D/g, "");
  if (!n) return null;
  return `https://wa.me/${n}?text=${encodeURIComponent(message)}`;
}

export const navLinks = [
  { key: "home", href: "/" },
  { key: "products", href: "/products" },
  { key: "gifting", href: "/corporate-gifting" },
  { key: "services", href: "/services" },
  { key: "work", href: "/our-work" },
  { key: "about", href: "/about" },
  { key: "contact", href: "/contact" },
] as const;
