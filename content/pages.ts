/**
 * Page headings and hero copy, as the defaults for the "Page content" global
 * and the extra sections on the "Home page" global.
 *
 * These are the words the pages showed before the copy moved into the CMS. Any
 * field an editor leaves empty falls back to the value here, so a half-filled
 * global never leaves a blank heading on the site.
 *
 * Images are filenames (see assets/registry.ts), so this module stays readable
 * by plain Node as well as the bundler.
 */

export type SectionCopy = {
  eyebrow: string;
  title: string;
  lede: string;
  imageFile?: string;
  imageAlt?: string;
};

export type PageCopy = {
  metaDescription: string;
  hero: SectionCopy;
  sections: Record<string, SectionCopy>;
};

const section = (
  eyebrow: string,
  title: string,
  lede = "",
  image?: { file: string; alt: string },
): SectionCopy => ({
  eyebrow,
  title,
  lede,
  ...(image ? { imageFile: image.file, imageAlt: image.alt } : {}),
});

/** Sections of the home page below the hero, held on the Home page global. */
export const homeSections = {
  about: section("About the ministry", "Revealing Christ to the nations", "", {
    file: "Daddy1.jpg",
    alt: "Apostle Jide Ojo ministering",
  }),
  events: section(
    "What's on",
    "Join us at our next gathering",
    "Services, conferences, seminars and apostolic missions through the year.",
  ),
  testimonies: section(
    "Testimonies",
    "What God has done",
    "We are gathering testimonies from across the nations. If the Lord has met you through this ministry, we would love to hear your story.",
  ),
  newsletter: section(
    "",
    "Stay connected with the move of God",
    "Be the first to hear about upcoming services, conferences and new releases from the ministry.",
  ),
} satisfies Record<string, SectionCopy>;

export type HomeSectionKey = keyof typeof homeSections;

/** Interior pages, held on the Page content global. */
export const pages = {
  about: {
    metaDescription:
      "The history, mandate, leadership, ministry arms and beliefs of Jide Ojo Ministry International.",
    hero: section(
      "About us",
      "Unveiling the glory of God",
      "An apostolic movement committed to revealing Christ and raising a triumphant generation in every nation.",
      { file: "apostle-and-pastor-ojo.webp", alt: "Apostle Jide Ojo and Pastor Funmi Ojo" },
    ),
    sections: {
      history: section("Our history", "How JOMI was born", "", {
        file: "Jomi_Start.jpg",
        alt: "The early days of Jide Ojo Ministry International",
      }),
      leadership: section(
        "Leadership",
        "Apostolic leadership",
        "Guided by the Spirit to shepherd God's people into their inheritance.",
      ),
      mandate: section("Our mandate", "What we are sent to do"),
      ministryFocus: section("Ministry focus", "How we build the body of Christ"),
      arms: section(
        "Our ministries",
        "The arms of JOMI",
        "The ministry serves through a number of arms, each with its own focus and gathering.",
      ),
      beliefs: section("What we believe", "Our beliefs"),
      values: section("How we carry it", "Our core values"),
    },
  },
  events: {
    metaDescription:
      "Services, conferences, seminars and apostolic missions with Jide Ojo Ministry International.",
    hero: section(
      "Ministry calendar",
      "Come and be part of what God is doing",
      "Services, conferences, seminars and apostolic missions through the year. Everyone is welcome.",
      { file: "audience.jpg", alt: "Congregation gathered in worship" },
    ),
    sections: {},
  },
  media: {
    metaDescription:
      "Messages, worship and publications from Apostle Jide Ojo and Jide Ojo Ministry International.",
    hero: section(
      "Messages & resources",
      "Equip yourself",
      "Teaching on the finished works of Christ, worship, and written resources to build your faith.",
      { file: "Daddy2.jpg", alt: "Apostle Jide Ojo teaching" },
    ),
    sections: {
      messages: section("Messages", "Recent teaching", "Search by topic, speaker or series."),
      publications: section(
        "Publications",
        "Books & written teaching",
        "Written teaching from Apostle Jide Ojo.",
      ),
    },
  },
  gallery: {
    metaDescription:
      "Photographs from the services, conferences and outreaches of Jide Ojo Ministry International.",
    hero: section(
      "Gallery",
      "Moments from the ministry",
      "Services, conferences and outreaches, as the Lord has led us across cities and nations.",
    ),
    sections: {},
  },
  testimonies: {
    metaDescription:
      "Testimonies of salvation, healing and restoration through Jide Ojo Ministry International.",
    hero: section(
      "Testimonies",
      "Give glory to God",
      "Testimonies of salvation, healing and restoration from those the Lord has touched through this ministry.",
      { file: "Testimony.jpg", alt: "Worshippers with hands raised" },
    ),
    sections: {
      list: section("In their words", "What God has done"),
    },
  },
  contact: {
    metaDescription:
      "Service times, locations and how to reach Jide Ojo Ministry International for enquiries, prayer requests and ministry engagements.",
    hero: section(
      "Contact",
      "Get in touch",
      "We would love to hear from you. Reach out for enquiries, prayer requests, or ministry engagements.",
      { file: "Daddy3.jpg", alt: "Apostle Jide Ojo greeting the congregation" },
    ),
    sections: {
      serviceTimes: section(
        "Plan your visit",
        "Service times",
        "Join us in person or online. All times are West Africa Time (WAT).",
      ),
    },
  },
  partner: {
    metaDescription:
      "Support the mission of Jide Ojo Ministry International through giving and monthly partnership.",
    hero: section(
      "Partnership",
      "Multiply your impact",
      "Your partnership enables us to reach more nations, train more leaders, and take the gospel further.",
      { file: "Partner.jpg", alt: "Ministry partners gathered together" },
    ),
    sections: {
      impactAreas: section("Your giving at work", "Where your seed goes"),
      monthly: section(
        "Go further",
        "Become a monthly partner",
        "Monthly partners carry this work with us, in prayer and in giving.",
      ),
      impactStats: section("Impact", "Your partnership in numbers"),
    },
  },
  branches: {
    metaDescription:
      "Where Jide Ojo Ministry International gathers across Nigeria: Abuja, Lagos, Ibadan, Akure, Osogbo and Ado-Ekiti.",
    hero: section(
      "Our centres",
      "Where we gather",
      "The ministry gathers across Nigeria and travels for apostolic missions through the year. Find the centre nearest you.",
    ),
    sections: {},
  },
} satisfies Record<string, PageCopy>;

export type PageKey = keyof typeof pages;

/** The home page hero and bands, held on the Home page global. */
export const homeHero = {
  eyebrow: "Welcome to JOMI",
  headline: "Glorifying the *Finished Works* of Christ",
  lede: "A global movement revealing the fullness of Christ and raising a triumphant generation that walks in dominion, grace and apostolic authority.",
  primaryCtaLabel: "Plan your visit",
  primaryCtaHref: "/contact",
  secondaryCtaLabel: "Watch messages",
  secondaryCtaHref: "/media",
};

export const homeBands = {
  watchOnline: {
    heading: "Cannot be there in person? Join us wherever you are.",
    body: "Our services and conferences are published on YouTube, so you can watch the teaching wherever you are in the world.",
  },
  partner: {
    heading: "Partner with the Great Commission",
    body: "Your partnership takes the gospel to unreached nations, trains leaders, and demonstrates the love of Christ to a hurting world.",
  },
};
