// Seed content: messages, worship and publications.
// Phase 3 moves these into the Payload `sermons` and `books` collections.

import { TODO } from "./todo";
import { siteSettings } from "./site";

export interface Sermon {
  id: number;
  title: string;
  speaker: string;
  /** ISO date (YYYY-MM-DD). */
  date: string;
  duration: string;
  category: string;
  series?: string;
  description: string;
  /** YouTube watch URL, or an embed URL for the player. */
  videoUrl?: string;
  audioUrl?: string;
  featured?: boolean;
}

// Deliberately empty. The eight sermons that were here were fabricated, and every
// video link pointed at the same unrelated YouTube video.
// TODO: confirm with client - send through the real messages to seed the library
// (title, speaker, date, YouTube link, series), or we point visitors at the channel
// until Phase 3 makes this editable in the dashboard.
export const sermons: Sermon[] = [];

export const sermonCategories = [
  "Doctrine",
  "Identity",
  "Grace",
  "Healing",
  "Faith",
  "Holy Spirit",
  "Freedom",
];

export const channels = {
  youtube: siteSettings.socials.youtube,
  // TODO: confirm with client - is there an official Spotify artist/show page? This is
  // currently a search link, not a verified profile.
  spotify: "https://open.spotify.com/search/Apostle%20Jide%20Ojo",
  // TODO: confirm with client - is this Audiomack upload official?
  audiomackEmbed: "https://audiomack.com/embed/apostle-jide-ojo/song/iwo-ni-o",
  featuredWorshipTitle: "Iwo Ni O",
};

export interface Book {
  id: number;
  title: string;
  author: string;
  /** Display price, e.g. "NGN 5,000". */
  price: string;
  description: string;
}

// TODO: confirm with client - do these two titles exist, what are the real prices,
// and can you supply cover images? The previous listing used stock photos as covers
// and prices that could not be verified.
export const books: Book[] = [
  {
    id: 1,
    title: "The Finished Works of Christ",
    author: "Apostle Jide Ojo",
    price: TODO,
    description:
      "A comprehensive guide to understanding your reality in Christ.",
  },
  {
    id: 2,
    title: "Grace for the Nations",
    author: "Apostle Jide Ojo",
    price: TODO,
    description: "Understanding the apostolic mandate for global impact.",
  },
];
