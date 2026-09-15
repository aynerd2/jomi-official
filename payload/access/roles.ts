import type { Access, FieldAccess } from "payload";

/**
 * Roles are additive and ordered: a super-admin can do anything an editor can,
 * an editor anything a contributor can.
 *
 * Only super-admin is used today. Editor and contributor exist so the ministry
 * can hand out narrower access later without a schema change or a rebuild —
 * every access rule below is already written in terms of the ladder.
 */
export const ROLES = ["super-admin", "editor", "contributor"] as const;

export type Role = (typeof ROLES)[number];

type UserLike = { role?: Role | null } | null | undefined;

const RANK: Record<Role, number> = {
  contributor: 1,
  editor: 2,
  "super-admin": 3,
};

export function hasRole(user: UserLike, minimum: Role): boolean {
  const role = user?.role;
  if (!role) return false;
  return RANK[role] >= RANK[minimum];
}

/** Anyone signed in, at any role. */
export const isSignedIn: Access = ({ req }) => Boolean(req.user);

/** Contributors and above: may create and edit drafts. */
export const isContributor: Access = ({ req }) =>
  hasRole(req.user as UserLike, "contributor");

/** Editors and above: may publish content. */
export const isEditor: Access = ({ req }) => hasRole(req.user as UserLike, "editor");

/** Super-admins only: users, giving details, anything money- or access-related. */
export const isSuperAdmin: Access = ({ req }) =>
  hasRole(req.user as UserLike, "super-admin");

export const isSuperAdminField: FieldAccess = ({ req }) =>
  hasRole(req.user as UserLike, "super-admin");

export const isEditorField: FieldAccess = ({ req }) =>
  hasRole(req.user as UserLike, "editor");

export const isContributorField: FieldAccess = ({ req }) =>
  hasRole(req.user as UserLike, "contributor");

/** Readable by the public site, and by anyone signed in. */
export const anyone: Access = () => true;
