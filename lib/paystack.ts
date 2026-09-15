/**
 * Paystack, server side only.
 *
 * The secret key never leaves the server, and card details never reach this
 * application: a gift is initialised here, the donor is sent to Paystack's own
 * checkout, and Paystack sends them back to the callback route, which verifies
 * the reference against the API before recording anything as paid.
 */
const PAYSTACK_API = "https://api.paystack.co";

export const paystackConfigured = Boolean(process.env.PAYSTACK_SECRET_KEY);

type InitializeArgs = {
  email: string;
  /** Naira. Converted to kobo for Paystack. */
  amount: number;
  reference: string;
  callbackUrl: string;
  metadata?: Record<string, unknown>;
};

type InitializeResult =
  | { ok: true; authorizationUrl: string }
  | { ok: false; error: string };

export async function initializeTransaction({
  email,
  amount,
  reference,
  callbackUrl,
  metadata,
}: InitializeArgs): Promise<InitializeResult> {
  if (!paystackConfigured) {
    return { ok: false, error: "Paystack is not configured." };
  }

  try {
    const response = await fetch(`${PAYSTACK_API}/transaction/initialize`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount: Math.round(amount * 100), // kobo
        reference,
        currency: "NGN",
        callback_url: callbackUrl,
        metadata,
      }),
      cache: "no-store",
    });

    const body = (await response.json()) as {
      status?: boolean;
      message?: string;
      data?: { authorization_url?: string };
    };

    if (!response.ok || !body.status || !body.data?.authorization_url) {
      return { ok: false, error: body.message ?? "Paystack rejected the request." };
    }

    return { ok: true, authorizationUrl: body.data.authorization_url };
  } catch (error) {
    console.error("[paystack] initialize failed:", error);
    return { ok: false, error: "Could not reach Paystack." };
  }
}

export type VerifiedTransaction = {
  status: "success" | "failed" | "abandoned" | "pending";
  /** Naira. */
  amount: number;
  paidAt?: string;
  email?: string;
};

export async function verifyTransaction(
  reference: string,
): Promise<VerifiedTransaction | null> {
  if (!paystackConfigured) return null;

  try {
    const response = await fetch(
      `${PAYSTACK_API}/transaction/verify/${encodeURIComponent(reference)}`,
      {
        headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
        cache: "no-store",
      },
    );

    const body = (await response.json()) as {
      status?: boolean;
      data?: {
        status?: string;
        amount?: number;
        paid_at?: string;
        customer?: { email?: string };
      };
    };

    if (!response.ok || !body.status || !body.data) return null;

    const status = body.data.status;
    return {
      status:
        status === "success"
          ? "success"
          : status === "abandoned"
            ? "abandoned"
            : status === "failed"
              ? "failed"
              : "pending",
      amount: (body.data.amount ?? 0) / 100,
      paidAt: body.data.paid_at,
      email: body.data.customer?.email,
    };
  } catch (error) {
    console.error("[paystack] verify failed:", error);
    return null;
  }
}

/** A reference we can recognise in the Paystack dashboard. */
export function newReference(): string {
  const stamp = Date.now().toString(36);
  const random = Math.random().toString(36).slice(2, 8);
  return `jomi-${stamp}-${random}`;
}
