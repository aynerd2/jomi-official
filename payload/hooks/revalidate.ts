import { revalidatePath } from "next/cache";
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  CollectionConfig,
  GlobalAfterChangeHook,
  GlobalConfig,
  PayloadRequest,
} from "payload";

/**
 * Refreshes the public site after an edit in the admin.
 *
 * The frontend pages are prerendered, so without this an edit only reaches the
 * site on the next deploy (or, for the few pages with a time-based revalidate,
 * up to an hour later). The header and footer read the CMS on every page, so
 * almost any edit touches every route: the whole site is revalidated from the
 * root layout rather than tracking which pages each document appears on.
 * Revalidation is lazy, so this only marks pages stale; each one re-renders on
 * its next visit.
 */
function revalidateSite(req: PayloadRequest, source: string) {
  try {
    revalidatePath("/", "layout");
  } catch (error) {
    // Outside a Next.js request, such as the seed script, there is no cache to
    // revalidate and revalidatePath throws. Nothing is lost.
    req.payload.logger.debug(`[revalidate] skipped after ${source}: ${String(error)}`);
  }
}

const afterCollectionChange: CollectionAfterChangeHook = ({ doc, req, collection }) => {
  revalidateSite(req, `${collection.slug} change`);
  return doc;
};

const afterCollectionDelete: CollectionAfterDeleteHook = ({ doc, req, collection }) => {
  revalidateSite(req, `${collection.slug} delete`);
  return doc;
};

const afterGlobalChange: GlobalAfterChangeHook = ({ doc, req, global }) => {
  revalidateSite(req, `${global.slug} change`);
  return doc;
};

/** Adds the revalidation hooks to a collection, keeping any it already has. */
export function revalidatesSite(collection: CollectionConfig): CollectionConfig {
  return {
    ...collection,
    hooks: {
      ...collection.hooks,
      afterChange: [...(collection.hooks?.afterChange ?? []), afterCollectionChange],
      afterDelete: [...(collection.hooks?.afterDelete ?? []), afterCollectionDelete],
    },
  };
}

/** Adds the revalidation hook to a global, keeping any it already has. */
export function revalidatesSiteGlobal(global: GlobalConfig): GlobalConfig {
  return {
    ...global,
    hooks: {
      ...global.hooks,
      afterChange: [...(global.hooks?.afterChange ?? []), afterGlobalChange],
    },
  };
}
