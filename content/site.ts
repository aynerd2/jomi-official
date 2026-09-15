// Seed content: site-wide settings, service times and branches.
// Phase 3 moves these into Payload globals (`site-settings`, `service-times`, `branches`).

import { TODO } from "./todo";

export const siteSettings = {
  name: "Jide Ojo Ministry International",
  shortName: "JOMI",
  tagline: "Glorifying the Finished Works of Christ",
  description:
    "An apostolic ministry taking the revelation of the finished works of Christ to cities and nations through services, conferences, training and apostolic missions.",

  // TODO: confirm with client - is jomiministry.org owned, and are these mailboxes live?
  emails: {
    general: "info@jomiministry.org",
    partnership: "partnership@jomiministry.org",
  },

  // The numbers previously shown here were placeholders and have been removed.
  phones: [TODO],

  // TODO: confirm with client - is this the ministry's own address, or a venue it hires?
  address: {
    line1: "The Statement Hotel, 1002 First Ave",
    line2: "Opp. Adamawa Plaza, After Federal High Court",
    city: "Central Business District, Abuja",
    country: "Nigeria",
  },

  socials: {
    facebook: "https://www.facebook.com/PastorJideOjo/",
    instagram: "https://www.instagram.com/officialjomi_/",
    youtube: "https://www.youtube.com/@Apostlejideojo",
    x: "https://www.x.com/Officialjomi_?s=20",
  },

  // TODO: confirm with client - the newsletter previously claimed "20,000+ believers".
  newsletterAudienceSize: TODO,
} as const;

export const fullAddress = [
  siteSettings.address.line1,
  siteSettings.address.line2,
  siteSettings.address.city,
].join(", ");

export interface ServiceTime {
  name: string;
  day: string;
  time: string;
  cadence: "Weekly" | "Monthly";
  location: string;
  note?: string;
}

// Derived from the ministry's own 2026 calendar rather than invented, but the
// pattern still needs signing off.
// TODO: confirm with client - these recurring times, and whether any are streamed online.
export const serviceTimes: ServiceTime[] = [
  {
    name: "Triumphant Service",
    day: "Sunday",
    time: "9:00 AM WAT",
    cadence: "Weekly",
    location: "Abuja",
    note: "Some Sundays add a second service at 4:00 PM WAT.",
  },
  {
    name: "Global Apostolic Midweek Service",
    day: "Wednesday",
    time: "6:00 PM WAT",
    cadence: "Weekly",
    location: "Abuja",
  },
  {
    name: "Friendship Service",
    day: "Last Sunday of the month",
    time: "9:00 AM and 5:00 PM WAT",
    cadence: "Monthly",
    location: "Lagos",
  },
  {
    name: "When Husbands and Wives Pray",
    day: "Monday",
    time: "6:00 PM WAT",
    cadence: "Monthly",
    location: "Abuja",
  },
  {
    name: "When Singles Pray",
    day: "Monday",
    time: "6:00 PM WAT",
    cadence: "Monthly",
    location: "Abuja",
  },
  {
    name: "Pregnant Women's Meeting",
    day: "Thursday",
    time: "10:00 AM WAT",
    cadence: "Monthly",
    location: "Abuja",
  },
];

export interface Branch {
  /** URL segment for /branches/<slug>. */
  slug: string;
  city: string;
  state: string;
  address: string;
  /** What happens at this centre. */
  description: string;
  /** Which of the recurring gatherings meet here, by name. */
  gatherings: string[];
  contactEmail?: string;
  isHeadquarters?: boolean;
}

// The calendar shows regular ministry in each of these cities.
// TODO: confirm with client - which are standing branches vs. visiting locations,
// and supply the street address and a contact for each.
export const branches: Branch[] = [
  {
    slug: "abuja",
    city: "Abuja",
    state: "FCT",
    address: fullAddress,
    description:
      "The headquarters of the ministry, where the weekly Triumphant Service and the Global Apostolic Midweek Service are held.",
    gatherings: [
      "Triumphant Service",
      "Global Apostolic Midweek Service",
      "When Husbands and Wives Pray",
      "When Singles Pray",
      "Pregnant Women's Meeting",
    ],
    contactEmail: siteSettings.emails.general,
    isHeadquarters: true,
  },
  {
    slug: "lagos",
    city: "Lagos",
    state: "Lagos State",
    address: TODO,
    description:
      "The Lagos centre hosts the monthly Friendship Service and the Lagos Apostolic Meeting.",
    gatherings: ["Friendship Service", "Lagos Apostolic Meeting"],
  },
  {
    slug: "ibadan",
    city: "Ibadan",
    state: "Oyo State",
    address: TODO,
    description:
      "The Ibadan centre hosts apostolic visits through the year, and joins the midweek service online.",
    gatherings: ["Ibadan Apostolic Visit", "Global Apostolic Midweek Service"],
  },
  {
    slug: "akure",
    city: "Akure",
    state: "Ondo State",
    address: TODO,
    description:
      "The Akure centre hosts apostolic visits and gatherings through the year.",
    gatherings: ["Akure Apostolic Visit", "Triumphant Service"],
  },
  {
    slug: "osogbo",
    city: "Osogbo",
    state: "Osun State",
    address: TODO,
    description:
      "The Osogbo centre hosts apostolic visits and the Saturate Osogbo outreach.",
    gatherings: ["Oshogbo Apostolic Visit", "Saturate Osogbo"],
  },
  {
    slug: "ado-ekiti",
    city: "Ado-Ekiti",
    state: "Ekiti State",
    address: TODO,
    description:
      "Ekiti hosts the Saturate Ekiti outreach and the School of Ministry at Oye-Ekiti.",
    gatherings: ["Saturate Ekiti", "SOM (School of Ministry)"],
  },
];

export function branchBySlug(slug: string): Branch | undefined {
  return branches.find((branch) => branch.slug === slug);
}
