import type { CollectionConfig } from "payload";

import { isContributor, isEditor } from "../access/roles";

export const EVENT_TYPES = [
  "Services",
  "Prayer Meetings",
  "Seminars",
  "Conferences",
  "Apostolic Visits",
  "Retreats",
] as const;

/**
 * Entry types that must never reach the public site: private consecration
 * retreats, and the leaders' travel with dates and destination cities. These
 * still belong in the admin for internal scheduling.
 */
const ALWAYS_INTERNAL_TYPES: string[] = ["Retreats"];

function shouldBeInternal(data: Record<string, unknown>): boolean {
  if (data.isLeaderTravel === true) return true;
  return ALWAYS_INTERNAL_TYPES.includes(String(data.type));
}

export const Events: CollectionConfig = {
  slug: "events",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "startDate", "type", "audience", "featured"],
    group: "Content",
    description:
      "The ministry calendar. Retreats and leader travel are held as internal entries and never appear on the public site.",
  },
  access: {
    // The public/internal split is enforced here, at the access layer, so it
    // applies to every read path: the website, the REST API and GraphQL alike.
    // An anonymous request cannot retrieve an internal entry even by asking for
    // it directly by id, and no display toggle can undo that.
    read: ({ req }) => {
      if (req.user) return true;
      return { audience: { equals: "public" } };
    },
    create: isContributor,
    update: isContributor,
    delete: isEditor,
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (!data) return data;
        // Force rather than default: flipping the select back to public on a
        // retreat or a travel entry must not be possible by accident.
        if (shouldBeInternal(data)) {
          return { ...data, audience: "internal" };
        }
        return data;
      },
    ],
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      type: "row",
      fields: [
        {
          name: "startDate",
          type: "date",
          required: true,
          admin: {
            width: "50%",
            date: { pickerAppearance: "dayOnly", displayFormat: "d MMM yyyy" },
            description: "Interpreted in West Africa Time.",
          },
        },
        {
          name: "endDate",
          type: "date",
          admin: {
            width: "50%",
            date: { pickerAppearance: "dayOnly", displayFormat: "d MMM yyyy" },
            description: "Only for events running over more than one day.",
          },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "time",
          type: "text",
          required: true,
          defaultValue: "9:00 AM WAT",
          admin: { width: "50%" },
        },
        {
          name: "type",
          type: "select",
          required: true,
          options: EVENT_TYPES.map((value) => ({ label: value, value })),
          admin: { width: "50%" },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "location",
          type: "text",
          required: true,
          admin: { width: "70%" },
        },
        {
          name: "country",
          type: "text",
          required: true,
          defaultValue: "Nigeria",
          admin: { width: "30%" },
        },
      ],
    },
    {
      name: "description",
      type: "textarea",
      required: true,
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      admin: { description: "Optional. Event cards read well without one." },
    },
    {
      type: "collapsible",
      label: "Visibility",
      admin: {
        description:
          "Who can see this entry. Internal entries are for scheduling only.",
      },
      fields: [
        {
          name: "audience",
          type: "select",
          required: true,
          defaultValue: "public",
          options: [
            { label: "Public — shown on the website", value: "public" },
            { label: "Internal — admin only, never published", value: "internal" },
          ],
          admin: {
            description:
              "Retreats and leader travel are forced to Internal when saved, whatever is selected here.",
          },
        },
        {
          name: "isLeaderTravel",
          type: "checkbox",
          label: "This entry records the leaders' travel",
          defaultValue: false,
          admin: {
            description:
              "Tick for trips that name where a leader will be and when. Publishing that is a safety risk, so ticking this forces the entry to Internal.",
          },
        },
      ],
    },
    {
      name: "featured",
      type: "checkbox",
      defaultValue: false,
      admin: {
        description:
          "Featured events lead the carousel on the home page. Ignored for internal entries.",
      },
    },
  ],
};
