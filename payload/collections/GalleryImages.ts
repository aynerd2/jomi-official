import type { CollectionConfig } from "payload";

import { anyone, isContributor, isEditor } from "../access/roles";

export const GalleryImages: CollectionConfig = {
  slug: "gallery",
  labels: { singular: "Gallery image", plural: "Gallery" },
  admin: {
    useAsTitle: "caption",
    defaultColumns: ["caption", "image", "takenAt", "order"],
    group: "Content",
    description: "Photographs shown on the gallery page.",
  },
  access: {
    read: anyone,
    create: isContributor,
    update: isContributor,
    delete: isEditor,
  },
  defaultSort: "order",
  fields: [
    { name: "image", type: "upload", relationTo: "media", required: true },
    {
      name: "caption",
      type: "text",
      required: true,
      admin: { description: "What is happening, where, and when." },
    },
    {
      type: "row",
      fields: [
        {
          name: "takenAt",
          type: "date",
          admin: {
            width: "50%",
            date: { pickerAppearance: "dayOnly", displayFormat: "MMM yyyy" },
          },
        },
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
