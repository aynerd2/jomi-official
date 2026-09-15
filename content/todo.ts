/**
 * Marker for content the client has not confirmed yet.
 *
 * Rules for this codebase:
 *  - Never invent a factual value (a phone number, a price, a headcount, a date).
 *    Use `TODO` instead, so the gap is visible on the page during review.
 *  - Prose that already existed and reads as genuine ministry content is kept as
 *    seed copy and flagged with a `// TODO: confirm with client` comment rather
 *    than being blanked out.
 *
 * Every `TODO` here is resolved in Phase 3, when this seed layer is loaded into
 * Payload and the content becomes editable from the admin dashboard.
 */
export const TODO = "TODO: confirm with client";

/** True when a value is still an unconfirmed placeholder. */
export const isTodo = (value: string | undefined | null): boolean =>
  value === TODO;
