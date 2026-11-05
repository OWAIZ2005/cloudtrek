import "server-only";

/** Email configuration. Secrets stay server-side; nothing here is exposed to the browser. */
export const emailConfig = () => ({
  apiKey: process.env.RESEND_API_KEY ?? "",
  /** Official recipient for every enquiry and contact message. */
  to: process.env.CLOUDTREK_ENQUIRY_EMAIL?.trim() || "aslam@cloudtrekbh.com",
  /** Must be an address on a Resend-verified domain, e.g. "Cloud Trek <enquiries@cloudtrekbh.com>". */
  from: process.env.CLOUDTREK_FROM_EMAIL?.trim() ?? "",
  customerConfirmation: process.env.CLOUDTREK_SEND_CUSTOMER_CONFIRMATION === "true",
  siteUrl: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
});

export const isEmailConfigured = () => {
  const c = emailConfig();
  return Boolean(c.apiKey && c.from && c.to);
};
