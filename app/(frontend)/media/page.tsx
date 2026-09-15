import type { Metadata } from "next";
import MediaView from "./MediaView";
import { getBooks, getSermons, getSiteSettings } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Messages & Resources",
  description:
    "Messages, worship and publications from Apostle Jide Ojo and Jide Ojo Ministry International.",
};

export default async function MediaPage() {
  const [sermons, books, settings] = await Promise.all([
    getSermons(),
    getBooks(),
    getSiteSettings(),
  ]);

  return <MediaView sermons={sermons} books={books} settings={settings} />;
}
