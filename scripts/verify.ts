/**
 * Post-seed check. Reports what is in the database, where the uploads live, and
 * whether the events access rule hides internal entries from anonymous reads.
 *
 *   node --env-file=.env.local node_modules/tsx/dist/cli.mjs scripts/verify.ts
 */
import { getPayload } from "payload";
import config from "@payload-config";

async function main() {
  const payload = await getPayload({ config });

  const collections = [
    "events",
    "sermons",
    "books",
    "gallery",
    "leadership",
    "ministry-arms",
    "branches",
    "service-times",
    "testimonies",
    "submissions",
    "donations",
    "media",
    "users",
  ] as const;

  console.log("\n--- collections");
  for (const collection of collections) {
    const { totalDocs } = await payload.count({ collection });
    console.log(`  ${collection.padEnd(16)} ${totalDocs}`);
  }

  console.log("\n--- events visibility");
  const all = await payload.count({ collection: "events" });
  const internal = await payload.count({
    collection: "events",
    where: { audience: { equals: "internal" } },
  });
  // overrideAccess false with no user is exactly what the public site does.
  const asVisitor = await payload.find({
    collection: "events",
    overrideAccess: false,
    limit: 0,
  });
  console.log(`  total            ${all.totalDocs}`);
  console.log(`  internal         ${internal.totalDocs}`);
  console.log(`  visible publicly ${asVisitor.totalDocs}`);
  console.log(
    `  hidden from the public site: ${all.totalDocs - asVisitor.totalDocs}`,
  );

  // Try to read an internal entry directly, the way a scraper might.
  const oneInternal = await payload.find({
    collection: "events",
    where: { audience: { equals: "internal" } },
    limit: 1,
  });
  const target = oneInternal.docs[0];
  if (target) {
    const direct = await payload.find({
      collection: "events",
      where: { id: { equals: target.id } },
      overrideAccess: false,
      limit: 1,
    });
    console.log(
      `  fetching an internal entry by id as a visitor: ${
        direct.totalDocs === 0 ? "blocked" : "LEAKED"
      } (${(target as unknown as { title: string }).title})`,
    );
  }

  console.log("\n--- media");
  const media = await payload.find({ collection: "media", limit: 50 });
  const cloudinary = media.docs.filter((doc) =>
    String((doc as { url?: string }).url ?? "").includes("res.cloudinary.com"),
  );
  console.log(`  uploads          ${media.totalDocs}`);
  console.log(`  on Cloudinary    ${cloudinary.length}`);
  for (const doc of media.docs.slice(0, 3)) {
    console.log(`  - ${(doc as { url?: string }).url}`);
  }

  console.log("\n--- reachability of the first three");
  for (const doc of media.docs.slice(0, 3)) {
    const url = String((doc as { url?: string }).url ?? "");
    if (!url) continue;
    try {
      const res = await fetch(url, { method: "GET", cache: "no-store" });
      console.log(
        `  ${res.status} ${res.headers.get("content-type")} ${
          res.headers.get("content-length") ?? "?"
        } bytes`,
      );
    } catch (error) {
      console.log(`  FAILED ${(error as Error).message}`);
    }
  }

  console.log("\n--- globals");
  const site = (await payload.findGlobal({ slug: "site-settings" })) as Record<
    string,
    unknown
  >;
  const giving = (await payload.findGlobal({ slug: "giving" })) as Record<
    string,
    unknown
  >;
  console.log(`  site name        ${site.name}`);
  console.log(`  phones seeded    ${(site.phones as unknown[])?.length ?? 0}`);
  console.log(`  livestream URL   ${site.livestreamUrl ?? "(not set yet)"}`);
  console.log(`  bank account     ${giving.accountName}`);
  console.log(`  paystack enabled ${giving.paystackEnabled}`);

  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
