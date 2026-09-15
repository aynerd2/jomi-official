"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import type { ReactNode } from "react";

import { fadeUp, stagger } from "@/lib/motion";

const IN_VIEW_OPTIONS = { once: true, amount: 0.2 } as const;

/**
 * Reveals are driven by IntersectionObserver, which does not deliver callbacks
 * while a page is hidden (a background tab, an occluded window). Without a
 * fallback, anything on screen at mount could stay at opacity 0 indefinitely.
 * So: if the element is within the viewport shortly after mount, show it
 * regardless of what the observer has reported.
 */
function useShowFallback(ref: RefObject<HTMLElement | null>, inView: boolean) {
  const [forced, setForced] = useState(false);

  useEffect(() => {
    if (inView || forced) return;
    const timer = setTimeout(() => {
      const rect = ref.current?.getBoundingClientRect();
      if (rect && rect.top < window.innerHeight && rect.bottom > 0) {
        setForced(true);
      }
    }, 1200);
    return () => clearTimeout(timer);
  }, [ref, inView, forced]);

  return inView || forced;
}

type RevealProps = {
  children: ReactNode;
  /** Which movement to use. Defaults to a 24px fade up. */
  variants?: Variants;
  /** Seconds to wait before this element starts. */
  delay?: number;
  className?: string;
  id?: string;
  as?: "div" | "section" | "article" | "li" | "header";
};

/**
 * Reveals its children once, when scrolled into view (or straight away if they
 * start on screen). Renders statically for visitors who prefer reduced motion.
 */
export function Reveal({
  children,
  variants = fadeUp,
  delay = 0,
  className,
  id,
  as = "div",
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, IN_VIEW_OPTIONS);
  const show = useShowFallback(ref, inView);
  const reduceMotion = useReducedMotion();
  // The `as` union cannot resolve a single ref type, so narrow it here.
  const Component = motion[as] as typeof motion.div;

  if (reduceMotion) {
    const Static = as as "div";
    return (
      <Static ref={ref} className={className} id={id}>
        {children}
      </Static>
    );
  }

  return (
    <Component
      ref={ref}
      id={id}
      className={className}
      initial="hidden"
      animate={show ? "visible" : "hidden"}
      variants={variants}
      transition={{ delay }}
    >
      {children}
    </Component>
  );
}

type StaggerGroupProps = {
  children: ReactNode;
  className?: string;
  /** Seconds between each child. */
  gap?: number;
  as?: "div" | "ul" | "section";
};

/**
 * Wraps a grid or list so its children arrive one after another. Children
 * should be <StaggerItem>, or any motion element using the same variant names.
 */
export function StaggerGroup({
  children,
  className,
  gap = 0.06,
  as = "div",
}: StaggerGroupProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, IN_VIEW_OPTIONS);
  const show = useShowFallback(ref, inView);
  const reduceMotion = useReducedMotion();
  // The `as` union cannot resolve a single ref type, so narrow it here.
  const Component = motion[as] as typeof motion.div;

  if (reduceMotion) {
    const Static = as as "div";
    return (
      <Static ref={ref} className={className}>
        {children}
      </Static>
    );
  }

  return (
    <Component
      ref={ref}
      className={className}
      initial="hidden"
      animate={show ? "visible" : "hidden"}
      variants={stagger(gap)}
    >
      {children}
    </Component>
  );
}

export function StaggerItem({
  children,
  className,
  variants = fadeUp,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  variants?: Variants;
  as?: "div" | "li" | "article";
}) {
  const reduceMotion = useReducedMotion();
  // The `as` union cannot resolve a single ref type, so narrow it here.
  const Component = motion[as] as typeof motion.div;

  if (reduceMotion) {
    const Static = as as "div";
    return <Static className={className}>{children}</Static>;
  }

  return (
    <Component className={className} variants={variants}>
      {children}
    </Component>
  );
}
