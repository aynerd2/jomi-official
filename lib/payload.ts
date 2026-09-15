import configPromise from "@payload-config";
import { getPayload, type Payload } from "payload";

/**
 * Whether a CMS is actually configured.
 *
 * Until MONGODB_URI and PAYLOAD_SECRET are set, the public site falls back to
 * the seed content in content/. That keeps the site runnable during
 * development and means a missing environment variable cannot take the site
 * down; it does mean a misconfigured production deploy would serve seed
 * content, so both variables belong in the deploy environment.
 */
export const cmsEnabled = Boolean(
  process.env.MONGODB_URI && process.env.PAYLOAD_SECRET,
);

let cached: Promise<Payload> | null = null;

/** The Local API client. Reused across requests, as Payload recommends. */
export function getPayloadClient(): Promise<Payload> {
  if (!cached) {
    cached = getPayload({ config: configPromise });
  }
  return cached;
}

/**
 * Runs a CMS query, falling back to seed content if the CMS is not configured
 * or the query fails. A failure is logged rather than swallowed silently.
 */
export async function fromCms<T>(
  label: string,
  query: (payload: Payload) => Promise<T>,
  fallback: T,
): Promise<T> {
  if (!cmsEnabled) return fallback;

  try {
    const payload = await getPayloadClient();
    return await query(payload);
  } catch (error) {
    console.error(`[cms] ${label} failed, serving seed content instead:`, error);
    return fallback;
  }
}
