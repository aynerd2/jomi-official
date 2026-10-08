import type { Metadata } from "next";
import PartnerView from "./PartnerView";
import { getGiving, getPage, getSiteSettings } from "@/lib/cms";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("partner");
  return { title: "Partner with Us", description: page.metaDescription };
}

export default async function PartnerPage() {
  const [giving, settings, page] = await Promise.all([
    getGiving(),
    getSiteSettings(),
    getPage("partner"),
  ]);
  return <PartnerView giving={giving} settings={settings} page={page} />;
}
