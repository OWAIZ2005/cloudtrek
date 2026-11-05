/**
 * Editable marketing content. Each item keeps its English fields and an `ar`
 * object with Arabic overrides; use `localize` / `localizeAll` from "@/i18n/localize".
 * Statements here avoid unverified claims about Cloud Trek (no dates, clients,
 * certifications or capacities).
 */
import type { WithAr } from "@/i18n/localize";

export interface Division {
  slug: string;
  title: string;
  short: string;
  description: string;
  image: string;
  imageWide: string;
  href: string;
  cta: string;
  points: string[];
}

export const divisions: WithAr<Division>[] = [
  {
    slug: "promotional-products",
    title: "Promotional Products & Corporate Gifting",
    short: "Branded merchandise and curated gifts, from a single notebook to a thousand-piece programme.",
    description: "Customised promotional products and corporate gift sets selected, branded and packed around your brief.",
    image: "/images/hero/gift-boxes-ribbon.jpg",
    imageWide: "/images/hero/gift-boxes-wide.jpg",
    href: "/products",
    cta: "Explore Products",
    points: ["Product sourcing and selection", "Branding and personalisation", "Gift sets, kits and hampers"],
    ar: {
      title: "المنتجات الترويجية والهدايا المؤسسية",
      short: "منتجات دعائية بعلامتك وهدايا منتقاة، من دفتر واحد إلى برنامج بآلاف القطع.",
      description: "منتجات ترويجية وهدايا مؤسسية مخصّصة، تُختار وتُطبع بعلامتك وتُجهَّز وفق طلبك.",
      cta: "استكشف المنتجات",
      points: ["اختيار المنتجات وتوريدها", "طباعة العلامة والتخصيص", "مجموعات الهدايا والحقائب والسلال"],
    },
  },
  {
    slug: "events-management",
    title: "Events Management",
    short: "Conferences, exhibitions and brand activations, with merchandise that fits the room.",
    description: "Support for planning and delivering corporate events, exhibitions and activations, aligned with your brand.",
    image: "/images/events/conference-stage-portrait.jpg",
    imageWide: "/images/events/conference-stage.jpg",
    href: "/services#events-management",
    cta: "Discover Events",
    points: ["Conferences and corporate events", "Exhibition presence", "Delegate kits and event merchandise"],
    ar: {
      title: "تنظيم الفعاليات",
      short: "مؤتمرات ومعارض وفعاليات علامة تجارية، مع منتجات تناسب أجواء الحدث.",
      description: "دعم في التخطيط للفعاليات المؤسسية والمعارض وتنفيذها، بما ينسجم مع علامتك.",
      cta: "اكتشف الفعاليات",
      points: ["المؤتمرات والفعاليات المؤسسية", "الحضور في المعارض", "حقائب الحضور ومنتجات الفعاليات"],
    },
  },
  {
    slug: "publicity-advertising",
    title: "Publicity & Advertising",
    short: "Campaign visibility across print, display and outdoor channels.",
    description: "Publicity and advertising support that connects campaign messaging with physical, visible brand touchpoints.",
    image: "/images/advertising/billboards-night-portrait.jpg",
    imageWide: "/images/advertising/billboards-night.jpg",
    href: "/services#advertising-publicity",
    cta: "See Advertising",
    points: ["Campaign concepts", "Print and display media", "Outdoor and branded environments"],
    ar: {
      title: "الدعاية والإعلان",
      short: "حضور للحملات عبر المطبوعات ووسائل العرض والإعلان الخارجي.",
      description: "دعم في الدعاية والإعلان يربط رسالة الحملة بنقاط تواصل ملموسة وظاهرة للعلامة التجارية.",
      cta: "اطّلع على الإعلان",
      points: ["أفكار الحملات", "المطبوعات ووسائل العرض", "الإعلان الخارجي والبيئات التي تحمل علامتك"],
    },
  },
];

export const giftingOccasions: WithAr<{ title: string; text: string; image: string }>[] = [
  { title: "Employee Welcome Kits", text: "Onboarding sets that make a new hire feel expected.", image: "/images/products/welcome-kit.jpg", ar: { title: "حقائب ترحيب الموظفين", text: "مجموعات استقبال تجعل الموظف الجديد يشعر بأنه متوقَّع." } },
  { title: "Client Appreciation Gifts", text: "A considered thank-you for renewals and milestones.", image: "/images/gifting/client-appreciation.jpg", ar: { title: "هدايا تقدير العملاء", text: "شكر مدروس عند التجديدات والمحطات المهمة." } },
  { title: "Executive Gifts", text: "Refined, understated pieces for senior stakeholders.", image: "/images/products/leather-notebook.jpg", ar: { title: "هدايا التنفيذيين", text: "قطع راقية هادئة لكبار أصحاب المصلحة." } },
  { title: "Event & Conference Kits", text: "Delegate essentials packed for smooth registration.", image: "/images/products/conference-kit.jpg", ar: { title: "حقائب الفعاليات والمؤتمرات", text: "أساسيات الحضور مجهّزة لتسجيل سلس." } },
  { title: "Festive Gifting", text: "Seasonal hampers for the moments your clients celebrate.", image: "/images/gifting/festive-boxes.jpg", ar: { title: "هدايا المواسم", text: "سلال موسمية للحظات التي يحتفل بها عملاؤك." } },
  { title: "Employee Recognition", text: "Awards and gifts that make recognition feel earned.", image: "/images/products/crystal-award.jpg", ar: { title: "تكريم الموظفين", text: "جوائز وهدايا تجعل التكريم يبدو مستحقاً." } },
];

export const bahrainOccasions: WithAr<{ key: string; label: string }>[] = [
  { key: "ramadan", label: "Ramadan", ar: { label: "رمضان" } },
  { key: "eid", label: "Eid", ar: { label: "العيد" } },
  { key: "national", label: "Bahrain National Day", ar: { label: "اليوم الوطني للبحرين" } },
];

/** Techniques are editable service content: confirm with Cloud Trek. */
export const techniques: WithAr<{ name: string; text: string; image: string }>[] = [
  { name: "Laser Engraving", text: "Precise, permanent marks on metal, wood and glass.", image: "/images/techniques/laser-pen.jpg", ar: { name: "النقش بالليزر", text: "علامات دقيقة دائمة على المعدن والخشب والزجاج." } },
  { name: "Screen Printing", text: "Bold, durable colour on textiles and bags.", image: "/images/techniques/screen-printing.jpg", ar: { name: "الطباعة الحريرية", text: "ألوان قوية ودائمة على الأقمشة والحقائب." } },
  { name: "UV Printing", text: "Full-colour detail on rigid and hard surfaces.", image: "/images/techniques/uv-swatches.jpg", ar: { name: "الطباعة بالأشعة فوق البنفسجية", text: "تفاصيل ملوّنة كاملة على الأسطح الصلبة." } },
  { name: "Embroidery", text: "Stitched logos with a premium, tactile finish.", image: "/images/techniques/embroidery.jpg", ar: { name: "التطريز", text: "شعارات مطرّزة بلمسة فاخرة ملموسة." } },
  { name: "Embossing & Debossing", text: "Raised or pressed marks on leather and card.", image: "/images/techniques/embossing.jpg", ar: { name: "الحفر البارز والغائر", text: "علامات بارزة أو غائرة على الجلد والكرتون." } },
  { name: "Customized Packaging", text: "Presentation boxes and sleeves made for your set.", image: "/images/techniques/packaging.jpg", ar: { name: "التغليف المخصّص", text: "علب عرض وأغلفة مصمّمة لمجموعتك." } },
];

export const processSteps: WithAr<{ title: string; text: string }>[] = [
  { title: "Explore Products", text: "Browse the catalogue and shortlist what suits your audience.", ar: { title: "استكشف المنتجات", text: "تصفّح الكتالوج واختر ما يناسب جمهورك." } },
  { title: "Share Your Requirements", text: "Tell us quantities, branding needs and timelines.", ar: { title: "شاركنا متطلباتك", text: "أخبرنا بالكميات واحتياجات العلامة والجدول الزمني." } },
  { title: "Receive a Quotation", text: "We respond with a clear, itemised quotation.", ar: { title: "استلم عرض السعر", text: "نردّ عليك بعرض سعر واضح ومفصّل." } },
  { title: "Approve Your Customization", text: "Review artwork and samples before production.", ar: { title: "اعتمد التخصيص", text: "راجع التصاميم والعيّنات قبل بدء الإنتاج." } },
  { title: "Production & Delivery", text: "Your order is produced, quality-checked and delivered.", ar: { title: "الإنتاج والتسليم", text: "يُنتَج طلبك ويُفحص ويُسلَّم إليك." } },
];

export const whyPoints: WithAr<{ title: string; text: string }>[] = [
  { title: "Tailored Branding Solutions", text: "Products are customised around your identity, not a template.", ar: { title: "حلول علامة تجارية مفصّلة", text: "تُخصَّص المنتجات حول هويتك، لا وفق قالب جاهز." } },
  { title: "Diverse Product Selection", text: "From stationery to technology to apparel, in one conversation.", ar: { title: "تشكيلة منتجات متنوعة", text: "من القرطاسية إلى التقنية والملابس، في حوار واحد." } },
  { title: "Corporate Gifting Expertise", text: "A focus on gifting that suits business relationships.", ar: { title: "خبرة في الهدايا المؤسسية", text: "تركيز على إهداء يناسب علاقات الأعمال." } },
  { title: "Personalised Service", text: "A direct line to people who understand your brief.", ar: { title: "خدمة شخصية", text: "تواصل مباشر مع من يفهم متطلباتك." } },
  { title: "Business-focused Solutions", text: "Quotation-led, volume-aware, built for organisations.", ar: { title: "حلول موجّهة للأعمال", text: "تعتمد عروض الأسعار وتراعي الكميات، ومبنية للمؤسسات." } },
];

export const values: WithAr<{ title: string; text: string }>[] = [
  { title: "Craft", text: "Details are the difference between merchandise and a memorable gift.", ar: { title: "الإتقان", text: "التفاصيل هي الفرق بين منتج دعائي وهدية لا تُنسى." } },
  { title: "Clarity", text: "Straightforward quotations and honest timelines.", ar: { title: "الوضوح", text: "عروض أسعار مباشرة وجداول زمنية صادقة." } },
  { title: "Partnership", text: "We treat every brief as a long-term relationship.", ar: { title: "الشراكة", text: "نتعامل مع كل طلب على أنه علاقة طويلة الأمد." } },
  { title: "Consistency", text: "Your brand should look the same on every object.", ar: { title: "الاتساق", text: "ينبغي أن تظهر علامتك بالأسلوب نفسه على كل منتج." } },
];

export interface ServiceBlock {
  id: string;
  n: string;
  title: string;
  text: string;
  points: string[];
  images: string[];
  ctaHref: string;
  ctaLabel: string;
}

export const services: WithAr<ServiceBlock>[] = [
  {
    id: "promotional-products", n: "01", title: "Promotional Products & Merchandise",
    text: "We help you choose the right products for your audience, then customise, produce and pack them. From a single executive gift to large staff and event programmes.",
    points: ["Product sourcing and selection", "Branding and personalisation", "Gift sets, kits and hampers", "Packaging and delivery coordination"],
    images: ["/images/products/corporate-backpack.jpg", "/images/products/welcome-kit.jpg"], ctaHref: "/products", ctaLabel: "Explore Products",
    ar: { title: "المنتجات الترويجية والبضائع الدعائية", text: "نساعدك على اختيار المنتجات المناسبة لجمهورك، ثم نخصّصها وننتجها ونجهّزها. من هدية تنفيذية واحدة إلى برامج كبيرة للموظفين والفعاليات.", points: ["اختيار المنتجات وتوريدها", "طباعة العلامة والتخصيص", "مجموعات الهدايا والحقائب والسلال", "التغليف وتنسيق التسليم"], ctaLabel: "استكشف المنتجات" },
  },
  {
    id: "events-management", n: "02", title: "Events Management",
    text: "Support for conferences, exhibitions and brand activations, with the merchandise, signage and details that make an event feel considered.",
    points: ["Corporate events and conferences", "Exhibition presence and displays", "Delegate kits and giveaways", "On-site brand touchpoints"],
    images: ["/images/events/conference-stage-portrait.jpg", "/images/events/exhibition-counter-portrait.jpg"], ctaHref: "/quote", ctaLabel: "Discuss an Event",
    ar: { title: "تنظيم الفعاليات", text: "دعم للمؤتمرات والمعارض وفعاليات العلامة التجارية، بالمنتجات واللوحات والتفاصيل التي تجعل الحدث يبدو متقناً.", points: ["الفعاليات والمؤتمرات المؤسسية", "الحضور والعرض في المعارض", "حقائب الحضور والتوزيعات", "نقاط حضور العلامة في موقع الحدث"], ctaLabel: "ناقش فعالية" },
  },
  {
    id: "advertising-publicity", n: "03", title: "Advertising & Publicity",
    text: "Campaign visibility that connects your message with print, display and outdoor presence, working alongside your gifting and events activity.",
    points: ["Campaign concepts", "Print and display media", "Outdoor and branded environments", "Publicity support"],
    images: ["/images/advertising/billboards-night-portrait.jpg", "/images/advertising/digital-billboards-portrait.jpg"], ctaHref: "/quote", ctaLabel: "Plan a Campaign",
    ar: { title: "الدعاية والإعلان", text: "حضور للحملات يربط رسالتك بالمطبوعات ووسائل العرض والإعلان الخارجي، ويعمل جنباً إلى جنب مع الهدايا والفعاليات.", points: ["أفكار الحملات", "المطبوعات ووسائل العرض", "الإعلان الخارجي والبيئات التي تحمل علامتك", "دعم الدعاية"], ctaLabel: "خطّط لحملة" },
  },
];
