import type { Metadata } from "next";
import PartnerView from "./PartnerView";
import { getGiving, getSiteSettings } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Partner with Us",
  description:
    "Support the mission of Jide Ojo Ministry International through giving and monthly partnership.",
};

export default async function PartnerPage() {
  const [giving, settings] = await Promise.all([getGiving(), getSiteSettings()]);
  return <PartnerView giving={giving} settings={settings} />;
}
