import type { GlobalConfig } from "payload";

import { anyone, isEditor } from "../access/roles";

export const HomePage: GlobalConfig = {
  slug: "home",
  label: "Home page",
  admin: {
    group: "Settings",
    description: "The hero and the section headings on the home page.",
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
        { name: "eyebrow", type: "text", defaultValue: "Welcome to JOMI" },
        {
          name: "headline",
          type: "text",
          required: true,
          admin: {
            description:
              "Wrap the words that should appear in gold with *asterisks*, e.g. Glorifying the *Finished Works* of Christ.",
          },
        },
        { name: "lede", type: "textarea", required: true },
        {
          name: "portrait",
          type: "upload",
          relationTo: "media",
          admin: { description: "The portrait beside the headline." },
        },
        {
          type: "row",
          fields: [
            {
              name: "primaryCtaLabel",
              type: "text",
              defaultValue: "Plan your visit",
              admin: { width: "50%" },
            },
            {
              name: "primaryCtaHref",
              type: "text",
              defaultValue: "/contact",
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
              defaultValue: "Watch messages",
              admin: { width: "50%" },
            },
            {
              name: "secondaryCtaHref",
              type: "text",
              defaultValue: "/media",
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
          defaultValue: "Cannot be there in person? Join us wherever you are.",
        },
        { name: "body", type: "textarea" },
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
          defaultValue: "Partner with the Great Commission",
        },
        { name: "body", type: "textarea" },
      ],
    },
  ],
};
