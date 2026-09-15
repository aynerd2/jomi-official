import type { GlobalConfig } from "payload";

import { anyone, isEditor } from "../access/roles";

/** Reusable shape for the titled-paragraph lists used across the About page. */
const pillarFields = [
  { name: "title", type: "text" as const, required: true },
  { name: "description", type: "textarea" as const, required: true },
];

export const About: GlobalConfig = {
  slug: "about",
  label: "About the ministry",
  admin: {
    group: "Settings",
    description:
      "History, mission, vision, mandate, beliefs and values, as shown on the About page and the home page.",
  },
  access: {
    read: anyone,
    update: isEditor,
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Story",
          fields: [
            { name: "mission", type: "textarea", required: true },
            { name: "vision", type: "textarea", required: true },
            {
              name: "summary",
              type: "array",
              labels: { singular: "Paragraph", plural: "Summary paragraphs" },
              admin: { description: "The short version, used on the home page." },
              fields: [{ name: "text", type: "textarea", required: true }],
            },
            {
              name: "history",
              type: "array",
              labels: { singular: "Paragraph", plural: "History paragraphs" },
              fields: [{ name: "text", type: "textarea", required: true }],
            },
            {
              name: "featuredQuote",
              type: "textarea",
              admin: { description: "The pull quote on the home page." },
            },
            {
              name: "featuredQuoteAttribution",
              type: "text",
              admin: { description: "Who said it." },
            },
          ],
        },
        {
          label: "Mandate & focus",
          fields: [
            {
              name: "mandate",
              type: "array",
              labels: { singular: "Pillar", plural: "Mandate" },
              fields: pillarFields,
            },
            {
              name: "ministryFocus",
              type: "array",
              labels: { singular: "Pillar", plural: "Ministry focus" },
              fields: pillarFields,
            },
          ],
        },
        {
          label: "Beliefs & values",
          fields: [
            {
              name: "beliefs",
              type: "array",
              labels: { singular: "Belief", plural: "Beliefs" },
              fields: pillarFields,
            },
            {
              name: "values",
              type: "array",
              labels: { singular: "Value", plural: "Values" },
              fields: pillarFields,
            },
          ],
        },
      ],
    },
  ],
};
