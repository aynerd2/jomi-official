/**
 * Loads the seed content in content/ into Payload.
 *
 * Run once after pointing MONGODB_URI at an empty database:
 *   npm run seed
 *
 * It is safe to re-run: every step skips a collection that already holds
 * documents, so it will not duplicate anything or overwrite edits made in the
 * dashboard. To reseed from scratch, empty the collection first.
 */
import path from "path";
import { fileURLToPath } from "url";
import { getPayload } from "payload";
import config from "@payload-config";

import * as about from "../content/about";
import { events } from "../content/events";
import { galleryImages } from "../content/gallery";
import {
  bankAccount,
  impactAreas,
  impactStats,
  partnerTiers,
} from "../content/giving";
import { leadership } from "../content/leadership";
import { books, channels } from "../content/media";
import { ministryArms } from "../content/ministryArms";
import { branches, serviceTimes, siteSettings } from "../content/site";
import { isTodo } from "../content/todo";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const imagesDir = path.resolve(dirname, "../assets/images");

/** TODO placeholders are gaps, not content: they must not be seeded as values. */
const real = (value: string | undefined): string | undefined =>
  !value || isTodo(value) ? undefined : value;

async function main() {
  const payload = await getPayload({ config });

  const count = async (collection: Parameters<typeof payload.count>[0]["collection"]) =>
    (await payload.count({ collection })).totalDocs;

  /* ---------------------------------------------------------------- users */

  if ((await count("users")) === 0) {
    const email = process.env.SEED_ADMIN_EMAIL;
    const password = process.env.SEED_ADMIN_PASSWORD;

    if (!email || !password) {
      console.log(
        "\nNo users yet. Set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD to create the first\n" +
          "super-admin here, or just open /admin and Payload will ask you to create one.\n",
      );
    } else {
      await payload.create({
        collection: "users",
        data: { email, password, name: "Super Admin", role: "super-admin" },
      });
      console.log(`created super-admin ${email}`);
    }
  }

  /* ---------------------------------------------------------------- media */

  // Uploading each seed photo once gives the dashboard real images to work with.
  const mediaByFile = new Map<string, string>();

  async function upload(fileName: string, alt: string): Promise<string | undefined> {
    if (mediaByFile.has(fileName)) return mediaByFile.get(fileName);

    const existing = await payload.find({
      collection: "media",
      where: { filename: { equals: fileName } },
      limit: 1,
    });
    if (existing.docs[0]) {
      const id = String(existing.docs[0].id);
      mediaByFile.set(fileName, id);
      return id;
    }

    try {
      const doc = await payload.create({
        collection: "media",
        data: { alt },
        filePath: path.join(imagesDir, fileName),
      });
      const id = String(doc.id);
      mediaByFile.set(fileName, id);
      return id;
    } catch (error) {
      console.warn(`could not upload ${fileName}:`, (error as Error).message);
      return undefined;
    }
  }

  /* ------------------------------------------------------------ collections */

  if ((await count("events")) === 0) {
    for (const event of events) {
      // Retreats and travel are seeded as internal, and the collection hook
      // enforces that regardless.
      const isTravel = /^Traveling\b/i.test(event.title);
      await payload.create({
        collection: "events",
        data: {
          title: event.title,
          startDate: `${event.startDate}T00:00:00.000Z`,
          endDate: event.endDate ? `${event.endDate}T00:00:00.000Z` : undefined,
          time: event.time,
          location: event.location,
          description: event.description,
          type: event.type,
          country: event.country,
          featured: Boolean(event.featured),
          isLeaderTravel: isTravel,
          audience: isTravel || event.type === "Retreats" ? "internal" : "public",
        },
      });
    }
    console.log(`seeded ${events.length} events`);
  }

  if ((await count("leadership")) === 0) {
    for (const [index, leader] of leadership.entries()) {
      const photo = await upload(leader.photoFile, leader.name);
      await payload.create({
        collection: "leadership",
        data: {
          name: leader.name,
          role: leader.role,
          bio: leader.bio,
          instagram: leader.instagram,
          order: index,
          ...(photo ? { photo } : {}),
        },
      });
    }
    console.log(`seeded ${leadership.length} leaders`);
  }

  if ((await count("ministry-arms")) === 0) {
    for (const [index, arm] of ministryArms.entries()) {
      await payload.create({
        collection: "ministry-arms",
        data: {
          slug: arm.slug,
          name: arm.name,
          fullName: arm.fullName,
          description: real(arm.description),
          order: index,
        },
      });
    }
    console.log(`seeded ${ministryArms.length} ministry arms`);
  }

  if ((await count("branches")) === 0) {
    for (const [index, branch] of branches.entries()) {
      await payload.create({
        collection: "branches",
        data: {
          slug: branch.slug,
          city: branch.city,
          state: branch.state,
          address: real(branch.address),
          description: branch.description,
          gatherings: branch.gatherings.map((name) => ({ name })),
          contactEmail: branch.contactEmail,
          isHeadquarters: Boolean(branch.isHeadquarters),
          order: index,
        },
      });
    }
    console.log(`seeded ${branches.length} centres`);
  }

  if ((await count("service-times")) === 0) {
    const allBranches = await payload.find({ collection: "branches", limit: 100 });
    const branchByCity = new Map(
      allBranches.docs.map((doc) => [String((doc as unknown as { city: string }).city), doc.id]),
    );

    for (const [index, service] of serviceTimes.entries()) {
      await payload.create({
        collection: "service-times",
        data: {
          name: service.name,
          day: service.day,
          time: service.time,
          cadence: service.cadence,
          note: service.note,
          branch: branchByCity.get(service.location),
          order: index,
        },
      });
    }
    console.log(`seeded ${serviceTimes.length} service times`);
  }

  if ((await count("books")) === 0) {
    for (const book of books) {
      await payload.create({
        collection: "books",
        data: {
          title: book.title,
          author: book.author,
          description: book.description,
          price: real(book.price),
          available: true,
        },
      });
    }
    console.log(`seeded ${books.length} books`);
  }

  if ((await count("gallery")) === 0) {
    for (const [index, item] of galleryImages.entries()) {
      const media = await upload(item.imageFile, item.caption);
      if (!media) continue;
      await payload.create({
        collection: "gallery",
        data: { image: media, caption: item.caption, order: index },
      });
    }
    console.log("seeded gallery");
  }

  /* --------------------------------------------------------------- globals */

  await payload.updateGlobal({
    slug: "about",
    data: {
      mission: about.mission,
      vision: about.vision,
      summary: about.summary.map((text) => ({ text })),
      history: about.history.map((text) => ({ text })),
      featuredQuote: about.featuredQuote,
      mandate: about.mandate.map((p) => ({
        title: p.title,
        description: p.description,
      })),
      ministryFocus: about.ministryFocus.map((p) => ({
        title: p.title,
        description: p.description,
      })),
      beliefs: about.beliefs.map((p) => ({
        title: p.title,
        description: p.description,
      })),
      values: about.values.map((p) => ({
        title: p.title,
        description: p.description,
      })),
    },
  });

  await payload.updateGlobal({
    slug: "site-settings",
    data: {
      name: siteSettings.name,
      shortName: siteSettings.shortName,
      tagline: siteSettings.tagline,
      description: siteSettings.description,
      generalEmail: siteSettings.emails.general,
      partnershipEmail: siteSettings.emails.partnership,
      // The seeded phone numbers were placeholders, so none are carried over.
      phones: [],
      address: { ...siteSettings.address },
      facebook: siteSettings.socials.facebook,
      instagram: siteSettings.socials.instagram,
      youtube: siteSettings.socials.youtube,
      x: siteSettings.socials.x,
      spotify: channels.spotify,
      audiomack: channels.audiomackEmbed,
    },
  });

  await payload.updateGlobal({
    slug: "giving",
    data: {
      bankName: bankAccount.bankName,
      accountName: bankAccount.accountName,
      accountNumber: bankAccount.accountNumber,
      currency: bankAccount.currency,
      paystackEnabled: false,
      suggestedAmounts: [5000, 10000, 25000, 50000, 100000, 250000].map(
        (amount) => ({ amount }),
      ),
      purposes: [
        { label: "General ministry support", value: "general" },
        { label: "Missions and outreaches", value: "missions" },
        { label: "Ministers training", value: "training" },
        { label: "Media outreach", value: "media" },
      ],
      impactAreas: impactAreas.map((area) => ({
        title: area.title,
        description: area.description,
      })),
      // Unconfirmed figures and invented tiers are deliberately not seeded.
      impactStats: impactStats.filter((stat) => !isTodo(stat.value)),
      partnerTiers: partnerTiers.map((tier) => ({
        name: tier.name,
        amount: tier.amount,
        benefits: tier.benefits.map((text) => ({ text })),
      })),
    },
  });

  await payload.updateGlobal({
    slug: "home",
    data: {
      hero: {
        eyebrow: "Welcome to JOMI",
        headline: "Glorifying the *Finished Works* of Christ",
        lede: "A global movement revealing the fullness of Christ and raising a triumphant generation that walks in dominion, grace and apostolic authority.",
        primaryCtaLabel: "Plan your visit",
        primaryCtaHref: "/contact",
        secondaryCtaLabel: "Watch messages",
        secondaryCtaHref: "/media",
        ...(mediaByFile.get("apostle-jide-ojo.webp")
          ? { portrait: mediaByFile.get("apostle-jide-ojo.webp") }
          : {}),
      },
      watchOnline: {
        heading: "Cannot be there in person? Join us wherever you are.",
        body: "Our services and conferences are published on YouTube, so you can watch the teaching wherever you are in the world.",
      },
      partnerBand: {
        heading: "Partner with the Great Commission",
        body: "Your partnership takes the gospel to unreached nations, trains leaders, and demonstrates the love of Christ to a hurting world.",
      },
    },
  });

  console.log("globals updated");
  console.log("\nSeed complete.");
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
