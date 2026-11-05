/**
 * CENTRALIZED DEMONSTRATION DATA
 * ------------------------------------------------------------------
 * Everything in this file is ILLUSTRATIVE SAMPLE CONTENT for the client
 * presentation. It is not verified Cloud Trek catalogue, client, project or
 * performance information. When Supabase is configured and contains records,
 * those real records take precedence (see src/lib/data.ts).
 *
 * Photography: Unsplash (free licence), stored locally under /public/images.
 */
import type {
  Category,
  Enquiry,
  GiftingCollection,
  PortfolioProject,
  Product,
  Stat,
} from "@/types";

const img = (group: string, file: string) => `/images/${group}/${file}.jpg`;

/* ----------------------------- Categories ----------------------------- */

export const demoCategories: Category[] = [
  { id: "cat-stationery", name: "Corporate Stationery", slug: "corporate-stationery", description: "Notebooks, pens and desk essentials that carry your brand into every meeting.", image: img("products", "leather-notebook"), isActive: true, isDemo: true },
  { id: "cat-tech", name: "Tech & Electronics", slug: "tech-electronics", description: "Chargers, audio and storage gifts that earn a permanent place on the desk.", image: img("products", "wireless-charging-station"), isActive: true, isDemo: true },
  { id: "cat-drinkware", name: "Drinkware", slug: "drinkware", description: "Insulated bottles and travel mugs for everyday brand visibility.", image: img("products", "vacuum-bottle"), isActive: true, isDemo: true },
  { id: "cat-bags", name: "Bags & Accessories", slug: "bags-accessories", description: "Backpacks, totes and carry solutions for teams, clients and events.", image: img("products", "corporate-backpack"), isActive: true, isDemo: true },
  { id: "cat-apparel", name: "Apparel & Wearables", slug: "apparel-wearables", description: "Branded clothing for teams, hospitality and field staff.", image: img("categories", "apparel"), isActive: true, isDemo: true },
  { id: "cat-gifts", name: "Gift Sets & Hampers", slug: "gift-sets-hampers", description: "Curated, presentation-ready sets for clients, staff and festive seasons.", image: img("products", "executive-gift-box"), isActive: true, isDemo: true },
  { id: "cat-awards", name: "Awards & Recognition", slug: "awards-recognition", description: "Crystal, metal and bespoke awards that make recognition last.", image: img("products", "crystal-award"), isActive: true, isDemo: true },
  { id: "cat-events", name: "Event Merchandise", slug: "event-merchandise", description: "Lanyards, kits and giveaways built for conferences and exhibitions.", image: img("products", "conference-kit"), isActive: true, isDemo: true },
];

/* ------------------------------ Products ------------------------------ */

type P = Omit<Product, "isActive" | "isDemo" | "images"> & { image: string };
const p = (x: P): Product => {
  const { image, ...rest } = x;
  return { ...rest, images: [image], isActive: true, isDemo: true };
};

export const demoProducts: Product[] = [
  p({ id: "prod-01", name: "Premium Executive Gift Box", slug: "premium-executive-gift-box", categorySlug: "gift-sets-hampers", image: img("products", "executive-gift-box"), isFeatured: true, moq: 50,
    shortDescription: "A rigid, magnet-closure presentation box configured with a curated executive set.",
    description: "A rigid presentation box with a magnetic closure and a custom-cut insert, designed to hold a curated selection of executive items. Ideal for senior client gifting and board-level appreciation. Contents can be configured around your brief.",
    specifications: [{ label: "Format", value: "Rigid box, magnetic closure" }, { label: "Insert", value: "Custom-cut foam or card" }, { label: "Size", value: "Configurable (sample: 30 × 22 × 8 cm)" }, { label: "Finish", value: "Soft-touch lamination" }],
    customizationOptions: ["Hot-foil lid logo", "Printed ribbon", "Custom insert layout", "Personalised card"] }),
  p({ id: "prod-02", name: "Wireless Charging Station", slug: "wireless-charging-station", categorySlug: "tech-electronics", image: img("products", "wireless-charging-station"), isFeatured: true, moq: 100,
    shortDescription: "A slim Qi-compatible charging pad that keeps a branded surface on the desk.",
    description: "A low-profile wireless charging pad with a fabric or soft-touch top surface that offers a clean branding area. A practical desk-side gift for clients and employees alike.",
    specifications: [{ label: "Output", value: "10–15 W (Qi)" }, { label: "Surface", value: "Soft-touch / fabric" }, { label: "Input", value: "USB-C" }, { label: "Colours", value: "Black, grey, navy" }],
    customizationOptions: ["UV print logo", "Laser engraving", "Custom colour surface", "Branded packaging"] }),
  p({ id: "prod-03", name: "Stainless Steel Vacuum Bottle", slug: "stainless-steel-vacuum-bottle", categorySlug: "drinkware", image: img("products", "vacuum-bottle"), isFeatured: true, moq: 100,
    shortDescription: "Double-wall insulated bottle that keeps drinks cold or hot throughout the day.",
    description: "A double-wall vacuum-insulated stainless steel bottle with a powder-coat finish. A high-visibility everyday item that suits staff programmes, events and client kits.",
    specifications: [{ label: "Capacity", value: "500 ml" }, { label: "Material", value: "304 stainless steel" }, { label: "Insulation", value: "Double-wall vacuum" }, { label: "Finish", value: "Powder-coat matte" }],
    customizationOptions: ["Laser engraving", "Screen print", "Colour-matched powder coat", "Gift tube packaging"] }),
  p({ id: "prod-04", name: "Custom Leather Notebook", slug: "custom-leather-notebook", categorySlug: "corporate-stationery", image: img("products", "leather-notebook"), isFeatured: true, moq: 50,
    shortDescription: "A5 notebook with a faux-leather cover, elastic closure and ribbon marker.",
    description: "An A5 hardcover notebook with a premium faux-leather cover, elastic closure and ribbon marker. A dependable stationery choice for meetings, onboarding and conferences.",
    specifications: [{ label: "Size", value: "A5" }, { label: "Pages", value: "192 ruled pages" }, { label: "Cover", value: "Faux leather" }, { label: "Extras", value: "Elastic closure, ribbon" }],
    customizationOptions: ["Debossed logo", "Hot-foil stamping", "Custom page printing", "Pen loop"] }),
  p({ id: "prod-05", name: "Branded Metal Pen", slug: "branded-metal-pen", categorySlug: "corporate-stationery", image: img("products", "metal-pen"), isFeatured: false, moq: 200,
    shortDescription: "A weighted metal ballpoint with a smooth writing action and engraving area.",
    description: "A weighted metal ballpoint with a smooth writing action and a clear barrel area for engraving. A reliable giveaway that feels considerably more premium than its price suggests.",
    specifications: [{ label: "Material", value: "Anodised aluminium" }, { label: "Refill", value: "Blue ink, 1.0 mm" }, { label: "Mechanism", value: "Twist / click" }, { label: "Colours", value: "Silver, black, navy" }],
    customizationOptions: ["Laser engraving", "Colour print", "Pen case"] }),
  p({ id: "prod-06", name: "Premium Corporate Backpack", slug: "premium-corporate-backpack", categorySlug: "bags-accessories", image: img("products", "corporate-backpack"), isFeatured: true, moq: 50,
    shortDescription: "A structured laptop backpack designed for daily commutes and business travel.",
    description: "A structured backpack with a padded laptop compartment, organiser pockets and a trolley strap. Suited to employee welcome programmes and executive travel gifting.",
    specifications: [{ label: "Laptop fit", value: "Up to 15.6 in" }, { label: "Material", value: "Water-resistant polyester" }, { label: "Capacity", value: "Approx. 22 L" }, { label: "Colours", value: "Black, navy, charcoal" }],
    customizationOptions: ["Embroidered logo", "Woven label", "Rubber patch", "Custom zip pull"] }),
  p({ id: "prod-07", name: "Wireless Bluetooth Earbuds", slug: "wireless-bluetooth-earbuds", categorySlug: "tech-electronics", image: img("products", "bluetooth-earbuds"), isFeatured: false, moq: 100,
    shortDescription: "True-wireless earbuds with a compact charging case and a brandable lid.",
    description: "True-wireless earbuds in a compact charging case with a brandable lid surface. A well-received technology gift for staff recognition and client appreciation.",
    specifications: [{ label: "Connectivity", value: "Bluetooth 5.x" }, { label: "Playtime", value: "Up to 5 h (case extends)" }, { label: "Charging", value: "USB-C" }, { label: "Case", value: "Gloss or matte finish" }],
    customizationOptions: ["Case logo print", "Laser engraving", "Branded gift box"] }),
  p({ id: "prod-08", name: "Customized Travel Mug", slug: "customized-travel-mug", categorySlug: "drinkware", image: img("products", "travel-mug"), isFeatured: false, moq: 100,
    shortDescription: "Leak-resistant insulated mug built for the daily commute.",
    description: "A leak-resistant insulated travel mug with a push-lid and a comfortable grip. Consistently popular for staff gifting and event giveaways.",
    specifications: [{ label: "Capacity", value: "400 ml" }, { label: "Material", value: "Stainless steel body" }, { label: "Lid", value: "Leak-resistant, push-to-seal" }, { label: "Fits", value: "Most car cup holders" }],
    customizationOptions: ["Laser engraving", "Full-wrap print", "Colour options"] }),
  p({ id: "prod-09", name: "Employee Welcome Kit", slug: "employee-welcome-kit", categorySlug: "gift-sets-hampers", image: img("products", "welcome-kit"), isFeatured: true, moq: 25,
    shortDescription: "A boxed onboarding set that makes a new hire feel expected on day one.",
    description: "A boxed onboarding set combining apparel, drinkware and stationery, packed to make a new hire's first day memorable. Components are selected to match your brand and budget.",
    specifications: [{ label: "Typical contents", value: "Cap, towel, bottle, notebook (configurable)" }, { label: "Packaging", value: "Branded carton with tissue" }, { label: "Personalisation", value: "Name card per recipient" }],
    customizationOptions: ["Fully configurable contents", "Branded carton", "Per-recipient name cards", "Welcome letter insert"] }),
  p({ id: "prod-10", name: "Corporate Hoodie", slug: "corporate-hoodie", categorySlug: "apparel-wearables", image: img("products", "corporate-hoodie"), isFeatured: false, moq: 50,
    shortDescription: "Heavyweight brushed-fleece hoodie with a clean, modern cut.",
    description: "A heavyweight brushed-fleece hoodie with a relaxed modern cut, suited to team uniforms, campaign crews and staff apparel programmes.",
    specifications: [{ label: "Fabric", value: "Cotton-rich fleece, 320 gsm (sample)" }, { label: "Sizes", value: "XS – 3XL" }, { label: "Fit", value: "Relaxed unisex" }],
    customizationOptions: ["Embroidery", "Screen print", "Woven neck label"] }),
  p({ id: "prod-11", name: "Branded Canvas Tote Bag", slug: "branded-canvas-tote-bag", categorySlug: "bags-accessories", image: img("products", "canvas-tote"), isFeatured: false, moq: 200,
    shortDescription: "A durable cotton canvas tote with generous print space.",
    description: "A durable cotton canvas tote with long handles and generous print space. A reusable, high-exposure choice for conferences, retail activations and exhibitions.",
    specifications: [{ label: "Material", value: "Cotton canvas, 280 gsm (sample)" }, { label: "Size", value: "38 × 42 cm" }, { label: "Handles", value: "70 cm self-fabric" }],
    customizationOptions: ["Screen print", "Embroidery", "Inside pocket"] }),
  p({ id: "prod-12", name: "Executive Desk Organizer", slug: "executive-desk-organizer", categorySlug: "corporate-stationery", image: img("products", "desk-organizer"), isFeatured: false, moq: 50,
    shortDescription: "A tidy multi-compartment organiser for pens, cards and devices.",
    description: "A multi-compartment desk organiser for pens, cards, notes and devices. It places your brand at eye level for a long time.",
    specifications: [{ label: "Material", value: "Wood / metal mesh (selectable)" }, { label: "Compartments", value: "5" }, { label: "Size", value: "Approx. 25 × 12 × 10 cm" }],
    customizationOptions: ["Laser engraving", "Metal logo plate", "Gift box"] }),
  p({ id: "prod-13", name: "Custom USB Drive", slug: "custom-usb-drive", categorySlug: "tech-electronics", image: img("products", "usb-drive"), isFeatured: false, moq: 100,
    shortDescription: "A compact flash drive, optionally pre-loaded with your presentation files.",
    description: "A compact USB flash drive that can be pre-loaded with brochures, presentations or event material. A straightforward carrier for your content.",
    specifications: [{ label: "Capacity", value: "16 GB – 128 GB" }, { label: "Interface", value: "USB 3.0 / Type-C options" }, { label: "Pre-loading", value: "Available on request" }],
    customizationOptions: ["Logo print", "Laser engraving", "Data pre-loading", "Custom shape"] }),
  p({ id: "prod-14", name: "Corporate Conference Kit", slug: "corporate-conference-kit", categorySlug: "event-merchandise", image: img("products", "conference-kit"), isFeatured: true, moq: 100,
    shortDescription: "Lanyard, badge holder and essentials arranged for registration desks.",
    description: "Delegate essentials assembled for registration: lanyard, badge holder, notebook and pen, collated and packed per attendee so queues move quickly.",
    specifications: [{ label: "Typical contents", value: "Lanyard, badge holder, notebook, pen" }, { label: "Assembly", value: "Per-delegate packing available" }],
    customizationOptions: ["Printed lanyards", "Co-branded packaging", "Delegate-name labels"] }),
  p({ id: "prod-15", name: "Luxury Gift Hamper", slug: "luxury-gift-hamper", categorySlug: "gift-sets-hampers", image: img("products", "luxury-hamper"), isFeatured: true, moq: 25,
    shortDescription: "A generous, presentation-led hamper for festive and appreciation gifting.",
    description: "A generous hamper presented in a crate or basket with curated contents for festive seasons and key client appreciation moments. Contents are tailored to the occasion and the recipient.",
    specifications: [{ label: "Presentation", value: "Crate or basket with filler" }, { label: "Contents", value: "Tailored to occasion" }, { label: "Delivery", value: "Gift-wrapped, delivery on request" }],
    customizationOptions: ["Custom contents", "Branded ribbon / tag", "Personal message card"] }),
  p({ id: "prod-16", name: "Engraved Crystal Award", slug: "engraved-crystal-award", categorySlug: "awards-recognition", image: img("products", "crystal-award"), isFeatured: true, moq: 5,
    shortDescription: "A faceted crystal award finished with precise engraving and a presentation case.",
    description: "A faceted crystal award on a polished base, finished with precise engraving. Designed for milestone, service and excellence recognition.",
    specifications: [{ label: "Material", value: "Optical crystal" }, { label: "Height", value: "18 – 25 cm (sample)" }, { label: "Case", value: "Presentation box included" }],
    customizationOptions: ["Laser engraving", "Custom shape", "Individual names"] }),
  p({ id: "prod-17", name: "Branded Power Bank", slug: "branded-power-bank", categorySlug: "tech-electronics", image: img("products", "power-bank"), isFeatured: false, moq: 100,
    shortDescription: "A slim 10,000 mAh power bank with fast-charge output and cable.",
    description: "A slim power bank with fast-charge output and an integrated cable. A genuinely useful item that stays in a bag or briefcase.",
    specifications: [{ label: "Capacity", value: "10,000 mAh" }, { label: "Ports", value: "USB-C PD + USB-A" }, { label: "Body", value: "Aluminium alloy" }],
    customizationOptions: ["UV print", "Laser engraving", "Gift packaging"] }),
  p({ id: "prod-18", name: "Premium Business Card Holder", slug: "premium-business-card-holder", categorySlug: "corporate-stationery", image: img("products", "card-holder"), isFeatured: false, moq: 50,
    shortDescription: "A slim leather-finish holder that keeps cards pristine.",
    description: "A slim card holder with a leather finish and a fine-stitched edge, designed to keep cards crisp and carry your brand in every handshake.",
    specifications: [{ label: "Capacity", value: "Approx. 20 cards" }, { label: "Material", value: "PU / genuine leather options" }, { label: "Size", value: "10 × 6.5 cm" }],
    customizationOptions: ["Debossed logo", "Foil stamping", "Initials"] }),
  p({ id: "prod-19", name: "Eco Jute Tote", slug: "eco-jute-tote", categorySlug: "bags-accessories", image: img("products", "jute-tote"), isFeatured: false, moq: 200,
    shortDescription: "A natural jute tote with a reinforced base and a personalisation-friendly face.",
    description: "A natural jute tote with a reinforced base and a personalisation-friendly face, well-suited to sustainability-minded programmes and retail gifting.",
    specifications: [{ label: "Material", value: "Natural jute with cotton lining" }, { label: "Size", value: "40 × 35 × 12 cm" }],
    customizationOptions: ["Screen print", "Initial personalisation", "Contrast handles"] }),
];

/* -------------------------- Gifting collections -------------------------- */

export const demoCollections: GiftingCollection[] = [
  { id: "col-1", title: "Executive Essentials", slug: "executive-essentials", tagline: "Quiet, considered, senior.", description: "A restrained selection of premium stationery, leather goods and desk pieces for senior stakeholders and board-level appreciation.", audience: "Executives, board members, key accounts", image: img("products", "metal-pen"), suggestedProductSlugs: ["premium-executive-gift-box", "custom-leather-notebook", "branded-metal-pen", "premium-business-card-holder"], isDemo: true },
  { id: "col-2", title: "Employee Welcome Collection", slug: "employee-welcome", tagline: "A first day worth remembering.", description: "Onboarding kits that combine apparel, drinkware and stationery so a new hire starts with a sense of belonging.", audience: "HR teams, new joiners", image: img("products", "welcome-kit"), suggestedProductSlugs: ["employee-welcome-kit", "corporate-hoodie", "stainless-steel-vacuum-bottle", "premium-corporate-backpack"], isDemo: true },
  { id: "col-3", title: "Client Appreciation Collection", slug: "client-appreciation", tagline: "Thank you, made tangible.", description: "Thoughtful presentation sets and technology gifts that mark renewals, milestones and long-standing partnerships.", audience: "Account managers, sales leaders", image: img("gifting", "client-appreciation-wide"), suggestedProductSlugs: ["wireless-charging-station", "luxury-gift-hamper", "wireless-bluetooth-earbuds", "branded-power-bank"], isDemo: true },
  { id: "col-4", title: "Ramadan & Eid Collection", slug: "ramadan-eid", tagline: "Seasonal gifting, done with care.", description: "Seasonal hampers and presentation sets to mark Ramadan and Eid. Occasion-specific packages would be confirmed with Cloud Trek.", audience: "Corporate gifting, HR, procurement", image: img("gifting", "ramadan-eid"), suggestedProductSlugs: ["luxury-gift-hamper", "premium-executive-gift-box", "eco-jute-tote"], isDemo: true },
  { id: "col-5", title: "Conference & Events Collection", slug: "conference-events", tagline: "Built for registration desks.", description: "Delegate kits, lanyards and giveaways that are produced in volume and packed per attendee for smooth event delivery.", audience: "Event organisers, marketing teams", image: img("events", "conference-stage"), suggestedProductSlugs: ["corporate-conference-kit", "branded-canvas-tote-bag", "custom-usb-drive", "customized-travel-mug"], isDemo: true },
  { id: "col-6", title: "Premium Recognition Collection", slug: "premium-recognition", tagline: "Recognition that lasts.", description: "Crystal and metal awards with precise engraving for service milestones, excellence programmes and annual ceremonies.", audience: "Leadership, HR, ceremonies", image: img("products", "crystal-award"), suggestedProductSlugs: ["engraved-crystal-award", "premium-executive-gift-box", "executive-desk-organizer"], isDemo: true },
];

/* ----------------------------- Portfolio ----------------------------- */

export const demoProjects: PortfolioProject[] = [
  { id: "proj-1", title: "Corporate Employee Welcome Kits", slug: "employee-welcome-kits", category: "Corporate Gifting", isFeatured: true, isDemo: true, images: [img("products", "welcome-kit"), img("products", "corporate-hoodie")],
    description: "Onboarding kits: boxed sets that bring apparel, drinkware and stationery together with a personal welcome insert.",
    details: [{ label: "Scope", value: "Concept, sourcing, branding, packing" }, { label: "Techniques", value: "Embroidery, screen print" }] },
  { id: "proj-2", title: "Premium Executive Gift Collection", slug: "executive-gift-collection", category: "Corporate Gifting", isFeatured: true, isDemo: true, images: [img("products", "metal-pen"), img("products", "executive-gift-box")],
    description: "Senior-level gifting built around leather goods, a rigid presentation box and a hot-foil lid.",
    details: [{ label: "Scope", value: "Packaging, engraving, assembly" }, { label: "Techniques", value: "Hot-foil, debossing" }] },
  { id: "proj-3", title: "Conference Merchandise", slug: "conference-merchandise", category: "Events", isFeatured: true, isDemo: true, images: [img("events", "conference-stage"), img("products", "conference-kit")],
    description: "Merchandise for a multi-day conference: lanyards, delegate kits and totes coordinated across a single visual system.",
    details: [{ label: "Scope", value: "Design, production, kitting" }, { label: "Techniques", value: "Dye-sub, screen print" }] },
  { id: "proj-4", title: "Customized Drinkware Collection", slug: "customized-drinkware", category: "Promotional Products", isFeatured: false, isDemo: true, images: [img("products", "vacuum-bottle"), img("products", "travel-mug")],
    description: "A drinkware range in coordinated colourways with laser-engraved marks and gift-tube packaging.",
    details: [{ label: "Scope", value: "Product selection, engraving" }, { label: "Techniques", value: "Laser engraving, powder coat" }] },
  { id: "proj-5", title: "Corporate Recognition Awards", slug: "recognition-awards", category: "Awards", isFeatured: false, isDemo: true, images: [img("products", "crystal-award"), img("events", "conference-stage-portrait")],
    description: "An awards programme for an annual ceremony: crystal pieces with individual engraving and presentation cases.",
    details: [{ label: "Scope", value: "Award design, engraving, cases" }, { label: "Techniques", value: "Laser engraving" }] },
  { id: "proj-6", title: "Promotional Event Merchandise", slug: "event-merchandise-campaign", category: "Events & Advertising", isFeatured: false, isDemo: true, images: [img("events", "exhibition-counter"), img("advertising", "billboards-night-portrait")],
    description: "A campaign that connects an exhibition presence with outdoor advertising and take-home merchandise.",
    details: [{ label: "Scope", value: "Merchandise, display, outdoor media" }, { label: "Techniques", value: "Print, display fabrication" }] },
];

/* ----------------------------- Statistics ----------------------------- */

/** ILLUSTRATIVE values — not verified company figures. */
export const demoStats: Stat[] = [
  { value: 250, suffix: "+", label: "Promotional product options" },
  { value: 30, suffix: "+", label: "Gift categories" },
  { value: 100, suffix: "+", label: "Customization possibilities" },
  { value: 3, label: "Business divisions" },
];

/* ----------------------------- Enquiries ----------------------------- */

type E = Omit<Enquiry, "isDemo" | "id">;
const mk = (n: number, e: E): Enquiry => ({ ...e, id: `demo-enq-${n}`, isDemo: true });

export const demoEnquiries: Enquiry[] = [
  mk(1, { enquiryNumber: "DEMO-0001", customerName: "Sample Contact A", companyName: "Sample Company A", email: "a@example.com", phone: "+973 0000 0001", status: "new", createdAt: "2026-11-02T08:30:00Z", budgetRange: "BHD 1,000 – 2,500", deliveryDate: "2026-12-15", customizationRequirements: "Laser-engraved logo on bottle body.", notes: "Illustrative record.", items: [{ productId: "prod-03", productName: "Stainless Steel Vacuum Bottle", quantity: 300 }, { productId: "prod-04", productName: "Custom Leather Notebook", quantity: 300 }] }),
  mk(2, { enquiryNumber: "DEMO-0002", customerName: "Sample Contact B", companyName: "Sample Company B", email: "b@example.com", phone: "+973 0000 0002", status: "new", createdAt: "2026-11-01T11:10:00Z", budgetRange: "BHD 2,500 – 5,000", customizationRequirements: "Hot-foil logo on box lid, personalised cards.", items: [{ productId: "prod-01", productName: "Premium Executive Gift Box", quantity: 120 }] }),
  mk(3, { enquiryNumber: "DEMO-0003", customerName: "Sample Contact C", companyName: "Sample Company C", email: "c@example.com", phone: "+973 0000 0003", status: "contacted", createdAt: "2026-10-29T09:00:00Z", customizationRequirements: "Embroidery on left chest.", items: [{ productId: "prod-10", productName: "Corporate Hoodie", quantity: 80 }, { productId: "prod-06", productName: "Premium Corporate Backpack", quantity: 80 }] }),
  mk(4, { enquiryNumber: "DEMO-0004", customerName: "Sample Contact D", companyName: "Sample Company D", email: "d@example.com", phone: "+973 0000 0004", status: "quotation_sent", createdAt: "2026-10-24T13:45:00Z", budgetRange: "BHD 5,000+", items: [{ productId: "prod-14", productName: "Corporate Conference Kit", quantity: 500 }, { productId: "prod-11", productName: "Branded Canvas Tote Bag", quantity: 500 }] }),
  mk(5, { enquiryNumber: "DEMO-0005", customerName: "Sample Contact E", companyName: "Sample Company E", email: "e@example.com", phone: "+973 0000 0005", status: "approved", createdAt: "2026-10-18T07:20:00Z", items: [{ productId: "prod-16", productName: "Engraved Crystal Award", quantity: 25 }] }),
  mk(6, { enquiryNumber: "DEMO-0006", customerName: "Sample Contact F", companyName: "Sample Company F", email: "f@example.com", phone: "+973 0000 0006", status: "completed", createdAt: "2026-09-30T10:05:00Z", items: [{ productId: "prod-09", productName: "Employee Welcome Kit", quantity: 60 }] }),
  mk(7, { enquiryNumber: "DEMO-0007", customerName: "Sample Contact G", companyName: "Sample Company G", email: "g@example.com", phone: "+973 0000 0007", status: "completed", createdAt: "2026-09-12T12:00:00Z", items: [{ productId: "prod-15", productName: "Luxury Gift Hamper", quantity: 150 }] }),
  mk(8, { enquiryNumber: "DEMO-0008", customerName: "Sample Contact H", companyName: "Sample Company H", email: "h@example.com", phone: "+973 0000 0008", status: "cancelled", createdAt: "2026-09-04T15:30:00Z", items: [{ productId: "prod-13", productName: "Custom USB Drive", quantity: 200 }] }),
  mk(9, { enquiryNumber: "DEMO-0009", customerName: "Sample Contact I", companyName: "Sample Company I", email: "i@example.com", phone: "+973 0000 0009", status: "contacted", createdAt: "2026-10-27T08:10:00Z", items: [{ productId: "prod-02", productName: "Wireless Charging Station", quantity: 150 }, { productId: "prod-17", productName: "Branded Power Bank", quantity: 150 }] }),
  mk(10, { enquiryNumber: "DEMO-0010", customerName: "Sample Contact J", companyName: "Sample Company J", email: "j@example.com", phone: "+973 0000 0010", status: "new", createdAt: "2026-11-03T06:55:00Z", items: [{ productId: "prod-08", productName: "Customized Travel Mug", quantity: 400 }] }),
];

/* --------------------------- Dashboard charts --------------------------- */

/** ILLUSTRATIVE monthly enquiry volume — demo data only. */
export const demoMonthlyEnquiries = [
  { month: "May", enquiries: 6 },
  { month: "Jun", enquiries: 9 },
  { month: "Jul", enquiries: 7 },
  { month: "Aug", enquiries: 12 },
  { month: "Sep", enquiries: 15 },
  { month: "Oct", enquiries: 19 },
];

export const DEMO_LABEL = "Illustrative sample content";
