import type { GlobalConfig } from "payload";

import { anyone, isEditor } from "../access/roles";

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  label: "Site settings",
  admin: {
    group: "Settings",
    description:
      "Contact details, social links and the live stream. These appear in the header, the footer and the contact page.",
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
          label: "Identity",
          fields: [
            { name: "name", type: "text", required: true },
            { name: "shortName", type: "text", required: true },
            { name: "tagline", type: "text", required: true },
            { name: "description", type: "textarea", required: true },
          ],
        },
        {
          label: "Contact",
          fields: [
            {
              type: "row",
              fields: [
                {
                  name: "generalEmail",
                  type: "email",
                  required: true,
                  admin: { width: "50%" },
                },
                {
                  name: "partnershipEmail",
                  type: "email",
                  admin: { width: "50%" },
                },
              ],
            },
            {
              name: "phones",
              type: "array",
              labels: { singular: "Phone number", plural: "Phone numbers" },
              admin: {
                description:
                  "Left empty, the contact page simply omits the phone card.",
              },
              fields: [
                { name: "number", type: "text", required: true },
                {
                  name: "label",
                  type: "text",
                  admin: { description: "e.g. Office, WhatsApp" },
                },
              ],
            },
            {
              name: "address",
              type: "group",
              fields: [
                { name: "line1", type: "text" },
                { name: "line2", type: "text" },
                { name: "city", type: "text" },
                { name: "country", type: "text", defaultValue: "Nigeria" },
              ],
            },
          ],
        },
        {
          label: "Social",
          fields: [
            {
              type: "row",
              fields: [
                { name: "facebook", type: "text", admin: { width: "50%" } },
                { name: "instagram", type: "text", admin: { width: "50%" } },
              ],
            },
            {
              type: "row",
              fields: [
                { name: "youtube", type: "text", admin: { width: "50%" } },
                { name: "x", type: "text", admin: { width: "50%" } },
              ],
            },
            {
              type: "row",
              fields: [
                { name: "spotify", type: "text", admin: { width: "50%" } },
                { name: "audiomack", type: "text", admin: { width: "50%" } },
              ],
            },
          ],
        },
        {
          label: "Live stream",
          description:
            "When a stream URL is set, the watch-online band becomes a live embed with a countdown to the next service. Left empty, it links to the YouTube channel instead.",
          fields: [
            {
              name: "livestreamUrl",
              type: "text",
              admin: {
                description:
                  "The YouTube live URL, or any embeddable stream link.",
              },
            },
            {
              name: "livestreamPlatform",
              type: "select",
              defaultValue: "youtube",
              options: [
                { label: "YouTube", value: "youtube" },
                { label: "Facebook", value: "facebook" },
                { label: "Other", value: "other" },
              ],
            },
            {
              name: "livestreamNote",
              type: "text",
              admin: {
                description:
                  "Shown beside the stream, e.g. Sundays from 8:45 AM WAT.",
              },
            },
          ],
        },
      ],
    },
  ],
};
