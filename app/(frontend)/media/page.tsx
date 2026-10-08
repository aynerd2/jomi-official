import type { Metadata } from "next";
import MediaView from "./MediaView";
import { getBooks, getPage, getSermons, getSiteSettings } from "@/lib/cms";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("media");
  return { title: "Messages & Resources", description: page.metaDescription };
}

export default async function MediaPage() {
  const [sermons, books, settings, page] = await Promise.all([
    getSermons(),
    getBooks(),
    getSiteSettings(),
    getPage("media"),
  ]);

  return (
    <MediaView sermons={sermons} books={books} settings={settings} page={page} />
  );
}
