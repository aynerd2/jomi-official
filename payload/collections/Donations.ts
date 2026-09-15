import type { CollectionConfig } from "payload";

import { isEditor, isSuperAdmin } from "../access/roles";

/**
 * A record of each gift started through Paystack.
 *
 * Written by the server, never by a browser. Amounts are held in Naira (Paystack
 * itself works in kobo). Card details never touch this application: Paystack
 * collects them on its own checkout page.
 */
export const Donations: CollectionConfig = {
  slug: "donations",
  admin: {
    useAsTitle: "reference",
    defaultColumns: ["reference", "amount", "donorEmail", "status", "paidAt"],
    group: "Submissions",
    description: "Gifts started through Paystack. Read only.",
  },
  access: {
    // Financial records: visible to editors and above, changed by nobody
    // through the admin, and deleted only by a super-admin.
    read: isEditor,
    create: () => false,
    update: () => false,
    delete: isSuperAdmin,
  },
  fields: [
    {
      type: "row",
      fields: [
        {
          name: "reference",
          type: "text",
          required: true,
          unique: true,
          admin: { width: "50%" },
        },
        {
          name: "status",
          type: "select",
          required: true,
          defaultValue: "pending",
          options: [
            { label: "Pending", value: "pending" },
            { label: "Successful", value: "success" },
            { label: "Failed", value: "failed" },
            { label: "Abandoned", value: "abandoned" },
          ],
          admin: { width: "50%" },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "amount",
          type: "number",
          required: true,
          admin: { width: "50%", description: "In Naira." },
        },
        {
          name: "currency",
          type: "text",
          defaultValue: "NGN",
          admin: { width: "50%" },
        },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "donorName", type: "text", admin: { width: "50%" } },
        {
          name: "donorEmail",
          type: "email",
          required: true,
          admin: { width: "50%" },
        },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "purpose", type: "text", admin: { width: "50%" } },
        {
          name: "frequency",
          type: "select",
          defaultValue: "once",
          options: [
            { label: "One-off gift", value: "once" },
            { label: "Monthly partnership", value: "monthly" },
          ],
          admin: { width: "50%" },
        },
      ],
    },
    { name: "paidAt", type: "date" },
  ],
  timestamps: true,
};
