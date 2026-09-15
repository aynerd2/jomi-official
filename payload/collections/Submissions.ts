import type { CollectionConfig } from "payload";

import {
  isContributor,
  isContributorField,
  isEditorField,
  isSuperAdmin,
} from "../access/roles";

/**
 * Everything the public forms send: contact enquiries, prayer requests, event
 * registrations and newsletter sign-ups. Testimonies have their own collection,
 * because they carry an approval step and get published.
 *
 * Nothing is emailed today — submissions live here and are worked through in
 * the dashboard. A hook can send mail later without changing this shape.
 */
export const Submissions: CollectionConfig = {
  slug: "submissions",
  admin: {
    useAsTitle: "subject",
    defaultColumns: ["type", "name", "subject", "status", "createdAt"],
    group: "Submissions",
    description:
      "Messages, prayer requests, registrations and newsletter sign-ups from the website.",
  },
  access: {
    // Forms write through server actions, so nothing anonymous touches this API.
    create: isContributor,
    read: isContributor,
    update: isContributor,
    // Keeping a record of what people sent matters, so deletion is restricted.
    delete: isSuperAdmin,
  },
  defaultSort: "-createdAt",
  fields: [
    {
      type: "row",
      fields: [
        {
          name: "type",
          type: "select",
          required: true,
          options: [
            { label: "Contact enquiry", value: "contact" },
            { label: "Prayer request", value: "prayer" },
            { label: "Event registration", value: "registration" },
            { label: "Newsletter sign-up", value: "newsletter" },
            { label: "Message request", value: "message-request" },
          ],
          admin: { width: "50%" },
        },
        {
          name: "status",
          type: "select",
          required: true,
          defaultValue: "new",
          options: [
            { label: "New", value: "new" },
            { label: "In progress", value: "in-progress" },
            { label: "Responded", value: "responded" },
            { label: "Closed", value: "closed" },
          ],
          admin: { width: "50%" },
        },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "name", type: "text", admin: { width: "50%" } },
        { name: "email", type: "email", required: true, admin: { width: "50%" } },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "phone", type: "text", admin: { width: "50%" } },
        {
          name: "subject",
          type: "text",
          admin: {
            width: "50%",
            description: "For registrations, the event being registered for.",
          },
        },
      ],
    },
    { name: "message", type: "textarea" },
    {
      name: "internalNotes",
      type: "textarea",
      access: { read: isContributorField, update: isContributorField },
      admin: {
        description: "Notes for the team. Never shown to the sender.",
      },
    },
    {
      name: "handledBy",
      type: "relationship",
      relationTo: "users",
      access: { update: isEditorField },
      admin: { position: "sidebar", description: "Who is dealing with this." },
    },
  ],
  timestamps: true,
};
