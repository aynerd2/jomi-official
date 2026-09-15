import type { CollectionConfig } from "payload";

import { isContributor, isEditor, isEditorField } from "../access/roles";

/**
 * Testimonies are never published automatically.
 *
 * Anything arriving from the website form is created with reviewStatus
 * "pending" and consent recorded. Only an editor can move one to "approved",
 * and the public read rule serves approved testimonies alone — so a submission
 * cannot reach the site without someone deliberately approving it.
 */
export const Testimonies: CollectionConfig = {
  slug: "testimonies",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "location", "category", "reviewStatus", "createdAt"],
    group: "Submissions",
    description:
      "Testimonies from the website form and from the ministry. Nothing is published until it is approved.",
  },
  access: {
    read: ({ req }) => {
      if (req.user) return true;
      return { reviewStatus: { equals: "approved" } };
    },
    // The public form writes through a server action, not the API, so creating
    // directly stays with staff.
    create: isContributor,
    update: isContributor,
    delete: isEditor,
  },
  fields: [
    {
      type: "row",
      fields: [
        { name: "name", type: "text", required: true, admin: { width: "50%" } },
        {
          name: "location",
          type: "text",
          required: true,
          admin: { width: "50%", description: "City, Country" },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "email",
          type: "email",
          admin: {
            width: "50%",
            description: "For following up. Never shown on the site.",
          },
        },
        {
          name: "category",
          type: "text",
          required: true,
          admin: { width: "50%" },
        },
      ],
    },
    { name: "testimony", type: "textarea", required: true },
    {
      name: "reviewStatus",
      type: "select",
      required: true,
      defaultValue: "pending",
      options: [
        { label: "Pending review", value: "pending" },
        { label: "Approved — visible on the site", value: "approved" },
        { label: "Declined", value: "declined" },
      ],
      access: {
        // Publishing someone else's story is an editorial decision.
        update: isEditorField,
      },
      admin: {
        position: "sidebar",
        description: "Only approved testimonies appear on the public site.",
      },
    },
    {
      name: "consentGiven",
      type: "checkbox",
      defaultValue: false,
      admin: {
        position: "sidebar",
        description:
          "Recorded when the person ticked the consent box on the form. Do not approve without it.",
      },
    },
    {
      name: "source",
      type: "select",
      defaultValue: "website",
      options: [
        { label: "Website form", value: "website" },
        { label: "Entered by the ministry", value: "ministry" },
      ],
      admin: { position: "sidebar" },
    },
    {
      name: "featured",
      type: "checkbox",
      defaultValue: false,
      admin: {
        position: "sidebar",
        description: "Featured testimonies lead the carousel.",
      },
    },
  ],
};
