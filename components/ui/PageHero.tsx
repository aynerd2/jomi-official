import Image, { type StaticImageData } from "next/image";
import type { ReactNode } from "react";

import { Container } from "./Section";
import { Reveal } from "./Reveal";
import { fadeInLeft, fadeInRight } from "@/lib/motion";

/**
 * The standard header for interior pages: light, with an optional photo to the
 * right. Replaces the dark, photo-behind-a-black-scrim heroes each page used to
 * carry, along with their differently coloured glows.
 */
export function PageHero({
  eyebrow,
  title,
  lede,
  image,
  imageAlt,
  actions,
}: {
  eyebrow: string;
  title: ReactNode;
  lede?: string;
  image?: StaticImageData | string;
  imageAlt?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="relative overflow-hidden bg-white pt-28 md:pt-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-gold-50 to-transparent"
      />

      <Container className="relative">
        <div
          className={`grid items-center gap-12 pb-16 md:pb-20 ${
            image ? "lg:grid-cols-2 lg:gap-16" : ""
          }`}
        >
          <Reveal variants={fadeInLeft} className={image ? "" : "max-w-3xl"}>
            <p className="eyebrow">{eyebrow}</p>
            <h1 className="mt-4 text-h1 text-navy-900 text-balance">{title}</h1>
            <div className="rule mt-5" />
            {lede && (
              <p className="mt-6 max-w-2xl text-body-lg text-ink-600">{lede}</p>
            )}
            {actions && <div className="mt-8 flex flex-wrap gap-3">{actions}</div>}
          </Reveal>

          {image && (
            <Reveal variants={fadeInRight} className="hidden lg:block">
              <div className="relative aspect-[5/4] w-full overflow-hidden rounded-[2rem] bg-surface-sunken">
                <Image
                  src={image}
                  alt={imageAlt ?? ""}
                  fill
                  priority
                  sizes="(max-width: 1024px) 0px, 50vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
          )}
        </div>
      </Container>
    </div>
  );
}
