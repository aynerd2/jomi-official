"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

import { Section } from "@/components/ui/Section";
import { PageHero } from "@/components/ui/PageHero";
import { StaggerGroup, StaggerItem } from "@/components/ui/Reveal";
import type { GalleryItem } from "@/lib/cms";

export default function GalleryView({ images }: { images: GalleryItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const reduceMotion = useReducedMotion();

  const close = useCallback(() => setOpenIndex(null), []);
  const step = useCallback(
    (direction: 1 | -1) =>
      setOpenIndex((prev) =>
        prev === null
          ? prev
          : (prev + direction + images.length) % images.length,
      ),
    [],
  );

  // Arrow keys and Escape drive the lightbox.
  useEffect(() => {
    if (openIndex === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [openIndex, close, step]);

  const active = openIndex === null ? null : images[openIndex];

  return (
    <>

      <main>
        <PageHero
          eyebrow="Gallery"
          title="Moments from the ministry"
          lede="Services, conferences and outreaches, as the Lord has led us across cities and nations."
        />

        <Section tone="muted">
          <StaggerGroup
            className="columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5"
            gap={0.04}
          >
            {images.filter((item) => item.image).map((item, index) => (
              <StaggerItem key={item.id} className="break-inside-avoid">
                <button
                  type="button"
                  onClick={() => setOpenIndex(index)}
                  className="group relative block w-full overflow-hidden rounded-2xl bg-surface-sunken"
                  aria-label={`Open image: ${item.caption}`}
                >
                  <Image
                    src={item.image!}
                    alt={item.caption}
                    width={1200}
                    height={900}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="h-auto w-full transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <span className="absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-navy-950/85 to-transparent p-5 text-left text-body-sm text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    {item.caption}
                  </span>
                </button>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Section>
      </main>

      {/* Lightbox */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={reduceMotion ? undefined : { opacity: 0 }}
            animate={reduceMotion ? undefined : { opacity: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            className="fixed inset-0 z-[70] flex flex-col items-center justify-center bg-navy-950/95 p-4"
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label={active.caption}
          >
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute right-5 top-5 rounded-full border border-white/20 p-2.5 text-white transition-colors hover:bg-white hover:text-navy-900"
            >
              <X className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                step(-1);
              }}
              aria-label="Previous image"
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full border border-white/20 p-3 text-white transition-colors hover:bg-white hover:text-navy-900 md:left-8"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <motion.div
              key={active.id}
              initial={reduceMotion ? undefined : { opacity: 0, scale: 0.98 }}
              animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="relative max-h-[80vh] w-full max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={active.image!}
                alt={active.caption}
                width={1600}
                height={1200}
                sizes="100vw"
                className="mx-auto h-auto max-h-[80vh] w-auto rounded-xl object-contain"
              />
            </motion.div>

            <p className="mt-5 text-center text-body-sm text-navy-200">
              {active.caption}
              <span className="ml-3 text-navy-400">
                {(openIndex ?? 0) + 1} / {images.length}
              </span>
            </p>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                step(1);
              }}
              aria-label="Next image"
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full border border-white/20 p-3 text-white transition-colors hover:bg-white hover:text-navy-900 md:right-8"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
