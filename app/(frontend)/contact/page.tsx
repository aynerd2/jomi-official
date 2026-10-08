import type { Metadata } from "next";
import ContactView from "./ContactView";
import {
  formatAddress,
  getBranches,
  getPage,
  getServiceTimes,
  getSiteSettings,
} from "@/lib/cms";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("contact");
  return { title: "Contact", description: page.metaDescription };
}

export default async function ContactPage() {
  const [settings, serviceTimes, branches, page] = await Promise.all([
    getSiteSettings(),
    getServiceTimes(),
    getBranches(),
    getPage("contact"),
  ]);

  return (
    <ContactView
      settings={settings}
      serviceTimes={serviceTimes}
      branches={branches}
      fullAddress={formatAddress(settings)}
      page={page}
    />
  );
}
