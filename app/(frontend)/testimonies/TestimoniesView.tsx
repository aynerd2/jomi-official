"use client";

import { useActionState, useEffect, useState } from "react";

import { initialFormState, submitTestimony } from "@/app/(frontend)/actions";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Globe, Heart, Quote, Send, X } from "lucide-react";

import { Section, SectionHeading } from "@/components/ui/Section";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/ui/Reveal";

import heroPhoto from "@/assets/images/Testimony.jpg";
import { testimonyCategories, type Testimony } from "@/content/testimonies";

export default function TestimoniesView({
  testimonies,
}: {
  testimonies: Testimony[];
}) {
  const [showForm, setShowForm] = useState(false);
  const [state, formAction, pending] = useActionState(
    submitTestimony,
    initialFormState,
  );
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  const featured = testimonies.filter((t) => t.featured);
  const current = featured[index];

  const step = (direction: 1 | -1) =>
    setIndex((prev) => (prev + direction + featured.length) % featured.length);

  const closeForm = () => setShowForm(false);

  // Escape closes the dialog, as with any modal.
  useEffect(() => {
    if (!showForm) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowForm(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [showForm]);

  return (
    <>

      <main>
        <PageHero
          eyebrow="Testimonies"
          title="Give glory to God"
          lede="Testimonies of salvation, healing and restoration from those the Lord has touched through this ministry."
          image={heroPhoto}
          imageAlt="Worshippers with hands raised"
          actions={
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="btn-primary"
            >
              <Send className="h-4 w-4" />
              Share your testimony
            </button>
          }
        />

        {/* Featured carousel, once there are testimonies to feature */}
        {current && (
          <Section tone="navy">
            <Reveal className="mx-auto max-w-3xl text-center">
              <Quote className="mx-auto h-8 w-8 text-gold-400" />
              <AnimatePresence mode="wait">
                <motion.blockquote
                  key={current.id}
                  initial={reduceMotion ? undefined : { opacity: 0, y: 12 }}
                  animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, y: -12 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="mt-8"
                >
                  <p className="font-display text-h3 italic leading-relaxed text-white">
                    &ldquo;{current.testimony}&rdquo;
                  </p>
                  <footer className="mt-8">
                    <p className="text-body font-semibold text-white">
                      {current.name}
                    </p>
                    <p className="mt-1 text-body-sm text-navy-300">
                      {current.location} &middot; {current.category}
                    </p>
                  </footer>
                </motion.blockquote>
              </AnimatePresence>

              {featured.length > 1 && (
                <div className="mt-10 flex items-center justify-center gap-4">
                  <button
                    type="button"
                    onClick={() => step(-1)}
                    aria-label="Previous testimony"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:border-gold-500 hover:bg-gold-500 hover:text-navy-900"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <div className="flex gap-2">
                    {featured.map((t, i) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setIndex(i)}
                        aria-label={`Testimony ${i + 1}`}
                        aria-current={i === index}
                        className={`h-2 rounded-full transition-all ${
                          i === index ? "w-8 bg-gold-500" : "w-2 bg-white/30"
                        }`}
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => step(1)}
                    aria-label="Next testimony"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:border-gold-500 hover:bg-gold-500 hover:text-navy-900"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              )}
            </Reveal>
          </Section>
        )}

        <Section tone={current ? "white" : "muted"}>
          {testimonies.length === 0 ? (
            <Reveal className="mx-auto max-w-2xl text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-gold-600 shadow-card">
                <Heart className="h-6 w-6" />
              </span>
              <h2 className="mt-6 text-h2 text-navy-900 text-balance">
                Be the first to share what God has done
              </h2>
              <div className="rule mx-auto mt-5" />
              <p className="mt-5 text-body-lg text-ink-600">
                We are gathering testimonies from across the nations. If the Lord
                has met you through this ministry, we would count it a joy to
                hear your story and, with your permission, share it here.
              </p>
              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="btn-primary mt-8"
              >
                <Send className="h-4 w-4" />
                Share your testimony
              </button>
            </Reveal>
          ) : (
            <>
              <SectionHeading
                eyebrow="In their words"
                title="What God has done"
              />
              <StaggerGroup className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {testimonies.map((testimony) => (
                  <StaggerItem key={testimony.id}>
                    <article className="card-interactive flex h-full flex-col p-7">
                      <span className="w-fit rounded-full bg-gold-50 px-3 py-1 text-caption font-semibold text-gold-700">
                        {testimony.category}
                      </span>
                      <p className="mt-5 flex-1 text-body-sm italic leading-relaxed text-ink-600">
                        &ldquo;{testimony.testimony}&rdquo;
                      </p>
                      <footer className="mt-6 border-t border-ink-100 pt-5">
                        <p className="text-body font-semibold text-navy-900">
                          {testimony.name}
                        </p>
                        <p className="mt-1 flex items-center gap-1.5 text-body-sm text-ink-500">
                          <Globe className="h-3.5 w-3.5 text-gold-600" />
                          {testimony.location}
                        </p>
                      </footer>
                    </article>
                  </StaggerItem>
                ))}
              </StaggerGroup>
            </>
          )}
        </Section>
      </main>

      {/* Submission form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={reduceMotion ? undefined : { opacity: 0 }}
            animate={reduceMotion ? undefined : { opacity: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-navy-950/70 p-4 backdrop-blur-sm"
            onClick={closeForm}
            role="dialog"
            aria-modal="true"
            aria-labelledby="testimony-form-title"
          >
            <motion.div
              initial={reduceMotion ? undefined : { opacity: 0, y: 20 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: 20 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-8 shadow-lift md:p-10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-6">
                <h2 id="testimony-form-title" className="text-h3 text-navy-900">
                  Share your testimony
                </h2>
                <button
                  type="button"
                  onClick={closeForm}
                  aria-label="Close"
                  className="rounded-full p-2 text-ink-500 transition-colors hover:bg-surface-muted hover:text-navy-900"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form action={formAction} className="mt-8 space-y-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <Field id="testimony-name" name="name" label="Name" required />
                  <Field
                    id="testimony-email"
                    name="email"
                    label="Email"
                    type="email"
                    required
                  />
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <Field
                    id="testimony-location"
                    name="location"
                    label="Location"
                    placeholder="City, Country"
                    required
                  />
                  <div>
                    <label
                      htmlFor="testimony-category"
                      className="block text-body-sm font-medium text-navy-900"
                    >
                      Category
                    </label>
                    <select
                      id="testimony-category"
                      name="category"
                      required
                      className="mt-2 w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-body-sm text-ink-800 transition-colors focus:border-gold-500 focus:outline-none"
                    >
                      <option value="">Select a category</option>
                      {testimonyCategories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="testimony-body"
                    className="block text-body-sm font-medium text-navy-900"
                  >
                    Your testimony
                  </label>
                  <textarea
                    id="testimony-body"
                    name="testimony"
                    rows={6}
                    required
                    placeholder="Share your story..."
                    className="mt-2 w-full resize-none rounded-xl border border-ink-200 bg-white px-4 py-3 text-body-sm text-ink-800 placeholder-ink-400 transition-colors focus:border-gold-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-start gap-3">
                  <input
                    id="testimony-consent"
                    name="consent"
                    type="checkbox"
                    required
                    className="mt-1 h-4 w-4 accent-gold-500"
                  />
                  <label
                    htmlFor="testimony-consent"
                    className="text-body-sm text-ink-600"
                  >
                    I consent to JOMI publishing my testimony on their website
                    and other platforms.
                  </label>
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

                <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                  <button
                    type="submit"
                    disabled={pending || state.status === "success"}
                    className="btn-primary flex-1"
                  >
                    <Send className="h-4 w-4" />
                    {pending ? "Sending..." : "Submit testimony"}
                  </button>
                  <button
                    type="button"
                    onClick={closeForm}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Field({
  id,
  name,
  label,
  type = "text",
  placeholder,
  required,
}: {
  id: string;
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-body-sm font-medium text-navy-900">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="mt-2 w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-body-sm text-ink-800 placeholder-ink-400 transition-colors focus:border-gold-500 focus:outline-none"
      />
    </div>
  );
}
