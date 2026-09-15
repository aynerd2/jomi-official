import type { ReactNode } from "react";

import { Reveal } from "./Reveal";

type Tone = "white" | "muted" | "navy";

const toneClasses: Record<Tone, string> = {
  white: "bg-white",
  muted: "bg-surface-muted",
  navy: "bg-navy-900 text-navy-100",
};

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`container-custom ${className}`}>{children}</div>;
}

/**
 * A full-width page section. `tone` picks one of the three backgrounds in the
 * design system: white, off-white, or a deep navy accent band.
 */
export function Section({
  children,
  tone = "white",
  id,
  className = "",
  containerClassName = "",
}: {
  children: ReactNode;
  tone?: Tone;
  id?: string;
  className?: string;
  containerClassName?: string;
}) {
  return (
    <section
      id={id}
      className={`section ${toneClasses[tone]} ${id ? "scroll-mt-24" : ""} ${className}`}
    >
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}

/**
 * Eyebrow + title + lede, the standard way a section introduces itself.
 */
export function SectionHeading({
  eyebrow,
  title,
  lede,
  align = "center",
  tone = "light",
  as: Heading = "h2",
  className = "",
}: {
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  align?: "left" | "center";
  tone?: "light" | "dark";
  as?: "h1" | "h2" | "h3";
  className?: string;
}) {
  const isCentred = align === "center";

  return (
    <Reveal
      className={`${isCentred ? "mx-auto max-w-3xl text-center" : "max-w-3xl"} ${className}`}
    >
      {eyebrow && (
        <p className={`eyebrow ${tone === "dark" ? "text-gold-400" : ""}`}>
          {eyebrow}
        </p>
      )}
      <Heading
        className={`mt-3 text-h2 text-balance ${tone === "dark" ? "text-white" : "text-navy-900"}`}
      >
        {title}
      </Heading>
      <div className={`rule mt-5 ${isCentred ? "mx-auto" : ""}`} />
      {lede && (
        <p
          className={`mt-5 text-body-lg ${tone === "dark" ? "text-navy-200" : "text-ink-600"}`}
        >
          {lede}
        </p>
      )}
    </Reveal>
  );
}
