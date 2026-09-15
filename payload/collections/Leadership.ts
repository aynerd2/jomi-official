import type { CollectionConfig } from "payload";

import { anyone, isEditor } from "../access/roles";

export const Leadership: CollectionConfig = {
  slug: "leadership",
  labels: { singular: "Leader", plural: "Leadership" },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "role", "order"],
    group: "Content",
  },
  access: {
    read: anyone,
    // Leadership profiles carry the public representation of the ministry, so
    // they sit with editors rather than contributors.
    create: isEditor,
    update: isEditor,
    delete: isEditor,
  },
  defaultSort: "order",
  fields: [
    { name: "name", type: "text", required: true },
    {
      name: "role",
      type: "text",
      required: true,
      admin: { description: "e.g. President, JOMI" },
    },
    { name: "bio", type: "textarea", required: true },
    { name: "photo", type: "upload", relationTo: "media" },
    {
      type: "row",
      fields: [
        { name: "instagram", type: "text", admin: { width: "50%" } },
        {
          name: "order",
          type: "number",
          defaultValue: 0,
          admin: { width: "50%", description: "Lower numbers appear first." },
        },
      ],
    },
  ],
};
