import type { CollectionConfig } from "payload";

import { anyone, isContributor, isEditor } from "../access/roles";

export const Books: CollectionConfig = {
  slug: "books",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "author", "price", "available"],
    group: "Content",
  },
  access: {
    read: anyone,
    create: isContributor,
    update: isContributor,
    delete: isEditor,
  },
  fields: [
    { name: "title", type: "text", required: true },
    {
      name: "author",
      type: "text",
      required: true,
      defaultValue: "Apostle Jide Ojo",
    },
    { name: "description", type: "textarea", required: true },
    {
      name: "price",
      type: "text",
      admin: {
        description:
          "Display price, e.g. NGN 5,000. Left empty, the card shows an enquiry link instead of a price.",
      },
    },
    { name: "cover", type: "upload", relationTo: "media" },
    {
      name: "available",
      type: "checkbox",
      defaultValue: true,
      admin: {
        description: "Untick to keep the listing but mark it unavailable.",
      },
    },
  ],
};
