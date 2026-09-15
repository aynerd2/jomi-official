"use client";

import { Suspense, useActionState } from "react";

import { submitRegistration } from "@/app/(frontend)/actions";
import { initialFormState } from "@/lib/form-state";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CalendarCheck, Send } from "lucide-react";

import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import type { SiteSettingsView } from "@/lib/cms";

function RegisterForm({ settings }: { settings: SiteSettingsView }) {
  const searchParams = useSearchParams();
  const eventName = searchParams.get("event") || "an upcoming event";
  const [state, formAction, pending] = useActionState(
    submitRegistration,
    initialFormState,
  );

  return (
    <div className="card mx-auto max-w-2xl p-8 md:p-12">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-50 text-gold-600">
        <CalendarCheck className="h-5 w-5" />
      </span>

      <h1 className="mt-6 text-h2 text-navy-900 text-balance">
        Register for {eventName}
      </h1>
      <div className="rule mt-5" />
      <p className="mt-5 text-body text-ink-600">
        Tell us you are coming and we will be looking out for you.
      </p>

      <form action={formAction} className="mt-9 space-y-5">
        <input type="hidden" name="event" value={eventName} />
        <div className="grid gap-5 md:grid-cols-2">
          <Field id="register-first-name" name="firstName" label="First name" required />
          <Field id="register-last-name" name="lastName" label="Last name" required />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Field
            id="register-email"
            name="email"
            label="Email address"
            type="email"
            required
          />
          <Field
            id="register-phone"
            name="phone"
            label="Phone number"
            type="tel"
            required
          />
        </div>

        <div>
          <label
            htmlFor="register-expectation"
            className="block text-body-sm font-medium text-navy-900"
          >
            Prayer request or expectation (optional)
          </label>
          <textarea
            id="register-expectation"
            name="expectation"
            rows={4}
            placeholder="Share your expectations..."
            className="mt-2 w-full resize-none rounded-xl border border-ink-200 bg-white px-4 py-3 text-body-sm text-ink-800 placeholder-ink-400 transition-colors focus:border-gold-500 focus:outline-none"
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

        <button type="submit" disabled={pending} className="btn-primary w-full">
          <Send className="h-4 w-4" />
          {pending ? "Registering..." : "Complete registration"}
        </button>
      </form>
    </div>
  );
}

export default function RegisterView({ settings }: { settings: SiteSettingsView }) {
  return (
    <>

      <main className="pt-24">
        <Section tone="muted">
          <Reveal>
            <Suspense
              fallback={
                <p className="text-center text-body text-ink-500">
                  Loading form...
                </p>
              }
            >
              <RegisterForm settings={settings} />
            </Suspense>
          </Reveal>
        </Section>
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
