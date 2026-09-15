// Seed content: the arms of the ministry. Phase 3 moves this into the Payload
// `ministry-arms` collection.
//
// The `slug` is the anchor the navigation dropdown links to on /about, so it must
// stay in step with the ids rendered there.

import { TODO } from "./todo";

export interface MinistryArm {
  slug: string;
  name: string;
  fullName: string;
  description: string;
}

// TODO: confirm with client - a one or two sentence description of each arm:
// who it is for, how often it meets, and how someone joins.
export const ministryArms: MinistryArm[] = [
  {
    slug: "nrcc",
    name: "NRCC",
    fullName: "New Reality Christian Centre",
    description: TODO,
  },
  {
    slug: "zbi",
    name: "ZBI",
    fullName: "Zoe Bible Institute",
    description: TODO,
  },
  {
    slug: "jafoms",
    name: "JAFOMS",
    fullName: "Jide and Funmi Ojo Mentoring School",
    description: TODO,
  },
  {
    slug: "imrc",
    name: "IMRC",
    fullName: "International Ministers' Refresher Conference",
    description: TODO,
  },
  {
    slug: "sdpc",
    name: "SDPC",
    fullName: "Spiritual Development & Pastoral Care",
    description: TODO,
  },
  {
    slug: "motl",
    name: "MOTL",
    fullName: "Men of the Light",
    description: TODO,
  },
  {
    slug: "beulah",
    name: "Beulah",
    fullName: "Beulah Outreaches",
    description: TODO,
  },
  {
    slug: "pregnant-womens-meeting",
    name: "Pregnant Women's Meeting",
    fullName: "Pregnant Women's Meeting",
    description: TODO,
  },
  {
    slug: "when-singles-pray",
    name: "When Singles Pray",
    fullName: "When Singles Pray",
    description: TODO,
  },
  {
    slug: "grooming-the-groom",
    name: "Grooming the Groom",
    fullName: "Grooming the Groom (GTG)",
    description: TODO,
  },
];
