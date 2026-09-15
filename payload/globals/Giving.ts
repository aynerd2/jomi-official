import type { GlobalConfig } from "payload";

import { anyone, isSuperAdmin } from "../access/roles";

export const Giving: GlobalConfig = {
  slug: "giving",
  label: "Giving & partnership",
  admin: {
    group: "Settings",
    description:
      "Bank details, online giving, partnership tiers and impact figures.",
  },
  access: {
    read: anyone,
    // Where money goes is a super-admin decision, not an editorial one.
    update: isSuperAdmin,
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Bank transfer",
          fields: [
            {
              type: "row",
              fields: [
                {
                  name: "bankName",
                  type: "text",
                  required: true,
                  admin: { width: "50%" },
                },
                {
                  name: "currency",
                  type: "text",
                  required: true,
                  defaultValue: "NGN",
                  admin: { width: "50%" },
                },
              ],
            },
            { name: "accountName", type: "text", required: true },
            { name: "accountNumber", type: "text", required: true },
          ],
        },
        {
          label: "Online giving",
          description:
            "Paystack handles card and transfer giving in Naira. Keys live in the environment, never here.",
          fields: [
            {
              name: "paystackEnabled",
              type: "checkbox",
              defaultValue: false,
              label: "Offer Paystack on the partner page",
              admin: {
                description:
                  "Turning this on requires PAYSTACK_SECRET_KEY and NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY to be set.",
              },
            },
            {
              name: "suggestedAmounts",
              type: "array",
              labels: { singular: "Amount", plural: "Suggested amounts" },
              admin: { description: "Shown as quick-pick buttons, in Naira." },
              fields: [{ name: "amount", type: "number", required: true }],
            },
            {
              name: "purposes",
              type: "array",
              labels: { singular: "Purpose", plural: "Giving purposes" },
              admin: { description: "What a gift can be directed towards." },
              fields: [
                { name: "label", type: "text", required: true },
                { name: "value", type: "text", required: true },
              ],
            },
          ],
        },
        {
          label: "Impact",
          fields: [
            {
              name: "impactAreas",
              type: "array",
              labels: { singular: "Area", plural: "Impact areas" },
              fields: [
                { name: "title", type: "text", required: true },
                { name: "description", type: "textarea", required: true },
              ],
            },
            {
              name: "impactStats",
              type: "array",
              labels: { singular: "Figure", plural: "Impact figures" },
              admin: {
                description:
                  "Only add figures the ministry can stand behind. Left empty, the section is not rendered.",
              },
              fields: [
                { name: "label", type: "text", required: true },
                {
                  name: "value",
                  type: "text",
                  required: true,
                  admin: { description: "e.g. 25+, 500K+" },
                },
              ],
            },
          ],
        },
        {
          label: "Partnership tiers",
          fields: [
            {
              name: "partnerTiers",
              type: "array",
              labels: { singular: "Tier", plural: "Partnership tiers" },
              admin: {
                description:
                  "Only list benefits the ministry can honour. Left empty, the page invites people to get in touch instead.",
              },
              fields: [
                { name: "name", type: "text", required: true },
                {
                  name: "amount",
                  type: "text",
                  required: true,
                  admin: { description: "e.g. NGN 10,000/month" },
                },
                {
                  name: "benefits",
                  type: "array",
                  labels: { singular: "Benefit", plural: "Benefits" },
                  fields: [{ name: "text", type: "text", required: true }],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
