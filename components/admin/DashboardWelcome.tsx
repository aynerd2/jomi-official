import type { CollectionSlug, ServerProps } from "payload";

import {
  DashboardWelcomeView,
  type Activity,
  type Stat,
} from "./DashboardWelcomeView";

/**
 * Sits above Payload's collection cards on the dashboard (`beforeDashboard`).
 *
 * Reads only. Every query passes the signed-in user with overrideAccess off,
 * so a figure the user is not allowed to see is skipped rather than leaked.
 */

const ADMIN = "/admin/collections";

// Where each stat card leads: the list view, pre-filtered to what it counts.
const filtered = (slug: string, field: string, value: string) =>
  `${ADMIN}/${slug}?where[${field}][equals]=${value}`;

// The ministry runs on West Africa Time, whatever the server's clock says.
function greeting(now: Date) {
  const hour = Number(
    new Intl.DateTimeFormat("en-GB", {
      hour: "numeric",
      hourCycle: "h23",
      timeZone: "Africa/Lagos",
    }).format(now),
  );
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

// "3 hours ago", worked out here so server and browser never disagree.
const relative = new Intl.RelativeTimeFormat("en-GB", { numeric: "auto" });
function ago(iso: string, now: Date) {
  const seconds = (new Date(iso).getTime() - now.getTime()) / 1000;
  const steps: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ["year", 31536000],
    ["month", 2592000],
    ["week", 604800],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];
  for (const [unit, size] of steps) {
    if (Math.abs(seconds) >= size) return relative.format(Math.round(seconds / size), unit);
  }
  return "just now";
}

const RECENT_SOURCES: Array<{
  slug: CollectionSlug;
  label: string;
  title: string;
}> = [
  { slug: "submissions", label: "Submission", title: "subject" },
  { slug: "testimonies", label: "Testimony", title: "name" },
  { slug: "events", label: "Event", title: "title" },
  { slug: "sermons", label: "Message", title: "title" },
];

export async function DashboardWelcome({ payload, user }: ServerProps) {
  if (!user) return null;

  const access = { overrideAccess: false, user } as const;
  const now = new Date();

  // One failed or forbidden query should cost a card, not the dashboard.
  const count = async (
    collection: CollectionSlug,
    where?: Parameters<typeof payload.count>[0]["where"],
  ) => {
    try {
      const { totalDocs } = await payload.count({ collection, where, ...access });
      return totalDocs;
    } catch {
      return null;
    }
  };

  const [newSubmissions, pendingTestimonies, upcomingEvents, sermons] =
    await Promise.all([
      count("submissions", { status: { equals: "new" } }),
      count("testimonies", { status: { equals: "pending" } }),
      count("events", { startDate: { greater_than_equal: now.toISOString() } }),
      count("sermons"),
    ]);

  const candidates: Array<Omit<Stat, "value"> & { value: number | null }> = [
    {
      label: "New submissions",
      hint: "Contact, prayer and registration forms awaiting a reply",
      value: newSubmissions,
      href: filtered("submissions", "status", "new"),
      tone: "gold",
    },
    {
      label: "Testimonies to review",
      hint: "Sent in from the website, not yet approved",
      value: pendingTestimonies,
      href: filtered("testimonies", "status", "pending"),
      tone: "gold",
    },
    {
      label: "Upcoming events",
      hint: "Public and internal, from today on",
      value: upcomingEvents,
      href: `${ADMIN}/events?where[startDate][greater_than_equal]=${now.toISOString().slice(0, 10)}`,
      tone: "navy",
    },
    {
      label: "Messages",
      hint: "Sermons in the archive",
      value: sermons,
      href: `${ADMIN}/sermons`,
      tone: "navy",
    },
  ];
  const stats = candidates.filter((s): s is Stat => s.value !== null);

  const recentLists = await Promise.all(
    RECENT_SOURCES.map(async (source) => {
      try {
        const { docs } = await payload.find({
          collection: source.slug,
          sort: "-updatedAt",
          limit: 5,
          depth: 0,
          select: { [source.title]: true, updatedAt: true, createdAt: true },
          ...access,
        });
        return docs.map((doc): Activity => {
          const record = doc as unknown as Record<string, unknown>;
          const at = String(record.updatedAt ?? record.createdAt ?? "");
          return {
            id: String(record.id),
            kind: source.label,
            title: String(record[source.title] || "Untitled"),
            href: `${ADMIN}/${source.slug}/${record.id}`,
            at,
            ago: at ? ago(at, now) : "",
            created: record.updatedAt === record.createdAt,
          };
        });
      } catch {
        return [];
      }
    }),
  );

  const recent = recentLists
    .flat()
    .filter((a) => a.at)
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, 6);

  const fullName = (user as { name?: unknown }).name;
  const name = typeof fullName === "string" ? (fullName.trim().split(/\s+/)[0] ?? "") : "";

  return (
    <DashboardWelcomeView
      greeting={greeting(now)}
      name={name}
      stats={stats}
      recent={recent}
      today={new Intl.DateTimeFormat("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        timeZone: "Africa/Lagos",
      }).format(now)}
    />
  );
}

export default DashboardWelcome;
