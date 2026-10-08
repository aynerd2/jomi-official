import type { Metadata } from "next";
import EventsView from "./EventsView";
import { todayInLagos } from "@/content/events";
import { getEvents, getPage } from "@/lib/cms";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("events");
  return { title: "Events", description: page.metaDescription };
}

// "Upcoming" is resolved on the server against West Africa Time and refreshed
// hourly, so the static page never disagrees with the browser at hydration.
export const revalidate = 3600;

export default async function EventsPage() {
  const [events, page] = await Promise.all([getEvents(), getPage("events")]);
  return <EventsView today={todayInLagos()} events={events} page={page} />;
}
