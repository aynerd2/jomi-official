"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

export type Stat = {
  label: string;
  hint: string;
  value: number;
  href: string;
  tone: "gold" | "navy";
};

export type Activity = {
  id: string;
  kind: string;
  title: string;
  href: string;
  at: string;
  /** Pre-formatted on the server, so the client never re-derives it from a different clock. */
  ago: string;
  created: boolean;
};

type Props = {
  greeting: string;
  name: string;
  today: string;
  stats: Stat[];
  recent: Activity[];
};

// Short and decelerating: this is a working tool, so motion settles quickly.
const EASE = [0.22, 1, 0.36, 1] as const;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
};

const rise: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.42, ease: EASE } },
};

export function DashboardWelcomeView({ greeting, name, today, stats, recent }: Props) {
  const reduce = useReducedMotion() ?? false;

  return (
    <motion.section
      className="jomi-dash"
      variants={container}
      initial={reduce ? false : "hidden"}
      animate="show"
      aria-label="Overview"
    >
      <motion.header className="jomi-dash__hero" variants={rise}>
        <p className="jomi-dash__date">{today}</p>
        <h1 className="jomi-dash__title">
          {greeting}
          {name ? `, ${name}` : ""}
        </h1>
        <p className="jomi-dash__lede">
          Here is what needs your attention on the JOMI website.
        </p>
      </motion.header>

      {stats.length > 0 && (
        <motion.ul className="jomi-dash__stats" variants={container}>
          {stats.map((stat) => (
            <motion.li key={stat.label} variants={rise}>
              <Link
                href={stat.href}
                className={`jomi-stat jomi-stat--${stat.tone}${
                  stat.tone === "gold" && stat.value > 0 ? " jomi-stat--attention" : ""
                }`}
              >
                <span className="jomi-stat__value">
                  <CountUp value={stat.value} reduce={reduce} />
                </span>
                <span className="jomi-stat__label">{stat.label}</span>
                <span className="jomi-stat__hint">{stat.hint}</span>
              </Link>
            </motion.li>
          ))}
        </motion.ul>
      )}

      {recent.length > 0 && (
        <motion.div className="jomi-dash__recent" variants={rise}>
          <h2 className="jomi-dash__heading">Recent activity</h2>
          <ul className="jomi-activity">
            {recent.map((item) => (
              <li key={`${item.kind}-${item.id}`}>
                <Link href={item.href} className="jomi-activity__row">
                  <span className="jomi-activity__kind">{item.kind}</span>
                  <span className="jomi-activity__title">{item.title}</span>
                  <time className="jomi-activity__time" dateTime={item.at}>
                    {item.created ? "Added" : "Edited"} {item.ago}
                  </time>
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      <motion.h2 className="jomi-dash__heading jomi-dash__heading--content" variants={rise}>
        All content
      </motion.h2>
    </motion.section>
  );
}

// Counts up from zero once, easing out into the final figure.
function CountUp({ value, reduce }: { value: number; reduce: boolean }) {
  const [shown, setShown] = useState(reduce ? value : 0);

  useEffect(() => {
    if (reduce || value === 0) {
      setShown(value);
      return;
    }
    const duration = Math.min(1100, 500 + value * 40);
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setShown(Math.round(value * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, reduce]);

  return <>{shown.toLocaleString("en-GB")}</>;
}

export default DashboardWelcomeView;
