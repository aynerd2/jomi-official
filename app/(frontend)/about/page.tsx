import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Book, Globe, Heart, Instagram, Users } from "lucide-react";

import { Section, SectionHeading } from "@/components/ui/Section";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/ui/Reveal";
import { Accordion } from "@/components/ui/Accordion";
import { fadeInLeft, fadeInRight } from "@/lib/motion";

import historyPhoto from "@/assets/images/Jomi_Start.jpg";
import heroPhoto from "@/assets/images/apostle-and-pastor-ojo.webp";
import { getAbout, getLeadership, getMinistryArms } from "@/lib/cms";

export const metadata: Metadata = {
  title: "About",
  description:
    "The history, mandate, leadership, ministry arms and beliefs of Jide Ojo Ministry International.",
};

const mandateIcons = [Globe, Users, Heart];
const focusIcons = [Book, Users, Heart, Globe];

export default async function AboutPage() {
  const [about, leadership, ministryArms] = await Promise.all([
    getAbout(),
    getLeadership(),
    getMinistryArms(),
  ]);

  return (
    <>

      <main>
        <PageHero
          eyebrow="About us"
          title="Unveiling the glory of God"
          lede="An apostolic movement committed to revealing Christ and raising a triumphant generation in every nation."
          image={heroPhoto}
          imageAlt="Apostle Jide Ojo and Pastor Funmi Ojo"
          actions={
            <>
              <Link href="/contact" className="btn-primary">
                Plan your visit
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="#arms" className="btn-secondary">
                Our ministries
              </Link>
            </>
          }
        />

        {/* History */}
        <Section tone="muted">
          <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-20">
            <Reveal variants={fadeInLeft}>
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2rem]">
                <Image
                  src={historyPhoto}
                  alt="The early days of Jide Ojo Ministry International"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </Reveal>

            <Reveal variants={fadeInRight}>
              <p className="eyebrow">Our history</p>
              <h2 className="mt-3 text-h2 text-navy-900 text-balance">
                How JOMI was born
              </h2>
              <div className="rule mt-5" />

              <div className="mt-6 space-y-5">
                {about.history.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)} className="text-body text-ink-600">
                    {paragraph}
                  </p>
                ))}
              </div>
            </Reveal>
          </div>
        </Section>

        {/* Leadership */}
        <Section>
          <SectionHeading
            eyebrow="Leadership"
            title="Apostolic leadership"
            lede="Guided by the Spirit to shepherd God's people into their inheritance."
          />

          <StaggerGroup className="mx-auto mt-14 grid max-w-5xl gap-8 md:grid-cols-2">
            {leadership.map((leader) => (
              <StaggerItem key={leader.name}>
                <article className="card-interactive h-full overflow-hidden">
                  <div className="relative aspect-[4/5] w-full bg-surface-sunken">
                    {leader.photo && (
                      <Image
                        src={leader.photo}
                        alt={leader.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 45vw"
                        className="object-cover object-top"
                      />
                    )}
                  </div>
                  <div className="p-7">
                    <h3 className="text-h3 text-navy-900">{leader.name}</h3>
                    <p className="mt-1 text-body-sm font-semibold uppercase tracking-[0.1em] text-gold-600">
                      {leader.role}
                    </p>
                    <p className="mt-4 text-body-sm leading-relaxed text-ink-600">
                      {leader.bio}
                    </p>
                    {leader.instagram && (
                      <a
                        href={leader.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-5 inline-flex items-center gap-2 text-body-sm font-medium text-ink-500 transition-colors hover:text-gold-600"
                      >
                        <Instagram className="h-4 w-4" />
                        Follow on Instagram
                      </a>
                    )}
                  </div>
                </article>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Section>

        {/* Mandate — navy band */}
        <Section tone="navy">
          <SectionHeading
            eyebrow="Our mandate"
            title="What we are sent to do"
            tone="dark"
          />

          <StaggerGroup className="mt-14 grid gap-6 md:grid-cols-3">
            {about.mandate.map((pillar, index) => {
              const Icon = mandateIcons[index % mandateIcons.length];
              return (
                <StaggerItem key={pillar.title}>
                  <div className="h-full rounded-2xl border border-white/10 bg-white/5 p-8 transition-colors hover:border-gold-500/50">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-500/15 text-gold-400">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="mt-6 text-h4 text-white">{pillar.title}</h3>
                    <p className="mt-3 text-body-sm text-navy-200">
                      {pillar.description}
                    </p>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerGroup>
        </Section>

        {/* Ministry focus */}
        <Section>
          <SectionHeading
            eyebrow="Ministry focus"
            title="How we build the body of Christ"
          />

          <StaggerGroup className="mx-auto mt-14 grid max-w-5xl gap-x-12 gap-y-10 md:grid-cols-2">
            {about.ministryFocus.map((pillar, index) => {
              const Icon = focusIcons[index % focusIcons.length];
              return (
                <StaggerItem key={pillar.title} className="flex gap-5">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold-50 text-gold-600">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-h4 text-navy-900">{pillar.title}</h3>
                    <p className="mt-2 text-body-sm text-ink-600">
                      {pillar.description}
                    </p>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerGroup>
        </Section>

        {/* Ministry arms — anchors for the nav dropdown */}
        <Section tone="muted" id="arms">
          <SectionHeading
            eyebrow="Our ministries"
            title="The arms of JOMI"
            lede="The ministry serves through a number of arms, each with its own focus and gathering."
          />

          <StaggerGroup className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {ministryArms.map((arm) => (
              <StaggerItem key={arm.slug}>
                <div
                  id={arm.slug}
                  className="card h-full scroll-mt-28 p-6 transition-colors hover:border-gold-200"
                >
                  <h3 className="text-h4 text-navy-900">{arm.name}</h3>
                  {arm.fullName !== arm.name && (
                    <p className="mt-1 text-body-sm font-medium text-gold-600">
                      {arm.fullName}
                    </p>
                  )}
                  {arm.description && (
                    <p className="mt-3 text-body-sm text-ink-600">
                      {arm.description}
                    </p>
                  )}
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>

          <Reveal className="mt-12 text-center">
            <Link href="/events" className="btn-secondary">
              See when they meet
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </Section>

        {/* Beliefs and values */}
        <Section>
          <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
            <Reveal variants={fadeInLeft}>
              <p className="eyebrow">What we believe</p>
              <h2 className="mt-3 text-h2 text-navy-900">Our beliefs</h2>
              <div className="rule mt-5" />
              <div className="mt-6">
                <Accordion items={about.beliefs} idPrefix="belief" />
              </div>
            </Reveal>

            <Reveal variants={fadeInRight}>
              <p className="eyebrow">How we carry it</p>
              <h2 className="mt-3 text-h2 text-navy-900">Our core values</h2>
              <div className="rule mt-5" />
              <div className="mt-6">
                <Accordion items={about.values} idPrefix="value" />
              </div>
            </Reveal>
          </div>
        </Section>
      </main>
    </>
  );
}
