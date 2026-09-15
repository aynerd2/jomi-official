import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, CircleAlert } from "lucide-react";

import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { cmsEnabled, getPayloadClient } from "@/lib/payload";
import { verifyTransaction } from "@/lib/paystack";
import { getSiteSettings } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Thank you",
  robots: { index: false },
};

// Paystack sends the donor back here with ?reference=...
export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ reference?: string; trxref?: string }> };

export default async function ThankYouPage({ searchParams }: Props) {
  const params = await searchParams;
  const reference = params.reference ?? params.trxref;
  const settings = await getSiteSettings();

  // The gift is only treated as paid once Paystack itself confirms it. A
  // browser arriving here proves nothing on its own.
  let verified = false;
  let amount = 0;

  if (reference && cmsEnabled) {
    const transaction = await verifyTransaction(reference);

    if (transaction) {
      verified = transaction.status === "success";
      amount = transaction.amount;

      try {
        const payload = await getPayloadClient();
        const existing = await payload.find({
          collection: "donations",
          where: { reference: { equals: reference } },
          limit: 1,
          overrideAccess: true,
        });

        const record = existing.docs[0];
        if (record) {
          await payload.update({
            collection: "donations",
            id: record.id,
            data: {
              status: transaction.status,
              paidAt: transaction.paidAt,
              amount: transaction.amount || undefined,
            },
            overrideAccess: true,
          });
        }
      } catch (error) {
        console.error("[giving] could not update the donation record:", error);
      }
    }
  }

  return (
    <main className="pt-24">
      <Section tone="muted">
        <Reveal className="mx-auto max-w-xl text-center">
          <div className="card p-10">
            {verified ? (
              <>
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold-50 text-gold-600">
                  <CheckCircle2 className="h-7 w-7" />
                </span>
                <h1 className="mt-6 text-h2 text-navy-900">Thank you</h1>
                <div className="rule mx-auto mt-5" />
                <p className="mt-5 text-body text-ink-600">
                  Your gift{amount > 0 ? ` of NGN ${amount.toLocaleString()}` : ""}{" "}
                  has been received. Thank you for partnering with this ministry.
                </p>
                {reference && (
                  <p className="mt-4 text-caption text-ink-500">
                    Reference: {reference}
                  </p>
                )}
              </>
            ) : (
              <>
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-surface-sunken text-ink-500">
                  <CircleAlert className="h-7 w-7" />
                </span>
                <h1 className="mt-6 text-h2 text-navy-900">
                  We could not confirm that gift
                </h1>
                <div className="rule mx-auto mt-5" />
                <p className="mt-5 text-body text-ink-600">
                  If your account was debited, nothing is lost. Send us the
                  reference and we will trace it.
                </p>
                <p className="mt-4 text-body-sm text-ink-500">
                  <a
                    href={`mailto:${settings.emails.partnership}`}
                    className="font-semibold text-gold-700 hover:underline"
                  >
                    {settings.emails.partnership}
                  </a>
                  {reference ? ` · reference ${reference}` : ""}
                </p>
              </>
            )}

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/" className="btn-primary">
                Back to the site
              </Link>
              <Link href="/partner" className="btn-secondary">
                Giving page
              </Link>
            </div>
          </div>
        </Reveal>
      </Section>
    </main>
  );
}
