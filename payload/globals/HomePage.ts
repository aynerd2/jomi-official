import type { GlobalConfig } from "payload";

import { anyone, isEditor } from "../access/roles";
import { sectionCopyField } from "../fields/sectionCopy";
import { homeBands, homeHero, homeSections } from "../../content/pages";

export const HomePage: GlobalConfig = {
  slug: "home",
  label: "Home page",
  admin: {
    group: "Settings",
    description:
      "The hero, the section headings and the bands on the home page. Anything left empty shows the original wording.",
  },
  access: {
    read: anyone,
    update: isEditor,
  },
  fields: [
    {
      name: "hero",
      type: "group",
      fields: [
        { name: "eyebrow", type: "text", defaultValue: homeHero.eyebrow },
        {
          name: "headline",
          type: "text",
          required: true,
          defaultValue: homeHero.headline,
          admin: {
            description:
              "Wrap the words that should appear in gold with *asterisks*, e.g. Glorifying the *Finished Works* of Christ.",
          },
        },
        { name: "lede", type: "textarea", required: true, defaultValue: homeHero.lede },
        {
          name: "portrait",
          type: "upload",
          relationTo: "media",
          admin: {
            description:
              "The portrait beside the headline. Left empty, the first leader's photo is used.",
          },
        },
        {
          type: "row",
          fields: [
            {
              name: "primaryCtaLabel",
              type: "text",
              defaultValue: homeHero.primaryCtaLabel,
              admin: { width: "50%" },
            },
            {
              name: "primaryCtaHref",
              type: "text",
              defaultValue: homeHero.primaryCtaHref,
              admin: { width: "50%" },
            },
          ],
        },
        {
          type: "row",
          fields: [
            {
              name: "secondaryCtaLabel",
              type: "text",
              defaultValue: homeHero.secondaryCtaLabel,
              admin: { width: "50%" },
            },
            {
              name: "secondaryCtaHref",
              type: "text",
              defaultValue: homeHero.secondaryCtaHref,
              admin: { width: "50%" },
            },
          ],
        },
      ],
    },
    {
      name: "watchOnline",
      type: "group",
      label: "Watch online band",
      fields: [
        {
          name: "heading",
          type: "text",
          defaultValue: homeBands.watchOnline.heading,
        },
        { name: "body", type: "textarea", defaultValue: homeBands.watchOnline.body },
      ],
    },
    {
      name: "partnerBand",
      type: "group",
      label: "Partnership band",
      fields: [
        {
          name: "heading",
          type: "text",
          defaultValue: homeBands.partner.heading,
        },
        { name: "body", type: "textarea", defaultValue: homeBands.partner.body },
      ],
    },
    {
      name: "sections",
      type: "group",
      label: "Section headings",
      fields: [
        sectionCopyField("about", "About section", homeSections.about),
        sectionCopyField("events", "Upcoming events section", homeSections.events),
        sectionCopyField("testimonies", "Testimonies section", homeSections.testimonies),
        sectionCopyField("newsletter", "Newsletter sign-up", homeSections.newsletter),
      ],
    },
  ],
};
