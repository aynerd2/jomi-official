import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarDays, Mail, MapPin } from "lucide-react";

import { Section } from "@/components/ui/Section";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { fadeInLeft, fadeInRight } from "@/lib/motion";
import { getBranch, getBranches, getServiceTimes, getSiteSettings } from "@/lib/cms";

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const branches = await getBranches();
  return branches.map((branch) => ({ slug: branch.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const branch = await getBranch(slug);
  if (!branch) return { title: "Centre not found" };

  return {
    title: `${branch.city} Centre`,
    description: branch.description,
  };
}

export default async function BranchPage({ params }: Params) {
  const { slug } = await params;
  const [branch, serviceTimes, settings] = await Promise.all([
    getBranch(slug),
    getServiceTimes(),
    getSiteSettings(),
  ]);
  if (!branch) notFound();

  // The recurring gatherings that meet in this city.
  const localServices = serviceTimes.filter(
    (service) => service.location === branch.city,
  );
  const addressKnown = Boolean(branch.address);

  return (
    <>

      <main>
        <PageHero
          eyebrow={branch.isHeadquarters ? "Headquarters" : "Our centres"}
          title={`${branch.city} Centre`}
          lede={branch.description}
          actions={
            <>
              <Link href="/contact" className="btn-primary">
                Plan your visit
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/branches" className="btn-secondary">
                <ArrowLeft className="h-4 w-4" />
                All centres
              </Link>
            </>
          }
        />

        <Section tone="muted">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal variants={fadeInLeft}>
              <div className="card h-full p-8">
                <h2 className="text-h3 text-navy-900">Find us</h2>
                <div className="rule mt-4" />

                <ul className="mt-6 space-y-5">
                  <li className="flex gap-4">
                    <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gold-600" />
                    <div>
                      <p className="text-body-sm font-medium text-navy-900">
                        {branch.city}, {branch.state}
                      </p>
                      <p
                        className={
                          addressKnown
                            ? "mt-1 text-body-sm text-ink-600"
                            : "mt-1 text-caption text-ink-400"
                        }
                      >
                        {branch.address}
                      </p>
                    </div>
                  </li>

                  <li className="flex gap-4">
                    <Mail className="mt-0.5 h-5 w-5 shrink-0 text-gold-600" />
                    <div>
                      <p className="text-body-sm font-medium text-navy-900">
                        Get in touch
                      </p>
                      <a
                        href={`mailto:${branch.contactEmail ?? settings.emails.general}`}
                        className="mt-1 block text-body-sm text-ink-600 hover:text-gold-600"
                      >
                        {branch.contactEmail ?? settings.emails.general}
                      </a>
                    </div>
                  </li>
                </ul>

                {addressKnown && (
                  <div className="mt-8 aspect-[4/3] w-full overflow-hidden rounded-2xl border border-ink-100">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(branch.address)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                      title={`Map of the ${branch.city} centre`}
                      loading="lazy"
                      style={{ border: 0 }}
                    />
                  </div>
                )}
              </div>
            </Reveal>

            <Reveal variants={fadeInRight}>
              <div className="card h-full p-8">
                <h2 className="text-h3 text-navy-900">What meets here</h2>
                <div className="rule mt-4" />

                {localServices.length > 0 && (
                  <ul className="mt-6 space-y-4">
                    {localServices.map((service) => (
                      <li
                        key={service.name}
                        className="flex items-start justify-between gap-4 border-b border-ink-100 pb-4 last:border-0"
                      >
                        <div>
                          <p className="text-body font-medium text-navy-900">
                            {service.name}
                          </p>
                          <p className="mt-0.5 text-caption uppercase tracking-[0.1em] text-ink-400">
                            {service.cadence}
                          </p>
                        </div>
                        <p className="shrink-0 text-body-sm text-gold-700">
                          {service.day}, {service.time}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}

                <h3 className="mt-8 text-caption font-semibold uppercase tracking-[0.12em] text-ink-500">
                  Gatherings and outreaches
                </h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {branch.gatherings.map((gathering) => (
                    <li
                      key={gathering}
                      className="rounded-full bg-surface-muted px-3.5 py-1.5 text-body-sm text-ink-600"
                    >
                      {gathering}
                    </li>
                  ))}
                </ul>

                <Link href="/events" className="btn-secondary mt-8">
                  <CalendarDays className="h-4 w-4" />
                  See the calendar
                </Link>
              </div>
            </Reveal>
          </div>
        </Section>
      </main>
    </>
  );
}
