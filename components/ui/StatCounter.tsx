"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

import { isTodo } from "@/content/todo";

/**
 * Counts up to a number when scrolled into view.
 *
 * Values arrive as display strings ("25+", "500K+"), so the prefix and suffix
 * are preserved and only the numeric part animates. A value that is still a
 * TODO placeholder is rendered as-is, small and muted, with no animation.
 */
export function StatCounter({
  value,
  label,
  tone = "light",
}: {
  value: string;
  label: string;
  tone?: "light" | "dark";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduceMotion = useReducedMotion();
  const pending = isTodo(value);

  const match = value.match(/^([^\d]*)([\d.,]+)(.*)$/);
  const prefix = match?.[1] ?? "";
  const target = match ? Number(match[2].replace(/,/g, "")) : NaN;
  const suffix = match?.[3] ?? "";
  const canAnimate = !pending && match !== null && Number.isFinite(target);

  const [current, setCurrent] = useState(canAnimate ? 0 : target);

  useEffect(() => {
    if (!canAnimate || !inView) return;
    if (reduceMotion) {
      setCurrent(target);
      return;
    }

    const duration = 1400;
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      // Ease out, so the count decelerates into its final value.
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(target * eased);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [canAnimate, inView, reduceMotion, target]);

  const display = canAnimate
    ? `${prefix}${Math.round(current).toLocaleString()}${suffix}`
    : value;

  return (
    <div ref={ref} className="text-center">
      <div
        className={
          pending
            ? "text-caption text-ink-400"
            : `text-h1 font-display font-semibold tabular-nums ${
                tone === "dark" ? "text-gold-400" : "text-gold-600"
              }`
        }
      >
        {display}
      </div>
      <div
        className={`mt-2 text-caption font-medium uppercase tracking-[0.12em] ${
          tone === "dark" ? "text-navy-300" : "text-ink-500"
        }`}
      >
        {label}
      </div>
    </div>
  );
}
