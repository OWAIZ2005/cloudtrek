import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Cloud Trek Admin" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  /* The admin interface is English-only: keep it left-to-right even if a visitor chose Arabic. */
  return <div dir="ltr" lang="en" className="min-h-screen flex-1 bg-offwhite">{children}</div>;
}
