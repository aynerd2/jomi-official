import type { Metadata } from "next";
import ContactView from "./ContactView";
import {
  formatAddress,
  getBranches,
  getServiceTimes,
  getSiteSettings,
} from "@/lib/cms";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Service times, locations and how to reach Jide Ojo Ministry International for enquiries, prayer requests and ministry engagements.",
};

export default async function ContactPage() {
  const [settings, serviceTimes, branches] = await Promise.all([
    getSiteSettings(),
    getServiceTimes(),
    getBranches(),
  ]);

  return (
    <ContactView
      settings={settings}
      serviceTimes={serviceTimes}
      branches={branches}
      fullAddress={formatAddress(settings)}
    />
  );
}
