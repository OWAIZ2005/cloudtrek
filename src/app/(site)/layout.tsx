import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { getLocale } from "@/i18n/get-locale";
import { getDictionary } from "@/i18n/dictionaries";

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  return (
    <>
      <Header dict={dict} locale={locale} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer dict={dict} />
    </>
  );
}
