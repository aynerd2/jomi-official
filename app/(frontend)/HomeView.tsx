"use client";

import { useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  ArrowRight,
  Calendar,
  Heart,
  MapPin,
  Play,
  Quote,
  Radio,
} from "lucide-react";

import Newsletter from "@/components/Newsletter";
import { EventCard } from "@/components/EventCard";
import { LivestreamBand } from "@/components/LivestreamBand";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/ui/Reveal";
import { fadeInLeft, fadeInRight, fadeUp } from "@/lib/motion";

import { isUpcoming, type JomiEvent } from "@/content/events";
import type {
  AboutContent,
  HomeContent,
  LeaderView,
  SiteSettingsView,
} from "@/lib/cms";
import type { ServiceTime } from "@/content/site";

type HomeViewProps = {
  today: string;
  home: HomeContent;
  events: JomiEvent[];
  about: AboutContent;
  leaders: LeaderView[];
  serviceTimes: ServiceTime[];
  settings: SiteSettingsView;
};

export default function HomeView({
  today,
  home,
  events,
  about,
  leaders,
  serviceTimes,
  settings,
}: HomeViewProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  // A little drift on the hero portrait as the page scrolls away.
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, 60]);

  const nextEvents = useMemo(
    () => events.filter((event) => isUpcoming(event, today)).slice(0, 3),
    [events, today],
  );
  const weeklyServices = serviceTimes.filter((s) => s.cadence === "Weekly");
  const apostle = leaders[0];
  const { hero, sections } = home;
  const portrait = hero.portrait ?? apostle?.photo;

  return (
    <>

      <main>
        {/* Hero: type left, portrait right, on white */}
        <div ref={heroRef} className="relative overflow-hidden bg-white pt-28 md:pt-32">
          {/* A soft gold wash behind the portrait, nothing more. */}
          <div
            aria-hidden
            className="pointer-events-none absolute right-0 top-0 h-[640px] w-[55%] rounded-bl-[10rem] bg-gradient-to-br from-gold-50 via-gold-100/60 to-transparent"
          />

          <Container className="relative">
            <div className="grid items-center gap-12 pb-16 lg:grid-cols-2 lg:gap-16 lg:pb-24">
              <motion.div
                initial={reduceMotion ? undefined : "hidden"}
                animate={reduceMotion ? undefined : "visible"}
                variants={fadeInLeft}
              >
                <p className="eyebrow">{hero.eyebrow}</p>

                <h1 className="mt-5 text-display text-navy-900 text-balance">
                  <Headline text={hero.headline} />
                </h1>

                <p className="mt-6 max-w-xl text-body-lg text-ink-600">
                  {hero.lede}
                </p>

                <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                  <Link href={hero.primaryCta.href} className="btn-primary">
                    {hero.primaryCta.label}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href={hero.secondaryCta.href} className="btn-secondary">
                    <Play className="h-4 w-4" />
                    {hero.secondaryCta.label}
                  </Link>
                </div>

                {/* Service times, right where a first-time visitor looks. */}
                <dl className="mt-12 grid gap-6 border-t border-ink-100 pt-8 sm:grid-cols-2">
                  {weeklyServices.map((service) => (
                    <div key={service.name}>
                      <dt className="text-caption font-semibold uppercase tracking-[0.12em] text-ink-500">
                        {service.day}
                      </dt>
                      <dd className="mt-1 text-body font-medium text-navy-900">
                        {service.name}
                      </dd>
                      <dd className="text-body-sm text-ink-500">{service.time}</dd>
                    </div>
                  ))}
                </dl>
              </motion.div>

              <motion.div
                initial={reduceMotion ? undefined : "hidden"}
                animate={reduceMotion ? undefined : "visible"}
                variants={fadeInRight}
                className="relative order-first lg:order-none"
              >
                <motion.div
                  style={reduceMotion ? undefined : { y: portraitY }}
                  className="relative mx-auto aspect-[4/3] w-full max-w-md sm:aspect-[4/5]"
                >
                  <div className="absolute -right-5 -top-5 h-full w-full rounded-[2rem] border border-gold-300" />
                  <div className="relative h-full w-full overflow-hidden rounded-[2rem] bg-surface-sunken">
                    {portrait && (
                      <Image
                        src={portrait}
                        alt={
                          hero.portraitAlt ||
                          (apostle ? `${apostle.name}, ${apostle.role}` : "")
                        }
                        fill
                        priority
                        sizes="(max-width: 1024px) 100vw, 460px"
                        className="object-cover object-top"
                      />
                    )}
                  </div>

                  {apostle && (
                    <div className="absolute -bottom-6 left-4 rounded-2xl border border-ink-100 bg-white px-5 py-4 shadow-lift lg:-left-8">
                      <p className="text-caption text-ink-500">
                        {apostle.role.split(",")[0]}
                      </p>
                      <p className="text-body font-semibold text-navy-900">
                        {apostle.name}
                      </p>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            </div>
          </Container>
        </div>

        {/* Mission strip */}
        <Section tone="muted" className="!py-14">
          <StaggerGroup className="grid gap-10 md:grid-cols-3">
            {[
              { title: "Our Vision", body: about.vision, Icon: Heart },
              { title: "Our Mission", body: about.mission, Icon: Radio },
              {
                title: "Where We Meet",
                body: `${settings.address.city}, with centres across Nigeria.`,
                Icon: MapPin,
              },
            ].map(({ title, body, Icon }) => (
              <StaggerItem key={title} className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-gold-600 shadow-card">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-h4 text-navy-900">{title}</h3>
                  <p className="mt-1.5 text-body-sm text-ink-600">{body}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Section>

        {/* About */}
        <Section>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <Reveal variants={fadeInLeft} className="order-2 lg:order-1">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] bg-surface-sunken">
                {sections.about.image && (
                  <Image
                    src={sections.about.image}
                    alt={sections.about.imageAlt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="relative -mt-16 ml-auto mr-4 max-w-sm rounded-2xl border border-ink-100 bg-white p-6 shadow-lift">
                <Quote className="h-6 w-6 text-gold-500" />
                <blockquote className="mt-3 font-display text-body-lg italic leading-relaxed text-navy-900">
                  {about.featuredQuote}
                </blockquote>
              </div>
            </Reveal>

            <Reveal variants={fadeInRight} className="order-1 lg:order-2">
              <p className="eyebrow">{sections.about.eyebrow}</p>
              <h2 className="mt-3 text-h2 text-navy-900 text-balance">
                {sections.about.title}
              </h2>
              <div className="rule mt-5" />

              <div className="mt-6 space-y-5">
                {about.summary.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)} className="text-body text-ink-600">
                    {paragraph}
                  </p>
                ))}
              </div>

              <Link href="/about" className="btn-secondary mt-8">
                Read our story
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>
        </Section>

        {/* Upcoming events */}
        <Section tone="muted" id="events">
          <SectionHeading
            eyebrow={sections.events.eyebrow}
            title={sections.events.title}
            lede={sections.events.lede}
          />

          {nextEvents.length > 0 ? (
            <StaggerGroup className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {nextEvents.map((event) => (
                <StaggerItem key={event.id}>
                  <EventCard event={event} />
                </StaggerItem>
              ))}
            </StaggerGroup>
          ) : (
            <Reveal className="mx-auto mt-14 max-w-xl rounded-2xl border border-ink-100 bg-white p-10 text-center">
              <Calendar className="mx-auto h-8 w-8 text-gold-500" />
              <p className="mt-4 text-body text-ink-600">
                The next calendar has not been published yet. Subscribe below and
                we will let you know.
              </p>
            </Reveal>
          )}

          <Reveal className="mt-12 text-center">
            <Link href="/events" className="btn-secondary">
              View full calendar
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </Section>

        {/* Watch online — navy band, live embed once a stream URL is set */}
        <LivestreamBand
          settings={settings}
          serviceTimes={serviceTimes}
          heading={home.watchOnline.heading}
          body={home.watchOnline.body}
        />

        {/* Testimonies invitation */}
        <Section>
          <SectionHeading
            eyebrow={sections.testimonies.eyebrow}
            title={sections.testimonies.title}
            lede={sections.testimonies.lede}
          />
          <Reveal className="mt-10 text-center">
            <Link href="/testimonies" className="btn-primary">
              Share your testimony
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </Section>

        {/* Partner — navy band */}
        <Section tone="navy">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
            <Reveal variants={fadeUp} className="lg:col-span-7">
              <p className="eyebrow text-gold-400">Partnership</p>
              <h2 className="mt-3 text-h2 text-white text-balance">
                {home.partnerBand.heading}
              </h2>
              <div className="rule mt-5" />
              <p className="mt-6 max-w-xl text-body-lg text-navy-200">
                {home.partnerBand.body}
              </p>
            </Reveal>

            <Reveal variants={fadeUp} delay={0.1} className="lg:col-span-5">
              <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
                <Link href="/partner" className="btn-primary">
                  Give now
                </Link>
                <Link href="/partner" className="btn-inverse">
                  Become a partner
                </Link>
              </div>
            </Reveal>
          </div>
        </Section>

        <Newsletter
          title={sections.newsletter.title}
          lede={sections.newsletter.lede}
        />
      </main>
    </>
  );
}

/** The hero headline, with the *asterisked* words set in gold. */
function Headline({ text }: { text: string }) {
  return (
    <>
      {text.split("*").map((part, index) =>
        index % 2 === 1 ? (
          <span key={index} className="text-gold-600">
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}
