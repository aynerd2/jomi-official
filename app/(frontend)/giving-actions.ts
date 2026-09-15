"use server";

import { redirect } from "next/navigation";

import { cmsEnabled, getPayloadClient } from "@/lib/payload";
import {
  initializeTransaction,
  newReference,
  paystackConfigured,
} from "@/lib/paystack";

import type { FormState } from "./actions";

/**
 * Starts a gift.
 *
 * Records the intent, asks Paystack for a checkout URL, then sends the donor
 * there. Nothing is marked as paid here: only the callback route does that,
 * and only after verifying the reference against Paystack.
 */
export async function startGiving(
  _prev: FormState,
  data: FormData,
): Promise<FormState> {
  if (!paystackConfigured || !cmsEnabled) {
    return {
      status: "error",
      message:
        "Online giving is not switched on yet. Please use the bank transfer details above.",
    };
  }

  const email = String(data.get("email") ?? "").trim();
  const name = String(data.get("name") ?? "").trim().slice(0, 200);
  const purpose = String(data.get("purpose") ?? "general").slice(0, 100);
  const frequency =
    String(data.get("frequency") ?? "once") === "monthly" ? "monthly" : "once";

  const raw = String(data.get("amount") ?? "").replace(/[^\d.]/g, "");
  const amount = Number(raw);

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { status: "error", message: "Please enter a valid email address." };
  }
  if (!Number.isFinite(amount) || amount < 100) {
    return {
      status: "error",
      message: "Please enter an amount of at least NGN 100.",
    };
  }

  const reference = newReference();
  const origin = process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:3000";

  try {
    const payload = await getPayloadClient();
    await payload.create({
      collection: "donations",
      data: {
        reference,
        status: "pending",
        amount,
        currency: "NGN",
        donorName: name || undefined,
        donorEmail: email,
        purpose,
        frequency,
      },
      overrideAccess: true,
    });
  } catch (error) {
    console.error("[giving] could not record the intent:", error);
    return {
      status: "error",
      message: "Something went wrong starting that gift. Please try again.",
    };
  }

  const result = await initializeTransaction({
    email,
    amount,
    reference,
    callbackUrl: `${origin}/partner/thank-you`,
    metadata: { purpose, frequency, name },
  });

  if (!result.ok) {
    return {
      status: "error",
      message:
        "We could not reach the payment provider. Please try again, or use the bank transfer details above.",
    };
  }

  // Off to Paystack's checkout. redirect() throws, so nothing after it runs.
  redirect(result.authorizationUrl);
}
