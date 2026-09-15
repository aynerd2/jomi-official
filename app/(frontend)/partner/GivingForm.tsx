"use client";

import { useActionState, useState } from "react";
import { ArrowRight } from "lucide-react";

import { initialFormState } from "@/lib/form-state";
import { startGiving } from "../giving-actions";

type Props = {
  suggestedAmounts: number[];
  purposes: { label: string; value: string }[];
};

const naira = (amount: number) => `NGN ${amount.toLocaleString()}`;

export function GivingForm({ suggestedAmounts, purposes }: Props) {
  const [state, formAction, pending] = useActionState(
    startGiving,
    initialFormState,
  );
  const [amount, setAmount] = useState("");

  return (
    <form action={formAction} className="space-y-6">
      <fieldset>
        <legend className="text-body-sm font-medium text-navy-900">
          How often
        </legend>
        <div className="mt-3 flex gap-2 rounded-full bg-surface-muted p-1.5">
          {[
            { value: "once", label: "One-off gift" },
            { value: "monthly", label: "Monthly" },
          ].map((option, index) => (
            <label
              key={option.value}
              className="flex-1 cursor-pointer text-center"
            >
              <input
                type="radio"
                name="frequency"
                value={option.value}
                defaultChecked={index === 0}
                className="peer sr-only"
              />
              <span className="block rounded-full py-2.5 text-body-sm font-medium text-ink-500 transition-all peer-checked:bg-white peer-checked:text-navy-900 peer-checked:shadow-card">
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {suggestedAmounts.length > 0 && (
        <fieldset>
          <legend className="text-body-sm font-medium text-navy-900">
            Amount
          </legend>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {suggestedAmounts.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setAmount(String(value))}
                aria-pressed={amount === String(value)}
                className={`rounded-xl border px-4 py-3 text-body-sm font-medium transition-all ${
                  amount === String(value)
                    ? "border-gold-500 bg-gold-50 text-navy-900"
                    : "border-ink-200 bg-white text-ink-600 hover:border-gold-300"
                }`}
              >
                {naira(value)}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      <div>
        <label
          htmlFor="giving-amount"
          className="block text-body-sm font-medium text-navy-900"
        >
          Or enter an amount (NGN)
        </label>
        <input
          id="giving-amount"
          name="amount"
          type="number"
          min={100}
          step={100}
          required
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0"
          className="mt-2 w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-body-sm text-ink-800 transition-colors focus:border-gold-500 focus:outline-none"
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label
            htmlFor="giving-name"
            className="block text-body-sm font-medium text-navy-900"
          >
            Your name
          </label>
          <input
            id="giving-name"
            name="name"
            type="text"
            className="mt-2 w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-body-sm text-ink-800 transition-colors focus:border-gold-500 focus:outline-none"
          />
        </div>
        <div>
          <label
            htmlFor="giving-email"
            className="block text-body-sm font-medium text-navy-900"
          >
            Email address
          </label>
          <input
            id="giving-email"
            name="email"
            type="email"
            required
            className="mt-2 w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-body-sm text-ink-800 transition-colors focus:border-gold-500 focus:outline-none"
          />
        </div>
      </div>

      {purposes.length > 0 && (
        <div>
          <label
            htmlFor="giving-purpose"
            className="block text-body-sm font-medium text-navy-900"
          >
            Towards
          </label>
          <select
            id="giving-purpose"
            name="purpose"
            className="mt-2 w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-body-sm text-ink-800 transition-colors focus:border-gold-500 focus:outline-none"
          >
            {purposes.map((purpose) => (
              <option key={purpose.value} value={purpose.value}>
                {purpose.label}
              </option>
            ))}
          </select>
        </div>
      )}

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
        {pending ? "Taking you to Paystack..." : "Give securely with Paystack"}
        <ArrowRight className="h-4 w-4" />
      </button>

      <p className="text-center text-caption text-ink-500">
        Payment is handled by Paystack. Your card details never touch this site.
      </p>
    </form>
  );
}
