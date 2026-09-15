"use server";

import { cmsEnabled, getPayloadClient } from "@/lib/payload";
import type { FormState } from "@/lib/form-state";

/**
 * Form handling for the public site.
 *
 * Forms post to these server actions rather than to the Payload REST API, so
 * the collections stay closed to anonymous writes. Each action decides exactly
 * what gets stored, and testimonies are always created pending review.
 *
 * Nothing is emailed: submissions are worked through in the dashboard.
 */

const NOT_CONNECTED: FormState = {
  status: "error",
  message:
    "The website is not connected to its database yet, so nothing was sent. Please email us instead and we will respond.",
};

const FAILED: FormState = {
  status: "error",
  message:
    "Something went wrong sending that. Please try again, or email us if it keeps happening.",
};

function text(data: FormData, key: string, max = 5000): string {
  const value = data.get(key);
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

type SubmissionType =
  | "contact"
  | "prayer"
  | "registration"
  | "newsletter"
  | "message-request";

async function saveSubmission(data: {
  type: SubmissionType;
  name?: string;
  email: string;
  phone?: string;
  subject?: string;
  message?: string;
}): Promise<FormState> {
  if (!cmsEnabled) return NOT_CONNECTED;

  try {
    const payload = await getPayloadClient();
    await payload.create({
      collection: "submissions",
      data: { ...data, status: "new" },
      // Trusted server-side write: the collection itself stays closed to
      // anonymous requests.
      overrideAccess: true,
    });
    return { status: "success", message: "" };
  } catch (error) {
    console.error("[forms] could not save submission:", error);
    return FAILED;
  }
}

export async function submitContact(
  _prev: FormState,
  data: FormData,
): Promise<FormState> {
  const email = text(data, "email", 200);
  const message = text(data, "message");
  const kind = text(data, "kind", 20) === "prayer" ? "prayer" : "contact";

  if (!isEmail(email) || message.length < 2) {
    return { status: "error", message: "Please add a valid email and a message." };
  }

  const result = await saveSubmission({
    type: kind,
    name: text(data, "name", 200),
    email,
    phone: text(data, "phone", 60),
    subject: text(data, "subject", 200) || (kind === "prayer" ? "Prayer request" : "Enquiry"),
    message,
  });

  if (result.status !== "success") return result;
  return {
    status: "success",
    message:
      kind === "prayer"
        ? "Thank you. Your prayer request has reached us and we will be standing with you."
        : "Thank you. Your message has reached us and we will respond soon.",
  };
}

export async function submitRegistration(
  _prev: FormState,
  data: FormData,
): Promise<FormState> {
  const email = text(data, "email", 200);
  const firstName = text(data, "firstName", 100);
  const lastName = text(data, "lastName", 100);
  const event = text(data, "event", 200);

  if (!isEmail(email) || !firstName) {
    return { status: "error", message: "Please add your name and a valid email." };
  }

  const result = await saveSubmission({
    type: "registration",
    name: `${firstName} ${lastName}`.trim(),
    email,
    phone: text(data, "phone", 60),
    subject: event || "Event registration",
    message: text(data, "expectation"),
  });

  if (result.status !== "success") return result;
  return {
    status: "success",
    message: "You are registered. We look forward to seeing you.",
  };
}

export async function submitNewsletter(
  _prev: FormState,
  data: FormData,
): Promise<FormState> {
  const email = text(data, "email", 200);
  if (!isEmail(email)) {
    return { status: "error", message: "Please enter a valid email address." };
  }

  const result = await saveSubmission({
    type: "newsletter",
    email,
    subject: "Newsletter sign-up",
  });

  if (result.status !== "success") return result;
  return { status: "success", message: "You are on the list. Thank you." };
}

export async function submitMessageRequest(
  _prev: FormState,
  data: FormData,
): Promise<FormState> {
  const email = text(data, "email", 200);
  const topic = text(data, "topic", 300);

  if (!isEmail(email) || !topic) {
    return { status: "error", message: "Please add the topic and a valid email." };
  }

  const result = await saveSubmission({
    type: "message-request",
    email,
    subject: topic,
    message: topic,
  });

  if (result.status !== "success") return result;
  return {
    status: "success",
    message: "Thank you. We will look for that message and come back to you.",
  };
}

export async function submitTestimony(
  _prev: FormState,
  data: FormData,
): Promise<FormState> {
  if (!cmsEnabled) return NOT_CONNECTED;

  const name = text(data, "name", 200);
  const email = text(data, "email", 200);
  const location = text(data, "location", 200);
  const category = text(data, "category", 100);
  const testimony = text(data, "testimony", 8000);
  const consent = data.get("consent") === "on";

  if (!name || !location || !category || testimony.length < 20) {
    return {
      status: "error",
      message: "Please complete every field, and tell us a little more of the story.",
    };
  }
  if (!consent) {
    return {
      status: "error",
      message: "We need your permission before we can publish your testimony.",
    };
  }

  try {
    const payload = await getPayloadClient();
    await payload.create({
      collection: "testimonies",
      data: {
        name,
        email: isEmail(email) ? email : undefined,
        location,
        category,
        testimony,
        consentGiven: true,
        // Always pending: a testimony reaches the site only once someone at the
        // ministry approves it.
        reviewStatus: "pending",
        source: "website",
      },
      overrideAccess: true,
    });

    return {
      status: "success",
      message:
        "Thank you for sharing. Someone at the ministry will read it, and we will be in touch before anything is published.",
    };
  } catch (error) {
    console.error("[forms] could not save testimony:", error);
    return FAILED;
  }
}
