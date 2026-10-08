"use client";

import { useActionState, useState } from "react";

import { submitContact } from "@/app/(frontend)/actions";
import { initialFormState } from "@/lib/form-state";
import Link from "next/link";
import {
  ArrowRight,
  Clock,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Send,
  Twitter,
  Youtube,
} from "lucide-react";

import { Section, SectionHeading } from "@/components/ui/Section";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/ui/Reveal";
import { fadeInLeft, fadeInRight } from "@/lib/motion";

import type { Branch, ServiceTime } from "@/content/site";
import type { PageView, SiteSettingsView } from "@/lib/cms";

export default function ContactView({
  settings,
  serviceTimes,
  branches,
  fullAddress,
  page,
}: {
  settings: SiteSettingsView;
  serviceTimes: ServiceTime[];
  branches: Branch[];
  fullAddress: string;
  page: PageView<"contact">;
}) {
  const { hero, sections } = page;
  const [tab, setTab] = useState<"general" | "prayer">("general");
  const [state, formAction, pending] = useActionState(
    submitContact,
    initialFormState,
  );

  const socialLinks = [
    { name: "Facebook", href: settings.socials.facebook, Icon: Facebook },
    { name: "Instagram", href: settings.socials.instagram, Icon: Instagram },
    { name: "YouTube", href: settings.socials.youtube, Icon: Youtube },
    { name: "X", href: settings.socials.x, Icon: Twitter },
  ].filter((link) => Boolean(link.href));

  const mapQuery = encodeURIComponent(fullAddress);

  return (
    <>

      <main>
        <PageHero
          eyebrow={hero.eyebrow}
          title={hero.title}
          lede={hero.lede}
          image={hero.image}
          imageAlt={hero.imageAlt}
          actions={
            <>
              <Link href="#message" className="btn-primary">
                Send a message
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/branches" className="btn-secondary">
                Our centres
              </Link>
            </>
          }
        />

        {/* Contact details */}
        <Section tone="muted">
          <StaggerGroup className="grid gap-6 md:grid-cols-3">
            <StaggerItem>
              <div className="card h-full p-8">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-50 text-gold-600">
                  <Mail className="h-5 w-5" />
                </span>
                <h2 className="mt-6 text-h4 text-navy-900">Email us</h2>
                <ul className="mt-3 space-y-1.5">
                  <li>
                    <a
                      href={`mailto:${settings.emails.general}`}
                      className="text-body-sm text-ink-600 transition-colors hover:text-gold-600"
                    >
                      {settings.emails.general}
                    </a>
                  </li>
                  <li>
                    <a
                      href={`mailto:${settings.emails.partnership}`}
                      className="text-body-sm text-ink-600 transition-colors hover:text-gold-600"
                    >
                      {settings.emails.partnership}
                    </a>
                  </li>
                </ul>
              </div>
            </StaggerItem>

            {settings.phones.length > 0 && (
              <StaggerItem>
                <div className="card h-full p-8">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-50 text-gold-600">
                    <Phone className="h-5 w-5" />
                  </span>
                  <h2 className="mt-6 text-h4 text-navy-900">Call us</h2>
                  <ul className="mt-3 space-y-1.5">
                    {settings.phones.map((phone) => (
                      <li key={phone} className="text-body-sm text-ink-600">
                        {phone}
                      </li>
                    ))}
                  </ul>
                </div>
              </StaggerItem>
            )}

            <StaggerItem>
              <div className="card h-full p-8">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-50 text-gold-600">
                  <MapPin className="h-5 w-5" />
                </span>
                <h2 className="mt-6 text-h4 text-navy-900">Visit us</h2>
                <p className="mt-3 text-body-sm text-ink-600">{fullAddress}</p>
              </div>
            </StaggerItem>
          </StaggerGroup>
        </Section>

        {/* Service times */}
        <Section>
          <SectionHeading
            eyebrow={sections.serviceTimes.eyebrow}
            title={sections.serviceTimes.title}
            lede={sections.serviceTimes.lede}
          />

          <StaggerGroup className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {serviceTimes.map((service) => (
              <StaggerItem key={service.name}>
                <div className="card h-full p-6">
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full bg-gold-50 px-3 py-1 text-caption font-semibold text-gold-700">
                      {service.cadence}
                    </span>
                    <span className="text-caption text-ink-400">
                      {service.location}
                    </span>
                  </div>
                  <h3 className="mt-4 text-h4 text-navy-900">{service.name}</h3>
                  <p className="mt-3 flex items-center gap-2 text-body-sm text-ink-600">
                    <Clock className="h-4 w-4 shrink-0 text-gold-600" />
                    {service.day}, {service.time}
                  </p>
                  {service.note && (
                    <p className="mt-2 text-caption text-ink-500">{service.note}</p>
                  )}
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>

          <Reveal className="mt-12 text-center">
            <Link href="/branches" className="btn-secondary">
              Find a centre near you ({branches.length})
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </Section>

        {/* Form */}
        <Section tone="muted" id="message">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <Reveal variants={fadeInLeft} className="lg:col-span-5">
              <p className="eyebrow">Write to us</p>
              <h2 className="mt-3 text-h2 text-navy-900 text-balance">
                We read everything that comes in
              </h2>
              <div className="rule mt-5" />
              <p className="mt-5 text-body text-ink-600">
                Whether it is an enquiry, an invitation, or something you would
                like us to stand with you in prayer over, we would be glad to
                hear from you.
              </p>

              <div className="mt-10">
                <h3 className="text-caption font-semibold uppercase tracking-[0.12em] text-ink-500">
                  Follow the ministry
                </h3>
                <div className="mt-4 flex gap-3">
                  {socialLinks.map(({ name, href, Icon }) => (
                    <a
                      key={name}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${settings.shortName} on ${name}`}
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-ink-200 text-ink-600 transition-all hover:-translate-y-0.5 hover:border-gold-500 hover:bg-gold-500 hover:text-white"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal variants={fadeInRight} className="lg:col-span-7">
              <div className="card p-8 md:p-10">
                <div className="flex gap-2 rounded-full bg-surface-muted p-1.5">
                  {(["general", "prayer"] as const).map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setTab(option)}
                      aria-pressed={tab === option}
                      className={`flex-1 rounded-full py-2.5 text-body-sm font-medium transition-all ${
                        tab === option
                          ? "bg-white text-navy-900 shadow-card"
                          : "text-ink-500 hover:text-navy-900"
                      }`}
                    >
                      {option === "general" ? "General enquiry" : "Prayer request"}
                    </button>
                  ))}
                </div>

                <form action={formAction} className="mt-8 space-y-5">
                  {/* Which form was submitted, so prayer requests are filed as such. */}
                  <input type="hidden" name="kind" value={tab} />
                  <div className="grid gap-5 md:grid-cols-2">
                    <Field id="contact-name" name="name" label="Full name" required />
                    <Field
                      id="contact-email"
                      name="email"
                      label="Email address"
                      type="email"
                      required
                    />
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <Field id="contact-phone" name="phone" label="Phone number" type="tel" />
                    <Field id="contact-subject" name="subject" label="Subject" required />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-message"
                      className="block text-body-sm font-medium text-navy-900"
                    >
                      {tab === "general" ? "Message" : "Your prayer request"}
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={6}
                      required
                      className="mt-2 w-full resize-none rounded-xl border border-ink-200 bg-white px-4 py-3 text-body-sm text-ink-800 transition-colors focus:border-gold-500 focus:outline-none"
                    />
                  </div>

                  {state.message && (
                    <p
                      role="status"
                      className={`rounded-xl border p-4 text-body-sm ${
                        state.status === "error"
                          ? "border-red-200 bg-red-50 text-red-800"
                          : "border-gold-200 bg-gold-50 text-ink-700"
                      }`}
                    >
                      {state.message}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={pending}
                    className="btn-primary w-full"
                  >
                    <Send className="h-4 w-4" />
                    {pending ? "Sending..." : "Send message"}
                  </button>
                </form>
              </div>
            </Reveal>
          </div>
        </Section>

        {/* Map */}
        <Reveal>
          <div className="h-[420px] w-full border-t border-ink-100">
            <iframe
              width="100%"
              height="100%"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(fullAddress)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
              title={`Map of ${fullAddress}`}
              loading="lazy"
              style={{ border: 0 }}
            />
          </div>
        </Reveal>
      </main>
    </>
  );
}

function Field({
  id,
  name,
  label,
  type = "text",
  required,
}: {
  id: string;
  name: string;
  label: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-body-sm font-medium text-navy-900">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        className="mt-2 w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-body-sm text-ink-800 transition-colors focus:border-gold-500 focus:outline-none"
      />
    </div>
  );
}
