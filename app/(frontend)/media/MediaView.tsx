"use client";

import { useActionState } from "react";

import { submitMessageRequest } from "@/app/(frontend)/actions";
import { initialFormState } from "@/lib/form-state";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Headphones,
  Mail,
  Music,
  Send,
  Video,
  Youtube,
} from "lucide-react";

import { Section, SectionHeading } from "@/components/ui/Section";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/ui/Reveal";
import { fadeInLeft, fadeInRight } from "@/lib/motion";

import heroPhoto from "@/assets/images/Daddy2.jpg";
import type { Book, Sermon } from "@/content/media";
import type { SiteSettingsView } from "@/lib/cms";

export default function MediaView({
  sermons,
  books,
  settings,
}: {
  sermons: Sermon[];
  books: Book[];
  settings: SiteSettingsView;
}) {
  const [state, formAction, pending] = useActionState(
    submitMessageRequest,
    initialFormState,
  );

  const spotify = settings.spotify;
  const audiomack = settings.audiomack;
  const featuredWorshipTitle = "Iwo Ni O";

  return (
    <>

      <main>
        <PageHero
          eyebrow="Messages & resources"
          title="Equip yourself"
          lede="Teaching on the finished works of Christ, worship, and written resources to build your faith."
          image={heroPhoto}
          imageAlt="Apostle Jide Ojo teaching"
          actions={
            <>
              <a
                href={settings.socials.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                <Youtube className="h-4 w-4" />
                Watch on YouTube
              </a>
              <Link href="#books" className="btn-secondary">
                Browse books
              </Link>
            </>
          }
        />

        {/* Messages */}
        <Section tone="muted">
          {sermons.length === 0 ? (
            <Reveal className="mx-auto max-w-2xl text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-gold-600 shadow-card">
                <Video className="h-6 w-6" />
              </span>
              <h2 className="mt-6 text-h2 text-navy-900 text-balance">
                The message library is being built
              </h2>
              <div className="rule mx-auto mt-5" />
              <p className="mt-5 text-body-lg text-ink-600">
                We are cataloguing our messages so you can search them by topic,
                speaker and series. In the meantime, every message is published
                on our YouTube channel.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <a
                  href={settings.socials.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  <Youtube className="h-4 w-4" />
                  Watch on YouTube
                </a>
                <a
                  href={spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  <Headphones className="h-4 w-4" />
                  Listen on Spotify
                </a>
              </div>
            </Reveal>
          ) : (
            <>
              <SectionHeading
                eyebrow="Messages"
                title="Recent teaching"
                lede="Search by topic, speaker or series."
              />
              <StaggerGroup className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {sermons.map((sermon) => (
                  <StaggerItem key={sermon.id}>
                    <article className="card-interactive flex h-full flex-col p-6">
                      <p className="text-caption font-semibold uppercase tracking-[0.12em] text-gold-600">
                        {sermon.category}
                      </p>
                      <h3 className="mt-2 text-h4 text-navy-900">
                        {sermon.title}
                      </h3>
                      <p className="mt-1 text-body-sm text-ink-500">
                        {sermon.speaker} &middot; {sermon.duration}
                      </p>
                      <p className="mt-4 flex-1 text-body-sm text-ink-600">
                        {sermon.description}
                      </p>
                      {sermon.videoUrl && (
                        <a
                          href={sermon.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group mt-6 inline-flex items-center gap-2 self-start text-body-sm font-semibold text-navy-900 hover:text-gold-600"
                        >
                          Watch
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </a>
                      )}
                    </article>
                  </StaggerItem>
                ))}
              </StaggerGroup>
            </>
          )}
        </Section>

        {/* Featured worship — navy band */}
        <Section tone="navy">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal variants={fadeInLeft}>
              <p className="eyebrow text-gold-400">Featured worship</p>
              <h2 className="mt-3 text-h2 text-white text-balance">
                {featuredWorshipTitle}
              </h2>
              <div className="rule mt-5" />
              <p className="mt-6 max-w-lg text-body-lg text-navy-200">
                Soak in the presence of God with this sound from Apostle Jide
                Ojo.
              </p>
              <p className="mt-6 flex items-center gap-2 text-body-sm text-navy-300">
                <Music className="h-4 w-4 text-gold-400" />
                More worship on our channels
              </p>
            </Reveal>

            <Reveal variants={fadeInRight}>
              <div className="overflow-hidden rounded-2xl border border-white/10">
                <iframe
                  src={audiomack}
                  scrolling="no"
                  width="100%"
                  height="252"
                  frameBorder="0"
                  title={featuredWorshipTitle}
                  loading="lazy"
                ></iframe>
              </div>
            </Reveal>
          </div>
        </Section>

        {/* Books */}
        <Section id="books">
          <SectionHeading
            eyebrow="Publications"
            title="Books & written teaching"
            lede="Written teaching from Apostle Jide Ojo."
          />

          <StaggerGroup className="mx-auto mt-14 grid max-w-4xl gap-6 md:grid-cols-2">
            {books.map((book) => (
              <StaggerItem key={book.id}>
                <article className="card-interactive flex h-full flex-col p-8">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-50 text-gold-600">
                    <BookOpen className="h-5 w-5" />
                  </span>
                  <h3 className="mt-6 text-h3 text-navy-900">{book.title}</h3>
                  <p className="mt-1 text-body-sm text-ink-500">{book.author}</p>
                  <p className="mt-4 flex-1 text-body-sm text-ink-600">
                    {book.description}
                  </p>

                  <div className="mt-6 flex items-center justify-between gap-4 border-t border-ink-100 pt-5">
                    <span className="text-h4 text-gold-600">
                      {book.price || ""}
                    </span>
                    <Link href="/contact" className="btn-secondary">
                      Enquire
                    </Link>
                  </div>
                </article>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Section>

        {/* Request a message */}
        <Section tone="muted">
          <Reveal className="mx-auto max-w-2xl">
            <div className="card p-8 md:p-10">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-50 text-gold-600">
                <Mail className="h-5 w-5" />
              </span>
              <h2 className="mt-6 text-h3 text-navy-900">Request a message</h2>
              <p className="mt-3 text-body text-ink-600">
                Looking for a specific message or series? Tell us what you are
                after and we will help you find it.
              </p>

              <form action={formAction} className="mt-8 space-y-4">
                <div>
                  <label htmlFor="request-topic" className="sr-only">
                    Message title or topic
                  </label>
                  <input
                    id="request-topic"
                    name="topic"
                    type="text"
                    required
                    placeholder="Message title or topic"
                    className="w-full rounded-xl border border-ink-200 bg-white px-5 py-3.5 text-body-sm text-ink-800 placeholder-ink-400 transition-colors focus:border-gold-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="request-email" className="sr-only">
                    Your email
                  </label>
                  <input
                    id="request-email"
                    name="email"
                    type="email"
                    required
                    placeholder="Your email"
                    className="w-full rounded-xl border border-ink-200 bg-white px-5 py-3.5 text-body-sm text-ink-800 placeholder-ink-400 transition-colors focus:border-gold-500 focus:outline-none"
                  />
                </div>

                {state.message && (
                  <p
                    role="status"
                    className={`rounded-xl border p-4 text-body-sm ${
                      state.status === "error"
                        ? "border-red-200 bg-red-50 text-red-800"
                        : "border-gold-200 bg-gold-50 text-ink-700"
                    }`}
                  >
                    {state.message}
                  </p>
                )}

                <button type="submit" disabled={pending} className="btn-primary w-full">
                  <Send className="h-4 w-4" />
                  {pending ? "Sending..." : "Submit request"}
                </button>
              </form>
            </div>
          </Reveal>
        </Section>
      </main>
    </>
  );
}
