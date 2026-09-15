import type { CollectionConfig } from "payload";

import { anyone, isContributor, isEditor } from "../access/roles";

export const ServiceTimes: CollectionConfig = {
  slug: "service-times",
  labels: { singular: "Service time", plural: "Service times" },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "day", "time", "cadence", "branch"],
    group: "Content",
    description:
      "Recurring gatherings. These appear on the home page, the contact page and each centre page.",
  },
  access: {
    read: anyone,
    create: isContributor,
    update: isContributor,
    delete: isEditor,
  },
  defaultSort: "order",
  fields: [
    { name: "name", type: "text", required: true },
    {
      type: "row",
      fields: [
        {
          name: "day",
          type: "text",
          required: true,
          admin: {
            width: "50%",
            description: "e.g. Sunday, or Last Sunday of the month",
          },
        },
        {
          name: "time",
          type: "text",
          required: true,
          admin: { width: "50%", description: "e.g. 9:00 AM WAT" },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "cadence",
          type: "select",
          required: true,
          defaultValue: "Weekly",
          options: [
            { label: "Weekly", value: "Weekly" },
            { label: "Monthly", value: "Monthly" },
          ],
          admin: { width: "50%" },
        },
        {
          name: "branch",
          type: "relationship",
          relationTo: "branches",
          admin: { width: "50%", description: "Which centre this meets at." },
        },
      ],
    },
    {
      name: "note",
      type: "text",
      admin: {
        description: "Anything else worth saying, e.g. a second service time.",
      },
    },
    {
      type: "row",
      fields: [
        {
          name: "isStreamed",
          type: "checkbox",
          defaultValue: false,
          label: "Streamed online",
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
