import type { CollectionConfig } from "payload";

import { anyone, isContributor, isEditor } from "../access/roles";

export const MinistryArms: CollectionConfig = {
  slug: "ministry-arms",
  labels: { singular: "Ministry arm", plural: "Ministry arms" },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "fullName", "slug", "order"],
    group: "Content",
    description:
      "The arms of the ministry. The slug is the anchor the navigation dropdown links to on the About page, so changing it breaks that link.",
  },
  access: {
    read: anyone,
    create: isContributor,
    update: isContributor,
    delete: isEditor,
  },
  defaultSort: "order",
  fields: [
    {
      type: "row",
      fields: [
        { name: "name", type: "text", required: true, admin: { width: "50%" } },
        {
          name: "slug",
          type: "text",
          required: true,
          unique: true,
          admin: {
            width: "50%",
            description: "Lowercase and hyphenated, e.g. zbi",
          },
        },
      ],
    },
    {
      name: "fullName",
      type: "text",
      required: true,
      admin: { description: "What the acronym stands for." },
    },
    {
      name: "description",
      type: "textarea",
      admin: {
        description:
          "Who it is for, how often it meets, and how someone joins. Left empty, the card simply shows nothing.",
      },
    },
    {
      name: "order",
      type: "number",
      defaultValue: 0,
      admin: { description: "Lower numbers appear first." },
    },
  ],
};
