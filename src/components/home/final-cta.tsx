import Image from "next/image";
import { CtaLink } from "@/components/shared/cta";
import { FocusHeading } from "@/components/shared/focus-heading";
import { Reveal } from "@/components/shared/reveal";

export function FinalCta() {
  return (
    <section className="container-x pb-4 pt-8 lg:pt-12" aria-labelledby="cta-title">
      <div className="relative isolate overflow-hidden bg-navy">
        <Image
          src="/images/gifting/festive-boxes.jpg"
          alt=""
          fill
          sizes="100vw"
          className="-z-10 object-cover opacity-25 mix-blend-luminosity"
        />
        <div className="px-6 py-16 sm:px-12 sm:py-24 lg:px-20 lg:py-28">
          <Reveal>
            <p className="eyebrow mb-5 !text-white/60">Start a conversation</p>
            <FocusHeading id="cta-title" tone="light" text="Let’s Create Something Worth Remembering." className="display-2 max-w-3xl" />
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/75">
              Tell us about your audience, quantities and timeline. We will come back with a clear quotation.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <CtaLink href="/quote" variant="red">Start Your Project</CtaLink>
              <CtaLink href="/contact" variant="light">Talk to us</CtaLink>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
