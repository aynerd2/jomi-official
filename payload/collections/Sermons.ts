import type { CollectionConfig } from "payload";

import { isContributor, isEditor } from "../access/roles";

export const Sermons: CollectionConfig = {
  slug: "sermons",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "speaker", "date", "category", "_status"],
    group: "Content",
    description:
      "The message library. Drafts stay off the public site until published.",
  },
  versions: {
    drafts: { autosave: false },
  },
  access: {
    // Drafts are visible to signed-in staff only.
    read: ({ req }) => {
      if (req.user) return true;
      return { _status: { equals: "published" } };
    },
    create: isContributor,
    update: isContributor,
    delete: isEditor,
  },
  fields: [
    { name: "title", type: "text", required: true },
    {
      type: "row",
      fields: [
        {
          name: "speaker",
          type: "text",
          required: true,
          defaultValue: "Apostle Jide Ojo",
          admin: { width: "50%" },
        },
        {
          name: "date",
          type: "date",
          required: true,
          admin: {
            width: "50%",
            date: { pickerAppearance: "dayOnly", displayFormat: "d MMM yyyy" },
          },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "category",
          type: "text",
          admin: { width: "50%", description: "e.g. Grace, Healing, Identity" },
        },
        { name: "series", type: "text", admin: { width: "50%" } },
      ],
    },
    {
      name: "duration",
      type: "text",
      admin: { description: "e.g. 1:15:30" },
    },
    { name: "description", type: "textarea", required: true },
    {
      name: "videoUrl",
      type: "text",
      admin: { description: "YouTube link for this message." },
    },
    {
      name: "audioUrl",
      type: "text",
      admin: { description: "Audiomack, Spotify or another audio link." },
    },
    {
      name: "thumbnail",
      type: "upload",
      relationTo: "media",
      admin: { description: "Optional. YouTube supplies one if left empty." },
    },
    {
      name: "featured",
      type: "checkbox",
      defaultValue: false,
      admin: { description: "Featured messages lead the library." },
    },
  ],
};
