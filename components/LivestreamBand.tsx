"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock, Radio, Youtube } from "lucide-react";

import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { fadeInLeft, fadeInRight } from "@/lib/motion";
import type { ServiceTime } from "@/content/site";
import type { SiteSettingsView } from "@/lib/cms";

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

/**
 * West Africa Time is UTC+1 year round, with no daylight saving, so the next
 * service can be worked out by shifting to UTC+1 rather than pulling in a
 * timezone library.
 */
function nextOccurrence(service: ServiceTime): Date | null {
  const dayIndex = DAYS.findIndex((day) => service.day.includes(day));
  const time = service.time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (dayIndex === -1 || !time) return null;

  let hours = Number(time[1]) % 12;
  if (time[3].toUpperCase() === "PM") hours += 12;
  const minutes = Number(time[2]);

  const now = new Date();
  const watNow = new Date(now.getTime() + 60 * 60 * 1000); // UTC -> WAT

  const target = new Date(watNow);
  target.setUTCHours(hours, minutes, 0, 0);
  const daysAhead = (dayIndex - watNow.getUTCDay() + 7) % 7;
  target.setUTCDate(watNow.getUTCDate() + daysAhead);
  if (target <= watNow) target.setUTCDate(target.getUTCDate() + 7);

  // Back to real UTC for the countdown.
  return new Date(target.getTime() - 60 * 60 * 1000);
}

function useCountdown(target: Date | null) {
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    if (!target) return;
    const tick = () => setRemaining(target.getTime() - Date.now());
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [target]);

  if (remaining === null || remaining <= 0) return null;

  const totalSeconds = Math.floor(remaining / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

/** A YouTube watch or live URL, as an embeddable one. */
function embedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtube.com")) {
      const id = parsed.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
      if (parsed.pathname.startsWith("/live/")) {
        return `https://www.youtube.com/embed/${parsed.pathname.split("/")[2]}`;
      }
      if (parsed.pathname.startsWith("/embed/")) return url;
    }
    if (parsed.hostname === "youtu.be") {
      return `https://www.youtube.com/embed/${parsed.pathname.slice(1)}`;
    }
    return null;
  } catch {
    return null;
  }
}

export function LivestreamBand({
  settings,
  serviceTimes,
  heading,
  body,
}: {
  settings: SiteSettingsView;
  serviceTimes: ServiceTime[];
  heading?: string;
  body?: string;
}) {
  const weekly = serviceTimes.filter((service) => service.cadence === "Weekly");

  // The soonest upcoming weekly service.
  const upcoming = weekly
    .map((service) => ({ service, at: nextOccurrence(service) }))
    .filter((entry): entry is { service: ServiceTime; at: Date } => Boolean(entry.at))
    .sort((a, b) => a.at.getTime() - b.at.getTime())[0];

  const countdown = useCountdown(upcoming?.at ?? null);
  const embed = settings.livestreamUrl ? embedUrl(settings.livestreamUrl) : null;

  return (
    <Section tone="navy" id="watch">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <Reveal variants={fadeInLeft}>
          <p className="eyebrow text-gold-400">Watch online</p>
          <h2 className="mt-3 text-h2 text-white text-balance">
            {heading ?? "Cannot be there in person? Join us wherever you are."}
          </h2>
          <div className="rule mt-5" />
          <p className="mt-6 max-w-xl text-body-lg text-navy-200">
            {body ??
              "Our services and conferences are published on YouTube, so you can watch the teaching wherever you are in the world."}
          </p>

          {upcoming && countdown && (
            <div className="mt-8">
              <p className="flex items-center gap-2 text-body-sm text-navy-300">
                <Radio className="h-4 w-4 text-gold-400" />
                Next: {upcoming.service.name}, {upcoming.service.day} at{" "}
                {upcoming.service.time}
              </p>
              <div className="mt-4 flex gap-3" role="timer">
                {[
                  { value: countdown.days, label: "days" },
                  { value: countdown.hours, label: "hrs" },
                  { value: countdown.minutes, label: "min" },
                  { value: countdown.seconds, label: "sec" },
                ].map((unit) => (
                  <div
                    key={unit.label}
                    className="min-w-[64px] rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-center"
                  >
                    <div className="font-display text-h4 tabular-nums text-white">
                      {String(unit.value).padStart(2, "0")}
                    </div>
                    <div className="text-[11px] uppercase tracking-[0.1em] text-navy-400">
                      {unit.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href={settings.livestreamUrl || settings.socials.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              <Youtube className="h-4 w-4" />
              {settings.livestreamUrl ? "Watch the stream" : "Watch on YouTube"}
            </a>
            <Link href="/media" className="btn-inverse">
              Browse messages
            </Link>
          </div>

          {settings.livestreamNote && (
            <p className="mt-6 text-caption text-navy-400">
              {settings.livestreamNote}
            </p>
          )}
        </Reveal>

        <Reveal variants={fadeInRight}>
          {embed ? (
            <div className="aspect-video w-full overflow-hidden rounded-2xl border border-white/10">
              <iframe
                src={embed}
                title="Live stream"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
                loading="lazy"
              />
            </div>
          ) : (
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
              <h3 className="text-h4 text-white">This week</h3>
              <ul className="mt-6 space-y-5">
                {weekly.map((service) => (
                  <li
                    key={service.name}
                    className="flex items-start justify-between gap-4 border-b border-white/10 pb-5 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="text-body font-medium text-white">
                        {service.name}
                      </p>
                      <p className="mt-1 text-body-sm text-navy-300">
                        {service.location}
                      </p>
                    </div>
                    <p className="flex shrink-0 items-center gap-2 text-body-sm text-gold-400">
                      <Clock className="h-4 w-4" />
                      {service.day.slice(0, 3)}, {service.time}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Reveal>
      </div>
    </Section>
  );
}
