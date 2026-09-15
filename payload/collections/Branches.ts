import type { CollectionConfig } from "payload";

import { anyone, isContributor, isEditor } from "../access/roles";

export const Branches: CollectionConfig = {
  slug: "branches",
  labels: { singular: "Centre", plural: "Centres" },
  admin: {
    useAsTitle: "city",
    defaultColumns: ["city", "state", "isHeadquarters", "order"],
    group: "Content",
    description: "Where the ministry gathers. Each one gets its own page.",
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
        { name: "city", type: "text", required: true, admin: { width: "40%" } },
        { name: "state", type: "text", required: true, admin: { width: "30%" } },
        {
          name: "slug",
          type: "text",
          required: true,
          unique: true,
          admin: {
            width: "30%",
            description: "URL segment, e.g. ado-ekiti",
          },
        },
      ],
    },
    {
      name: "address",
      type: "textarea",
      admin: {
        description:
          "Street address. Left empty, the page omits the address and the map rather than showing a placeholder.",
      },
    },
    { name: "description", type: "textarea", required: true },
    {
      name: "gatherings",
      type: "array",
      labels: { singular: "Gathering", plural: "Gatherings" },
      admin: { description: "Meetings and outreaches held at this centre." },
      fields: [{ name: "name", type: "text", required: true }],
    },
    {
      type: "row",
      fields: [
        { name: "contactEmail", type: "email", admin: { width: "50%" } },
        { name: "contactPhone", type: "text", admin: { width: "50%" } },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "isHeadquarters",
          type: "checkbox",
          defaultValue: false,
          admin: { width: "50%" },
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
