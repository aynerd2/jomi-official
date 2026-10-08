"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Calendar, Search, SlidersHorizontal } from "lucide-react";

import { EventCard } from "@/components/EventCard";
import { Section } from "@/components/ui/Section";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/ui/Reveal";
import { eventTypes, isUpcoming, type JomiEvent } from "@/content/events";
import type { PageView } from "@/lib/cms";

/** Groups events under "January 2026" style headings, in calendar order. */
function groupByMonth(events: JomiEvent[]) {
  const groups = new Map<string, JomiEvent[]>();
  for (const event of events) {
    const label = new Intl.DateTimeFormat("en-GB", {
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }).format(new Date(`${event.startDate}T00:00:00Z`));
    const bucket = groups.get(label);
    if (bucket) bucket.push(event);
    else groups.set(label, [event]);
  }
  return [...groups.entries()];
}

export default function EventsView({
  today,
  events,
  page,
}: {
  today: string;
  events: JomiEvent[];
  page: PageView<"events">;
}) {
  const { hero } = page;
  const [type, setType] = useState("all");
  const [country, setCountry] = useState("All");
  const [query, setQuery] = useState("");
  const [showPast, setShowPast] = useState(false);

  const upcoming = useMemo(
    () => events.filter((event) => isUpcoming(event, today)),
    [events, today],
  );
  const past = useMemo(
    () => events.filter((event) => !isUpcoming(event, today)).reverse(),
    [events, today],
  );

  const countries = useMemo(
    () => ["All", ...Array.from(new Set(upcoming.map((e) => e.country)))],
    [upcoming],
  );

  const matches = (event: JomiEvent) => {
    const q = query.trim().toLowerCase();
    return (
      (type === "all" || event.type === type) &&
      (country === "All" || event.country === country) &&
      (q === "" ||
        event.title.toLowerCase().includes(q) ||
        event.location.toLowerCase().includes(q))
    );
  };

  const filteredUpcoming = upcoming.filter(matches);
  const filteredPast = past.filter(matches);
  const months = groupByMonth(filteredUpcoming);
  const filtersActive = type !== "all" || country !== "All" || query !== "";

  const clearFilters = () => {
    setType("all");
    setCountry("All");
    setQuery("");
  };

  return (
    <>

      <main>
        <PageHero
          eyebrow={hero.eyebrow}
          title={hero.title}
          lede={hero.lede}
          image={hero.image}
          imageAlt={hero.imageAlt}
        />

        <Section tone="muted">
          {/* Filters */}
          <Reveal className="card p-5 md:p-6">
            <div className="grid gap-4 md:grid-cols-12">
              <div className="md:col-span-6">
                <label htmlFor="event-search" className="sr-only">
                  Search events
                </label>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                  <input
                    id="event-search"
                    type="search"
                    placeholder="Search by title or location"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full rounded-full border border-ink-200 bg-white py-3 pl-11 pr-4 text-body-sm text-ink-800 placeholder-ink-400 transition-colors focus:border-gold-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="md:col-span-3">
                <label htmlFor="event-type" className="sr-only">
                  Filter by type
                </label>
                <select
                  id="event-type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full rounded-full border border-ink-200 bg-white px-5 py-3 text-body-sm text-ink-800 transition-colors focus:border-gold-500 focus:outline-none"
                >
                  <option value="all">All types</option>
                  {eventTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-3">
                <label htmlFor="event-country" className="sr-only">
                  Filter by country
                </label>
                <select
                  id="event-country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full rounded-full border border-ink-200 bg-white px-5 py-3 text-body-sm text-ink-800 transition-colors focus:border-gold-500 focus:outline-none"
                >
                  {countries.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-caption text-ink-500">
              <span className="flex items-center gap-2">
                <SlidersHorizontal className="h-3.5 w-3.5" />
                {filteredUpcoming.length} upcoming
                {filtersActive ? " match" : ""}
              </span>
              {filtersActive && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="font-semibold text-gold-600 hover:underline"
                >
                  Clear filters
                </button>
              )}
            </div>
          </Reveal>

          {/* Upcoming, grouped by month */}
          {months.length > 0 ? (
            <div className="mt-14 space-y-16">
              {months.map(([month, monthEvents]) => (
                <div key={month}>
                  <Reveal className="mb-8 flex items-center gap-5">
                    <h2 className="text-h3 text-navy-900">{month}</h2>
                    <span className="h-px flex-1 bg-ink-200" />
                    <span className="text-caption text-ink-500">
                      {monthEvents.length}{" "}
                      {monthEvents.length === 1 ? "event" : "events"}
                    </span>
                  </Reveal>

                  <StaggerGroup className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {monthEvents.map((event) => (
                      <StaggerItem key={event.id}>
                        <EventCard event={event} />
                      </StaggerItem>
                    ))}
                  </StaggerGroup>
                </div>
              ))}
            </div>
          ) : (
            <Reveal className="mx-auto mt-14 max-w-xl rounded-2xl border border-ink-100 bg-white p-12 text-center">
              <Calendar className="mx-auto h-8 w-8 text-gold-500" />
              <h2 className="mt-5 text-h3 text-navy-900">
                {upcoming.length === 0
                  ? "The next calendar is on its way"
                  : "Nothing matches those filters"}
              </h2>
              <p className="mt-3 text-body text-ink-600">
                {upcoming.length === 0
                  ? "The coming year's calendar has not been published yet."
                  : "Try a different type, country or search term."}
              </p>
              {filtersActive && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="btn-secondary mt-6"
                >
                  Clear filters
                </button>
              )}
            </Reveal>
          )}

          {/* Past archive */}
          {past.length > 0 && (
            <div className="mt-20 border-t border-ink-200 pt-10">
              <button
                type="button"
                onClick={() => setShowPast((open) => !open)}
                aria-expanded={showPast}
                className="group text-left"
              >
                <span className="text-h3 text-navy-900 transition-colors group-hover:text-gold-600">
                  {showPast ? "Hide" : "Browse"} past events ({filteredPast.length})
                </span>
                <span className="mt-1 block text-body-sm text-ink-500">
                  Everything the ministry has held so far this year.
                </span>
              </button>

              {showPast && (
                <StaggerGroup className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredPast.map((event) => (
                    <StaggerItem key={event.id}>
                      <EventCard event={event} past />
                    </StaggerItem>
                  ))}
                </StaggerGroup>
              )}
            </div>
          )}
        </Section>

        {/* Visiting */}
        <Section tone="navy">
          <div className="grid items-center gap-10 lg:grid-cols-12">
            <Reveal className="lg:col-span-8">
              <h2 className="text-h2 text-white text-balance">
                First time joining us?
              </h2>
              <div className="rule mt-5" />
              <p className="mt-5 max-w-2xl text-body-lg text-navy-200">
                Tell us you are coming and we will look out for you, or find our
                service times and centres before you travel.
              </p>
            </Reveal>
            <Reveal delay={0.1} className="lg:col-span-4">
              <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
                <Link href="/contact" className="btn-primary">
                  Plan your visit
                </Link>
                <Link href="/branches" className="btn-inverse">
                  Our centres
                </Link>
              </div>
            </Reveal>
          </div>
        </Section>
      </main>
    </>
  );
}
