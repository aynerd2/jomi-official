import type { CollectionConfig } from "payload";

import { ROLES, isSuperAdmin, isSuperAdminField } from "../access/roles";

export const Users: CollectionConfig = {
  slug: "users",
  auth: {
    tokenExpiration: 60 * 60 * 8, // an 8 hour working day
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000,
  },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "email", "role"],
    group: "Administration",
  },
  access: {
    // Only a super-admin manages accounts. Everyone else may read and update
    // their own record, so they can change their name or password.
    create: isSuperAdmin,
    delete: isSuperAdmin,
    read: ({ req }) => {
      if (!req.user) return false;
      if (req.user.role === "super-admin") return true;
      return { id: { equals: req.user.id } };
    },
    update: ({ req }) => {
      if (!req.user) return false;
      if (req.user.role === "super-admin") return true;
      return { id: { equals: req.user.id } };
    },
    admin: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "role",
      type: "select",
      required: true,
      defaultValue: "editor",
      options: [
        { label: "Super Admin", value: ROLES[0] },
        { label: "Editor", value: ROLES[1] },
        { label: "Contributor", value: ROLES[2] },
      ],
      admin: {
        description:
          "Super Admin manages everything including accounts and giving details. Editor can publish content. Contributor can draft but not publish.",
      },
      // Nobody can promote themselves; only a super-admin sets roles.
      access: {
        create: isSuperAdminField,
        update: isSuperAdminField,
      },
    },
  ],
};
