"use client";

import { useActionState } from "react";
import { ArrowRight, Mail } from "lucide-react";

import { initialFormState, submitNewsletter } from "@/app/(frontend)/actions";

import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

export default function Newsletter() {
  const [state, formAction, pending] = useActionState(
    submitNewsletter,
    initialFormState,
  );

  return (
    <Section tone="muted">
      <Reveal className="mx-auto max-w-3xl text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-gold-600 shadow-card">
          <Mail className="h-5 w-5" />
        </span>

        <h2 className="mt-6 text-h2 text-navy-900 text-balance">
          Stay connected with the move of God
        </h2>
        <div className="rule mx-auto mt-5" />
        <p className="mt-5 text-body-lg text-ink-600">
          Be the first to hear about upcoming services, conferences and new
          releases from the ministry.
        </p>

        <form
          action={formAction}
          className="mx-auto mt-9 flex max-w-xl flex-col gap-3 sm:flex-row"
        >
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-email"
            name="email"
            type="email"
            required
            placeholder="Enter your email address"
            className="w-full flex-1 rounded-full border border-ink-200 bg-white px-6 py-3.5 text-body-sm text-ink-800 placeholder-ink-400 transition-colors focus:border-gold-500 focus:outline-none"
          />
          <button type="submit" disabled={pending} className="btn-primary shrink-0">
            {pending ? "Subscribing..." : "Subscribe"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        {/* The unsourced "Join 20,000+ believers worldwide" line was removed in
            Phase 1 rather than restated. */}
        {state.message && (
          <p
            role="status"
            className={`mx-auto mt-5 max-w-xl text-body-sm ${
              state.status === "error" ? "text-red-700" : "text-ink-600"
            }`}
          >
            {state.message}
          </p>
        )}
      </Reveal>
    </Section>
  );
}
