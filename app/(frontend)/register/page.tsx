import type { Metadata } from "next";
import RegisterView from "./RegisterView";
import { getSiteSettings } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Register",
  description:
    "Register to attend a service, conference or seminar with Jide Ojo Ministry International.",
};

export default async function RegisterPage() {
  const settings = await getSiteSettings();
  return <RegisterView settings={settings} />;
}
