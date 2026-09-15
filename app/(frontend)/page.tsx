import HomeView from "./HomeView";
import { todayInLagos } from "@/content/events";
import {
  getAbout,
  getEvents,
  getLeadership,
  getServiceTimes,
  getSiteSettings,
} from "@/lib/cms";

// Which events are still ahead is decided on the server, in West Africa Time,
// and refreshed hourly.
export const revalidate = 3600;

export default async function Home() {
  const [events, about, leaders, serviceTimes, settings] = await Promise.all([
    getEvents(),
    getAbout(),
    getLeadership(),
    getServiceTimes(),
    getSiteSettings(),
  ]);

  return (
    <HomeView
      today={todayInLagos()}
      events={events}
      about={about}
      leaders={leaders}
      serviceTimes={serviceTimes}
      settings={settings}
    />
  );
}
