// Seed content: testimonies. Phase 3 moves this into the Payload `testimonies`
// collection, where each one is reviewed before it is published.
//
// Deliberately empty. The six testimonies that shipped here originally were
// fabricated: invented healings and financial breakthroughs, attributed to
// made-up people, illustrated with stock photos of strangers.
//
// TODO: confirm with client - send through real testimonies, from real people
// who have agreed to them being published, with their city and country.

export interface Testimony {
  id: number;
  name: string;
  location: string;
  category: string;
  testimony: string;
  /** ISO date (YYYY-MM-DD). */
  date: string;
  featured?: boolean;
}

export const testimonies: Testimony[] = [];

export const testimonyCategories = [
  "Healing",
  "Salvation",
  "Provision",
  "Ministry Impact",
  "Leadership",
  "Deliverance",
];
