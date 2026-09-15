"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Plus } from "lucide-react";

export type AccordionItem = {
  title: string;
  description: string;
};

/**
 * A list of disclosures. Uses real buttons with aria-expanded/aria-controls so
 * it works from the keyboard and reads correctly to a screen reader.
 */
export function Accordion({
  items,
  idPrefix,
  tone = "light",
  defaultOpen = 0,
}: {
  items: AccordionItem[];
  idPrefix: string;
  tone?: "light" | "dark";
  /** Index open on first render; pass -1 for all closed. */
  defaultOpen?: number;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const reduceMotion = useReducedMotion();
  const dark = tone === "dark";

  return (
    <div className={`divide-y ${dark ? "divide-white/10" : "divide-ink-100"}`}>
      {items.map((item, index) => {
        const isOpen = open === index;
        const panelId = `${idPrefix}-panel-${index}`;
        const buttonId = `${idPrefix}-button-${index}`;

        return (
          <div key={item.title}>
            <h3>
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? -1 : index)}
                className={`flex w-full items-center justify-between gap-6 py-5 text-left transition-colors ${
                  dark
                    ? "text-white hover:text-gold-400"
                    : "text-navy-900 hover:text-gold-600"
                }`}
              >
                <span className="font-display text-h4">{item.title}</span>
                <Plus
                  className={`h-5 w-5 shrink-0 transition-transform duration-300 ${
                    isOpen ? "rotate-45 text-gold-500" : ""
                  }`}
                />
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={reduceMotion ? undefined : { height: 0, opacity: 0 }}
                  animate={reduceMotion ? undefined : { height: "auto", opacity: 1 }}
                  exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p
                    className={`pb-6 pr-10 text-body ${dark ? "text-navy-200" : "text-ink-600"}`}
                  >
                    {item.description}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
