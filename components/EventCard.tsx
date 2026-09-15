import Link from "next/link";
import { ArrowRight, Clock, MapPin } from "lucide-react";

import { acronymsIn, formatEventDate, type JomiEvent } from "@/content/events";

/**
 * One event. Typographic rather than photographic: the calendar has no real
 * event photography yet, and stock imagery was removed in Phase 1.
 */
export function EventCard({
  event,
  past = false,
}: {
  event: JomiEvent;
  past?: boolean;
}) {
  const acronyms = acronymsIn(event.title);

  return (
    <article
      className={`flex h-full flex-col ${past ? "card opacity-80" : "card-interactive"}`}
    >
      <div className="flex items-start justify-between gap-4 border-b border-ink-100 p-6">
        <div>
          <p className="text-caption font-semibold uppercase tracking-[0.12em] text-gold-600">
            {formatEventDate(event)}
          </p>
          <h3 className="mt-2 text-h4 text-navy-900">{event.title}</h3>
        </div>
        <span className="shrink-0 rounded-full bg-surface-muted px-3 py-1 text-caption font-medium text-ink-600">
          {event.type}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        {acronyms.length > 0 && (
          <ul className="mb-4 space-y-1">
            {acronyms.map((expansion) => (
              <li key={expansion} className="text-caption text-ink-500">
                {expansion}
              </li>
            ))}
          </ul>
        )}

        <ul className="mb-4 space-y-2 text-body-sm text-ink-600">
          <li className="flex items-center gap-2">
            <Clock className="h-4 w-4 shrink-0 text-gold-600" />
            {event.time}
          </li>
          <li className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" />
            {event.location}
          </li>
        </ul>

        <p className="text-body-sm leading-relaxed text-ink-600">
          {event.description}
        </p>

        {!past && (
          <Link
            href={`/register?event=${encodeURIComponent(event.title)}`}
            className="group mt-6 inline-flex items-center gap-2 self-start text-body-sm font-semibold text-navy-900 transition-colors hover:text-gold-600"
          >
            Register
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        )}
      </div>
    </article>
  );
}
