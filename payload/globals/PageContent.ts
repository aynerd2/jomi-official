import type { Field, GlobalConfig, Tab } from "payload";

import { anyone, isEditor } from "../access/roles";
import { sectionCopyField } from "../fields/sectionCopy";
import { pages, type PageKey } from "../../content/pages";

const tabLabels: Record<PageKey, string> = {
  about: "About",
  events: "Events",
  media: "Messages",
  gallery: "Gallery",
  testimonies: "Testimonies",
  contact: "Contact",
  partner: "Partner",
  branches: "Centres",
};

/** Admin labels for each section, in the order they appear on the page. */
const sectionLabels: Record<string, string> = {
  history: "History section",
  leadership: "Leadership section",
  mandate: "Mandate section",
  ministryFocus: "Ministry focus section",
  arms: "Ministry arms section",
  beliefs: "Beliefs column",
  values: "Core values column",
  messages: "Messages section",
  publications: "Books section",
  list: "Testimonies list",
  serviceTimes: "Service times section",
  impactAreas: "Where your seed goes",
  monthly: "Monthly partnership",
  impactStats: "Impact figures band",
};

function pageTab(key: PageKey): Tab {
  const page = pages[key];
  const sections: Field[] = Object.entries(page.sections).map(([name, copy]) =>
    sectionCopyField(name, sectionLabels[name] ?? name, copy),
  );

  return {
    name: key,
    label: tabLabels[key],
    fields: [
      sectionCopyField("hero", "Page header", page.hero, { image: true }),
      ...sections,
      {
        name: "metaDescription",
        label: "Search description",
        type: "textarea",
        defaultValue: page.metaDescription,
        admin: {
          description:
            "Shown under the page title in Google results and link previews. One or two sentences.",
        },
      },
    ],
  };
}

export const PageContent: GlobalConfig = {
  slug: "pages",
  label: "Page content",
  admin: {
    group: "Settings",
    description:
      "Headings, introductions and header photos for each page of the site. Anything left empty shows the original wording.",
  },
  access: {
    read: anyone,
    update: isEditor,
  },
  fields: [
    {
      type: "tabs",
      tabs: (Object.keys(pages) as PageKey[]).map(pageTab),
    },
  ],
};
