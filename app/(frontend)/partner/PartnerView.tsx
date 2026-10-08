"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Copy,
  CreditCard,
  Globe,
  Landmark,
  Users,
  Zap,
} from "lucide-react";

import { Section, SectionHeading } from "@/components/ui/Section";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/ui/Reveal";
import { StatCounter } from "@/components/ui/StatCounter";

import { GivingForm } from "./GivingForm";
import type { GivingContent, PageView, SiteSettingsView } from "@/lib/cms";

const impactIcons = [Globe, Users, Zap];

export default function PartnerView({
  giving,
  settings,
  page,
}: {
  giving: GivingContent;
  settings: SiteSettingsView;
  page: PageView<"partner">;
}) {
  const { hero, sections } = page;
  const {
    bankAccount,
    impactAreas,
    impactStats,
    partnerTiers,
    paystackEnabled,
    suggestedAmounts,
    purposes,
  } = giving;
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(bankAccount.accountNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked; the number is on screen to copy by hand.
    }
  };

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
              <Link href="#give" className="btn-primary">
                Give now
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/contact" className="btn-secondary">
                Talk to us
              </Link>
            </>
          }
        />

        {/* Where your seed goes */}
        <Section tone="muted">
          <SectionHeading
            eyebrow={sections.impactAreas.eyebrow}
            title={sections.impactAreas.title}
            lede={sections.impactAreas.lede}
          />

          <StaggerGroup className="mt-14 grid gap-6 md:grid-cols-3">
            {impactAreas.map((area, index) => {
              const Icon = impactIcons[index % impactIcons.length];
              return (
                <StaggerItem key={area.title}>
                  <div className="card h-full p-8 text-center">
                    <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold-50 text-gold-600">
                      <Icon className="h-6 w-6" />
                    </span>
                    <h3 className="mt-6 text-h4 text-navy-900">{area.title}</h3>
                    <p className="mt-3 text-body-sm text-ink-600">
                      {area.description}
                    </p>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerGroup>
        </Section>

        {/* Give */}
        <Section id="give">
          <SectionHeading
            eyebrow="How to give"
            title={paystackEnabled ? "Give online" : "Give by bank transfer"}
            lede={
              paystackEnabled
                ? "Card or bank transfer in Naira, handled securely by Paystack."
                : "Transfers in Naira to the ministry account below."
            }
          />

          {paystackEnabled && (
            <Reveal className="mx-auto mb-12 mt-12 max-w-2xl">
              <div className="card p-8 md:p-10">
                <GivingForm
                  suggestedAmounts={suggestedAmounts}
                  purposes={purposes}
                />
              </div>
            </Reveal>
          )}

          <Reveal className="mx-auto mt-12 max-w-2xl">
            {paystackEnabled && (
              <p className="mb-4 text-center text-body-sm text-ink-500">
                Prefer a direct transfer? Use the account below.
              </p>
            )}
            <div className="card overflow-hidden">
              <div className="grid gap-6 p-8 md:p-10">
                <Detail label="Bank name" value={bankAccount.bankName} />
                <Detail label="Account name" value={bankAccount.accountName} />

                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-caption font-semibold uppercase tracking-[0.12em] text-gold-600">
                      Account number ({bankAccount.currency})
                    </p>
                    <p className="mt-1 font-display text-h2 tabular-nums text-navy-900">
                      {bankAccount.accountNumber}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopy}
                    aria-label="Copy account number"
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-ink-200 text-gold-600 transition-all hover:-translate-y-0.5 hover:border-gold-500 hover:bg-gold-500 hover:text-white"
                  >
                    {copied ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <Copy className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <p aria-live="polite" className="sr-only">
                  {copied ? "Account number copied" : ""}
                </p>
              </div>

              <div className="border-t border-ink-100 bg-surface-muted px-8 py-6 md:px-10">
                <p className="text-body-sm text-ink-600">
                  Please email{" "}
                  <a
                    href={`mailto:${settings.emails.partnership}`}
                    className="font-semibold text-gold-700 hover:underline"
                  >
                    {settings.emails.partnership}
                  </a>{" "}
                  once you have given, so we can acknowledge your gift.
                </p>
              </div>
            </div>

            {!paystackEnabled && (
              <div className="mt-8 flex gap-4 rounded-2xl border border-ink-100 bg-white p-6">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold-50 text-gold-600">
                  <CreditCard className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-h4 text-navy-900">Giving online</h3>
                  <p className="mt-2 text-body-sm text-ink-600">
                    Online giving in Naira through Paystack is being set up.
                    Until it is live, the bank transfer above is the way to give.
                  </p>
                </div>
              </div>
            )}
          </Reveal>
        </Section>

        {/* Monthly partnership */}
        <Section tone="muted">
          <SectionHeading
            eyebrow={sections.monthly.eyebrow}
            title={sections.monthly.title}
            lede={sections.monthly.lede}
          />

          {partnerTiers.length === 0 ? (
            <Reveal className="mx-auto mt-12 max-w-xl text-center">
              <div className="card p-10">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold-50 text-gold-600">
                  <Landmark className="h-6 w-6" />
                </span>
                <p className="mt-6 text-body text-ink-600">
                  To join as a monthly partner, write to us and we will walk you
                  through it.
                </p>
                <Link href="/contact" className="btn-primary mt-8">
                  Talk to us about partnership
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </Reveal>
          ) : (
            <StaggerGroup className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {partnerTiers.map((tier) => (
                <StaggerItem key={tier.name}>
                  <div className="card h-full p-7">
                    <h3 className="text-h4 text-navy-900">{tier.name}</h3>
                    <p className="mt-1 text-body-sm font-semibold text-gold-600">
                      {tier.amount}
                    </p>
                    <ul className="mt-5 space-y-2.5">
                      {tier.benefits.map((benefit) => (
                        <li
                          key={benefit}
                          className="flex items-start gap-2 text-body-sm text-ink-600"
                        >
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </StaggerItem>
              ))}
            </StaggerGroup>
          )}
        </Section>

        {/* Impact — navy band with counters */}
        {impactStats.length > 0 && (
        <Section tone="navy">
          <SectionHeading
            eyebrow={sections.impactStats.eyebrow}
            title={sections.impactStats.title}
            lede={sections.impactStats.lede}
            tone="dark"
          />

          <StaggerGroup className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {impactStats.map((stat) => (
              <StaggerItem key={stat.label}>
                <StatCounter value={stat.value} label={stat.label} tone="dark" />
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Section>
        )}
      </main>
    </>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-caption font-semibold uppercase tracking-[0.12em] text-gold-600">
        {label}
      </p>
      <p className="mt-1 text-body-lg font-medium text-navy-900">{value}</p>
    </div>
  );
}
