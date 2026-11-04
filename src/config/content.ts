/**
 * Editable marketing content. Statements here avoid unverified claims about
 * Cloud Trek (no dates, clients, certifications or capacities).
 */

export const divisions = [
  {
    slug: "promotional-products",
    title: "Promotional Products & Corporate Gifting",
    short: "Branded merchandise and curated gifts, from a single notebook to a thousand-piece programme.",
    description:
      "Customised promotional products and corporate gift sets selected, branded and packed around your brief.",
    image: "/images/hero/gift-boxes-ribbon.jpg",
    imageWide: "/images/hero/gift-boxes-wide.jpg",
    href: "/products",
    cta: "Explore Products",
    points: ["Product sourcing and selection", "Branding and personalisation", "Gift sets, kits and hampers"],
  },
  {
    slug: "events-management",
    title: "Events Management",
    short: "Conferences, exhibitions and brand activations, with merchandise that fits the room.",
    description:
      "Support for planning and delivering corporate events, exhibitions and activations, aligned with your brand.",
    image: "/images/events/conference-stage-portrait.jpg",
    imageWide: "/images/events/conference-stage.jpg",
    href: "/services#events-management",
    cta: "Discover Events",
    points: ["Conferences and corporate events", "Exhibition presence", "Delegate kits and event merchandise"],
  },
  {
    slug: "publicity-advertising",
    title: "Publicity & Advertising",
    short: "Campaign visibility across print, display and outdoor channels.",
    description:
      "Publicity and advertising support that connects campaign messaging with physical, visible brand touchpoints.",
    image: "/images/advertising/billboards-night-portrait.jpg",
    imageWide: "/images/advertising/billboards-night.jpg",
    href: "/services#advertising-publicity",
    cta: "See Advertising",
    points: ["Campaign concepts", "Print and display media", "Outdoor and branded environments"],
  },
] as const;

export const giftingOccasions = [
  { title: "Employee Welcome Kits", text: "Onboarding sets that make a new hire feel expected.", image: "/images/products/welcome-kit.jpg" },
  { title: "Client Appreciation Gifts", text: "A considered thank-you for renewals and milestones.", image: "/images/gifting/client-appreciation.jpg" },
  { title: "Executive Gifts", text: "Refined, understated pieces for senior stakeholders.", image: "/images/products/leather-notebook.jpg" },
  { title: "Event & Conference Kits", text: "Delegate essentials packed for smooth registration.", image: "/images/products/conference-kit.jpg" },
  { title: "Festive Gifting", text: "Seasonal hampers for the moments your clients celebrate.", image: "/images/gifting/festive-boxes.jpg" },
  { title: "Employee Recognition", text: "Awards and gifts that make recognition feel earned.", image: "/images/products/crystal-award.jpg" },
] as const;

export const bahrainOccasions = ["Ramadan", "Eid", "Bahrain National Day"] as const;

/** Editable placeholders — confirm with Cloud Trek before presenting as confirmed services. */
export const techniques = [
  { name: "Laser Engraving", text: "Precise, permanent marks on metal, wood and glass.", image: "/images/techniques/laser-pen.jpg" },
  { name: "Screen Printing", text: "Bold, durable colour on textiles and bags.", image: "/images/techniques/screen-printing.jpg" },
  { name: "UV Printing", text: "Full-colour detail on rigid and hard surfaces.", image: "/images/techniques/uv-swatches.jpg" },
  { name: "Embroidery", text: "Stitched logos with a premium, tactile finish.", image: "/images/techniques/embroidery.jpg" },
  { name: "Embossing & Debossing", text: "Raised or pressed marks on leather and card.", image: "/images/techniques/embossing.jpg" },
  { name: "Customized Packaging", text: "Presentation boxes and sleeves made for your set.", image: "/images/techniques/packaging.jpg" },
] as const;

export const processSteps = [
  { title: "Explore Products", text: "Browse the catalogue and shortlist what suits your audience." },
  { title: "Share Your Requirements", text: "Tell us quantities, branding needs and timelines." },
  { title: "Receive a Quotation", text: "We respond with a clear, itemised quotation." },
  { title: "Approve Your Customization", text: "Review artwork and samples before production." },
  { title: "Production & Delivery", text: "Your order is produced, quality-checked and delivered." },
] as const;

export const whyPoints = [
  { title: "Tailored Branding Solutions", text: "Products are customised around your identity, not a template." },
  { title: "Diverse Product Selection", text: "From stationery to technology to apparel, in one conversation." },
  { title: "Corporate Gifting Expertise", text: "A focus on gifting that suits business relationships." },
  { title: "Personalised Service", text: "A direct line to people who understand your brief." },
  { title: "Business-focused Solutions", text: "Quotation-led, volume-aware, built for organisations." },
] as const;

export const values = [
  { title: "Craft", text: "Details are the difference between merchandise and a memorable gift." },
  { title: "Clarity", text: "Straightforward quotations and honest timelines." },
  { title: "Partnership", text: "We treat every brief as a long-term relationship." },
  { title: "Consistency", text: "Your brand should look the same on every object." },
] as const;

export const budgetRanges = [
  "Under BHD 500",
  "BHD 500 – 1,000",
  "BHD 1,000 – 2,500",
  "BHD 2,500 – 5,000",
  "BHD 5,000+",
  "Not sure yet",
] as const;
