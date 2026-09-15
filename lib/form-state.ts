/**
 * Shared shape for the result a form action returns.
 *
 * This lives outside the "use server" module on purpose: a file marked
 * "use server" may only export async functions, so exporting the initial state
 * object from there makes every action in it fail to load, and every form on
 * the site returns a 500 on submit.
 */
export type FormState = {
  status: "idle" | "success" | "error";
  message: string;
};

export const initialFormState: FormState = { status: "idle", message: "" };
