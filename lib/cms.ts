/**
 * The public site reads everything through here.
 *
 * Each function returns the same shape the components already expect, so the
 * views do not care whether the data came from Payload or from the seed
 * content in content/. Images are the one difference: Payload returns a URL
 * string, while the seed uses a next/image static import, so image fields are
 * typed to accept either.
 */
import type { StaticImageData } from "next/image";
import type { Payload, Where } from "payload";

import { fromCms } from "./payload";
import { seedImage } from "@/assets/registry";
import { isTodo } from "@/content/todo";

import * as aboutSeed from "@/content/about";
import { events as eventsSeed, type JomiEvent } from "@/content/events";
import { galleryImages as gallerySeed } from "@/content/gallery";
import { leadership as leadershipSeed } from "@/content/leadership";
import { books as booksSeed, channels as channelsSeed, sermons as sermonsSeed, type Book, type Sermon } from "@/content/media";
import { ministryArms as armsSeed, type MinistryArm } from "@/content/ministryArms";
import {
  bankAccount as bankSeed,
  impactAreas as impactAreasSeed,
  impactStats as impactStatsSeed,
  partnerTiers as tiersSeed,
  type ImpactArea,
  type ImpactStat,
  type PartnerTier,
} from "@/content/giving";
import {
  branches as branchesSeed,
  serviceTimes as serviceTimesSeed,
  siteSettings as siteSeed,
  type Branch,
  type ServiceTime,
} from "@/content/site";
import { testimonies as testimoniesSeed, type Testimony } from "@/content/testimonies";

export type ImageSource = StaticImageData | string | undefined;

type Doc = Record<string, any>;

/** Payload upload fields arrive either populated or as an id. */
function imageUrl(value: unknown): string | undefined {
  if (!value || typeof value !== "object") return undefined;
  const doc = value as Doc;
  return typeof doc.url === "string" ? doc.url : undefined;
}

/** Drops TODO placeholders, so a gap reaches the view as an empty value. */
function clean(value: string | undefined): string {
  return !value || isTodo(value) ? "" : value;
}

function isoDate(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.slice(0, 10);
}

/* ------------------------------------------------------------------ events */

export async function getEvents(): Promise<JomiEvent[]> {
  return fromCms(
    "events",
    async (payload: Payload) => {
      const { docs } = await payload.find({
        collection: "events",
        // Internal entries (retreats, leader travel) are excluded by the
        // collection's access rule for anonymous reads. Asking for public only
        // states the intent here as well, so a future signed-in render path
        // cannot leak them onto the public site.
        where: { audience: { equals: "public" } } satisfies Where,
        overrideAccess: false,
        limit: 500,
        sort: "startDate",
        depth: 1,
      });

      return docs.map((doc: Doc) => ({
        id: typeof doc.id === "string" ? doc.id.slice(-8) : doc.id,
        title: doc.title,
        startDate: isoDate(doc.startDate),
        endDate: doc.endDate ? isoDate(doc.endDate) : undefined,
        time: doc.time,
        location: doc.location,
        description: doc.description,
        type: doc.type,
        country: doc.country,
        featured: Boolean(doc.featured),
      })) as JomiEvent[];
    },
    eventsSeed,
  );
}

/* ----------------------------------------------------------------- sermons */

export async function getSermons(): Promise<Sermon[]> {
  return fromCms(
    "sermons",
    async (payload) => {
      const { docs } = await payload.find({
        collection: "sermons",
        where: { _status: { equals: "published" } } satisfies Where,
        overrideAccess: false,
        limit: 200,
        sort: "-date",
        depth: 1,
      });

      return docs.map((doc: Doc, index: number) => ({
        id: index + 1,
        title: doc.title,
        speaker: doc.speaker,
        date: isoDate(doc.date),
        duration: doc.duration ?? "",
        category: doc.category ?? "",
        series: doc.series ?? undefined,
        description: doc.description,
        videoUrl: doc.videoUrl ?? undefined,
        audioUrl: doc.audioUrl ?? undefined,
        featured: Boolean(doc.featured),
      })) as Sermon[];
    },
    sermonsSeed,
  );
}

export async function getBooks(): Promise<Book[]> {
  return fromCms(
    "books",
    async (payload) => {
      const { docs } = await payload.find({
        collection: "books",
        where: { available: { equals: true } } satisfies Where,
        overrideAccess: false,
        limit: 100,
        depth: 1,
      });

      return docs.map((doc: Doc, index: number) => ({
        id: index + 1,
        title: doc.title,
        author: doc.author,
        price: clean(doc.price),
        description: doc.description,
      })) as Book[];
    },
    booksSeed.map((book) => ({ ...book, price: clean(book.price) })),
  );
}

/* --------------------------------------------------------------- galleries */

export type GalleryItem = {
  id: string;
  image: ImageSource;
  caption: string;
};

export async function getGallery(): Promise<GalleryItem[]> {
  return fromCms<GalleryItem[]>(
    "gallery",
    async (payload) => {
      const { docs } = await payload.find({
        collection: "gallery",
        overrideAccess: false,
        limit: 200,
        sort: "order",
        depth: 1,
      });

      return docs.map((doc: Doc) => ({
        id: String(doc.id),
        image: imageUrl(doc.image),
        caption: doc.caption,
      }));
    },
    gallerySeed.map((item) => ({
      id: item.id,
      image: seedImage(item.imageFile),
      caption: item.caption,
    })),
  );
}

/* ------------------------------------------------------------- leadership  */

export type LeaderView = {
  name: string;
  role: string;
  bio: string;
  photo: ImageSource;
  instagram?: string;
};

export async function getLeadership(): Promise<LeaderView[]> {
  return fromCms<LeaderView[]>(
    "leadership",
    async (payload) => {
      const { docs } = await payload.find({
        collection: "leadership",
        overrideAccess: false,
        limit: 50,
        sort: "order",
        depth: 1,
      });

      return docs.map((doc: Doc) => ({
        name: doc.name,
        role: doc.role,
        bio: doc.bio,
        photo: imageUrl(doc.photo),
        instagram: doc.instagram ?? undefined,
      }));
    },
    leadershipSeed.map((leader) => ({
      name: leader.name,
      role: leader.role,
      bio: leader.bio,
      photo: seedImage(leader.photoFile),
      instagram: leader.instagram,
    })),
  );
}

export async function getMinistryArms(): Promise<MinistryArm[]> {
  return fromCms(
    "ministry arms",
    async (payload) => {
      const { docs } = await payload.find({
        collection: "ministry-arms",
        overrideAccess: false,
        limit: 100,
        sort: "order",
        depth: 0,
      });

      return docs.map((doc: Doc) => ({
        slug: doc.slug,
        name: doc.name,
        fullName: doc.fullName,
        description: clean(doc.description),
      })) as MinistryArm[];
    },
    armsSeed.map((arm) => ({ ...arm, description: clean(arm.description) })),
  );
}

/* ------------------------------------------------------ branches & service */

export async function getBranches(): Promise<Branch[]> {
  return fromCms(
    "branches",
    async (payload) => {
      const { docs } = await payload.find({
        collection: "branches",
        overrideAccess: false,
        limit: 100,
        sort: "order",
        depth: 0,
      });

      return docs.map((doc: Doc) => ({
        slug: doc.slug,
        city: doc.city,
        state: doc.state,
        address: clean(doc.address),
        description: doc.description,
        gatherings: Array.isArray(doc.gatherings)
          ? doc.gatherings.map((g: Doc) => g.name)
          : [],
        contactEmail: doc.contactEmail ?? undefined,
        isHeadquarters: Boolean(doc.isHeadquarters),
      })) as Branch[];
    },
    branchesSeed.map((branch) => ({
      ...branch,
      address: clean(branch.address),
    })),
  );
}

export async function getBranch(slug: string): Promise<Branch | undefined> {
  const all = await getBranches();
  return all.find((branch) => branch.slug === slug);
}

export async function getServiceTimes(): Promise<ServiceTime[]> {
  return fromCms(
    "service times",
    async (payload) => {
      const { docs } = await payload.find({
        collection: "service-times",
        overrideAccess: false,
        limit: 100,
        sort: "order",
        depth: 1,
      });

      return docs.map((doc: Doc) => ({
        name: doc.name,
        day: doc.day,
        time: doc.time,
        cadence: doc.cadence,
        location:
          doc.branch && typeof doc.branch === "object"
            ? (doc.branch as Doc).city
            : "",
        note: doc.note ?? undefined,
      })) as ServiceTime[];
    },
    serviceTimesSeed,
  );
}

/* ------------------------------------------------------------ testimonies  */

export async function getTestimonies(): Promise<Testimony[]> {
  return fromCms(
    "testimonies",
    async (payload) => {
      const { docs } = await payload.find({
        collection: "testimonies",
        where: { reviewStatus: { equals: "approved" } } satisfies Where,
        overrideAccess: false,
        limit: 100,
        sort: "-createdAt",
        depth: 0,
      });

      return docs.map((doc: Doc, index: number) => ({
        id: index + 1,
        name: doc.name,
        location: doc.location,
        category: doc.category,
        testimony: doc.testimony,
        date: isoDate(doc.createdAt),
        featured: Boolean(doc.featured),
      })) as Testimony[];
    },
    testimoniesSeed,
  );
}

/* ---------------------------------------------------------------- globals  */

export type SiteSettingsView = {
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  emails: { general: string; partnership: string };
  phones: string[];
  address: { line1: string; line2: string; city: string; country: string };
  socials: { facebook: string; instagram: string; youtube: string; x: string };
  newsletterAudienceSize: string;
  livestreamUrl?: string;
  livestreamNote?: string;
  spotify?: string;
  audiomack?: string;
};

export async function getSiteSettings(): Promise<SiteSettingsView> {
  return fromCms(
    "site settings",
    async (payload) => {
      const doc = (await payload.findGlobal({
        slug: "site-settings",
        overrideAccess: false,
        depth: 0,
      })) as Doc;

      return {
        name: doc.name ?? siteSeed.name,
        shortName: doc.shortName ?? siteSeed.shortName,
        tagline: doc.tagline ?? siteSeed.tagline,
        description: doc.description ?? siteSeed.description,
        emails: {
          general: doc.generalEmail ?? siteSeed.emails.general,
          partnership: doc.partnershipEmail ?? siteSeed.emails.partnership,
        },
        phones: Array.isArray(doc.phones)
          ? doc.phones.map((p: Doc) => p.number)
          : [],
        address: {
          line1: doc.address?.line1 ?? siteSeed.address.line1,
          line2: doc.address?.line2 ?? siteSeed.address.line2,
          city: doc.address?.city ?? siteSeed.address.city,
          country: doc.address?.country ?? siteSeed.address.country,
        },
        socials: {
          facebook: doc.facebook ?? siteSeed.socials.facebook,
          instagram: doc.instagram ?? siteSeed.socials.instagram,
          youtube: doc.youtube ?? siteSeed.socials.youtube,
          x: doc.x ?? siteSeed.socials.x,
        },
        newsletterAudienceSize: siteSeed.newsletterAudienceSize,
        livestreamUrl: doc.livestreamUrl ?? undefined,
        livestreamNote: doc.livestreamNote ?? undefined,
        spotify: doc.spotify ?? channelsSeed.spotify,
        audiomack: doc.audiomack ?? channelsSeed.audiomackEmbed,
      } as SiteSettingsView;
    },
    {
      name: siteSeed.name,
      shortName: siteSeed.shortName,
      tagline: siteSeed.tagline,
      description: siteSeed.description,
      emails: { ...siteSeed.emails },
      phones: siteSeed.phones.filter((phone) => !isTodo(phone)),
      address: { ...siteSeed.address },
      socials: { ...siteSeed.socials },
      newsletterAudienceSize: siteSeed.newsletterAudienceSize,
      spotify: channelsSeed.spotify,
      audiomack: channelsSeed.audiomackEmbed,
    },
  );
}

/** Address as one line, for display and for map queries. */
export function formatAddress(settings: SiteSettingsView): string {
  return [settings.address.line1, settings.address.line2, settings.address.city]
    .filter(Boolean)
    .join(", ");
}

export type AboutContent = {
  mission: string;
  vision: string;
  summary: string[];
  history: string[];
  featuredQuote: string;
  mandate: typeof aboutSeed.mandate;
  ministryFocus: typeof aboutSeed.ministryFocus;
  beliefs: typeof aboutSeed.beliefs;
  values: typeof aboutSeed.values;
};

const aboutFallback: AboutContent = {
  mission: aboutSeed.mission,
  vision: aboutSeed.vision,
  summary: aboutSeed.summary,
  history: aboutSeed.history,
  featuredQuote: aboutSeed.featuredQuote,
  mandate: aboutSeed.mandate,
  ministryFocus: aboutSeed.ministryFocus,
  beliefs: aboutSeed.beliefs,
  values: aboutSeed.values,
};

export async function getAbout(): Promise<AboutContent> {
  return fromCms(
    "about",
    async (payload) => {
      const doc = (await payload.findGlobal({
        slug: "about",
        overrideAccess: false,
        depth: 0,
      })) as Doc;

      const paragraphs = (value: unknown): string[] =>
        Array.isArray(value) ? value.map((p: Doc) => p.text).filter(Boolean) : [];
      const pillars = (value: unknown) =>
        Array.isArray(value)
          ? value.map((p: Doc) => ({
              title: p.title,
              description: p.description,
            }))
          : [];

      return {
        mission: doc.mission ?? aboutFallback.mission,
        vision: doc.vision ?? aboutFallback.vision,
        summary: paragraphs(doc.summary),
        history: paragraphs(doc.history),
        featuredQuote: doc.featuredQuote ?? aboutFallback.featuredQuote,
        mandate: pillars(doc.mandate),
        ministryFocus: pillars(doc.ministryFocus),
        beliefs: pillars(doc.beliefs),
        values: pillars(doc.values),
      } as AboutContent;
    },
    aboutFallback,
  );
}

export type GivingContent = {
  bankAccount: typeof bankSeed;
  impactAreas: ImpactArea[];
  impactStats: ImpactStat[];
  partnerTiers: PartnerTier[];
  paystackEnabled: boolean;
  suggestedAmounts: number[];
  purposes: { label: string; value: string }[];
};

export async function getGiving(): Promise<GivingContent> {
  return fromCms(
    "giving",
    async (payload) => {
      const doc = (await payload.findGlobal({
        slug: "giving",
        overrideAccess: false,
        depth: 0,
      })) as Doc;

      return {
        bankAccount: {
          bankName: doc.bankName ?? bankSeed.bankName,
          accountName: doc.accountName ?? bankSeed.accountName,
          accountNumber: doc.accountNumber ?? bankSeed.accountNumber,
          currency: doc.currency ?? bankSeed.currency,
        },
        impactAreas: Array.isArray(doc.impactAreas) ? doc.impactAreas : [],
        impactStats: Array.isArray(doc.impactStats) ? doc.impactStats : [],
        partnerTiers: Array.isArray(doc.partnerTiers)
          ? doc.partnerTiers.map((tier: Doc) => ({
              name: tier.name,
              amount: tier.amount,
              benefits: Array.isArray(tier.benefits)
                ? tier.benefits.map((b: Doc) => b.text)
                : [],
            }))
          : [],
        paystackEnabled: Boolean(doc.paystackEnabled),
        suggestedAmounts: Array.isArray(doc.suggestedAmounts)
          ? doc.suggestedAmounts.map((a: Doc) => a.amount)
          : [],
        purposes: Array.isArray(doc.purposes) ? doc.purposes : [],
      } as GivingContent;
    },
    {
      bankAccount: bankSeed,
      impactAreas: impactAreasSeed,
      impactStats: impactStatsSeed.filter((stat) => !isTodo(stat.value)),
      partnerTiers: tiersSeed,
      paystackEnabled: false,
      suggestedAmounts: [5000, 10000, 25000, 50000, 100000, 250000],
      purposes: [
        { label: "General ministry support", value: "general" },
        { label: "Missions and outreaches", value: "missions" },
        { label: "Ministers training", value: "training" },
        { label: "Media outreach", value: "media" },
      ],
    },
  );
}
