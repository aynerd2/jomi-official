import dns from "dns";
import path from "path";
import { fileURLToPath } from "url";

import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { cloudStoragePlugin } from "@payloadcms/plugin-cloud-storage";
import { buildConfig } from "payload";
import sharp from "sharp";

import {
  cloudinaryAdapter,
  cloudinaryConfigured,
} from "./payload/storage/cloudinary";

import { Books } from "./payload/collections/Books";
import { Donations } from "./payload/collections/Donations";
import { Branches } from "./payload/collections/Branches";
import { Events } from "./payload/collections/Events";
import { GalleryImages } from "./payload/collections/GalleryImages";
import { Leadership } from "./payload/collections/Leadership";
import { Media } from "./payload/collections/Media";
import { MinistryArms } from "./payload/collections/MinistryArms";
import { Sermons } from "./payload/collections/Sermons";
import { ServiceTimes } from "./payload/collections/ServiceTimes";
import { Submissions } from "./payload/collections/Submissions";
import { Testimonies } from "./payload/collections/Testimonies";
import { Users } from "./payload/collections/Users";

import { About } from "./payload/globals/About";
import { Giving } from "./payload/globals/Giving";
import { HomePage } from "./payload/globals/HomePage";
import { SiteSettings } from "./payload/globals/SiteSettings";

// Some networks refuse the SRV lookups an Atlas mongodb+srv:// URI depends on,
// while ordinary DNS works fine. Setting MONGODB_DNS_SERVERS (e.g. "1.1.1.1")
// routes resolution around that resolver. Unset on a normal network.
const dnsServers = process.env.MONGODB_DNS_SERVERS?.split(",")
  .map((server) => server.trim())
  .filter(Boolean);

if (dnsServers?.length) {
  dns.setServers(dnsServers);
}

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: dirname },
    meta: {
      titleSuffix: " · JOMI Admin",
      description: "Content dashboard for Jide Ojo Ministry International.",
      icons: [
        { rel: "icon", type: "image/png", sizes: "32x32", url: "/favicon-32.png" },
        { rel: "apple-touch-icon", sizes: "180x180", url: "/apple-icon.png" },
      ],
    },
    components: {
      graphics: {
        Logo: "@/components/admin/Logo#Logo",
        Icon: "@/components/admin/Icon#Icon",
      },
      // Payload's own sign-out is an unlabelled icon; these are the same
      // destinations, with words on them.
      afterNavLinks: ["@/components/admin/AccountLinks#AccountLinks"],
      beforeLogin: ["@/components/admin/LoginIntro#LoginIntro"],
    },
  },

  collections: [
    // Content
    Events,
    Sermons,
    Books,
    GalleryImages,
    Leadership,
    MinistryArms,
    Branches,
    ServiceTimes,
    // Submissions
    Testimonies,
    Submissions,
    Donations,
    // Administration
    Media,
    Users,
  ],

  globals: [HomePage, About, SiteSettings, Giving],

  plugins: [
    // Uploads go to Cloudinary when its credentials are present. Without them
    // the plugin stays out of the way and Payload writes to public/media, so a
    // developer can run the site without a Cloudinary account.
    ...(cloudinaryConfigured
      ? [
          cloudStoragePlugin({
            collections: {
              media: {
                adapter: cloudinaryAdapter(),
                disableLocalStorage: true,
                // Serve straight from Cloudinary's CDN rather than proxying
                // every image through this app. Without this the plugin stores
                // a /api/media/file/... URL so Payload can apply access control
                // to the bytes, which only makes sense for private files. Media
                // here is public, and the point of Cloudinary is its CDN and
                // its per-browser format and quality.
                disablePayloadAccessControl: true,
              },
            },
          }),
        ]
      : []),
  ],

  editor: lexicalEditor(),

  // Signs and verifies auth tokens. Rotating it signs everyone out.
  secret: process.env.PAYLOAD_SECRET ?? "",

  db: mongooseAdapter({
    url: process.env.MONGODB_URI ?? "",
    // An Atlas connection string often ends at the host with no database path,
    // in which case Mongo would use "test". Name it explicitly instead.
    connectOptions: {
      dbName: process.env.MONGODB_DB_NAME || "jomi",
    },
  }),

  // Payload uses sharp to generate the image sizes declared on the Media
  // collection, so uploads are resized once rather than on every request.
  sharp,

  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },

  // The public site reads through the Local API, so CORS only needs to cover
  // anything calling the REST/GraphQL endpoints from a browser.
  cors: process.env.NEXT_PUBLIC_SERVER_URL
    ? [process.env.NEXT_PUBLIC_SERVER_URL]
    : [],
});
