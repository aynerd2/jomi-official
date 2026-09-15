import type { Metadata } from "next";
import EventsView from "./EventsView";
import { todayInLagos } from "@/content/events";
import { getEvents } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Services, conferences, seminars and apostolic missions with Jide Ojo Ministry International.",
};

// "Upcoming" is resolved on the server against West Africa Time and refreshed
// hourly, so the static page never disagrees with the browser at hydration.
export const revalidate = 3600;

export default async function EventsPage() {
  const events = await getEvents();
  return <EventsView today={todayInLagos()} events={events} />;
}
