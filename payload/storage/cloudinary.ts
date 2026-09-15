import type { Adapter, GeneratedAdapter } from "@payloadcms/plugin-cloud-storage/types";
import { v2 as cloudinary } from "cloudinary";

/**
 * Cloudinary storage for Payload uploads.
 *
 * There is no first-party @payloadcms/storage-cloudinary, so this is a small
 * adapter over Payload's generic cloud-storage plugin and Cloudinary's official
 * SDK. Both dependencies are first-party to their projects; only the ~100 lines
 * here are ours.
 *
 * Delivery URLs carry f_auto,q_auto, so Cloudinary picks the format (AVIF, WebP)
 * and quality per browser. Resizing happens on delivery too, which is why the
 * Media collection no longer asks sharp to generate its own sizes.
 */

export const cloudinaryConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET,
);

/** Everything this site uploads lives under one folder in the Cloudinary account. */
const FOLDER = process.env.CLOUDINARY_FOLDER || "jomi";

/** Default delivery transformation: modern format, automatic quality. */
const DELIVERY = "f_auto,q_auto";

function configure() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
    analytics: false,
  });
}

/** Cloudinary keeps its own extension, so the public id drops ours. */
function publicIdFor(filename: string): string {
  const withoutExtension = filename.replace(/\.[^./\\]+$/, "");
  return `${FOLDER}/${withoutExtension}`;
}

export const cloudinaryAdapter = (): Adapter => {
  return ({ collection, prefix }): GeneratedAdapter => {
    configure();

    return {
      name: "cloudinary",

      async handleUpload({ file }) {
        const publicId = publicIdFor(
          prefix ? `${prefix}/${file.filename}` : file.filename,
        );

        await new Promise<void>((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              public_id: publicId,
              // Payload already guarantees unique filenames, and overwriting on
              // re-upload keeps the URL stable.
              overwrite: true,
              invalidate: true,
              resource_type: "auto",
              context: { collection: String(collection.slug) },
            },
            (error) => (error ? reject(error) : resolve()),
          );
          stream.end(file.buffer);
        });
      },

      async handleDelete({ filename }) {
        const publicId = publicIdFor(
          prefix ? `${prefix}/${filename}` : filename,
        );
        try {
          await cloudinary.uploader.destroy(publicId, { invalidate: true });
        } catch (error) {
          // A missing remote file should not block deleting the document.
          console.error(`[cloudinary] could not delete ${publicId}:`, error);
        }
      },

      generateURL({ filename, prefix }) {
        const publicId = publicIdFor(
          prefix ? `${prefix}/${filename}` : filename,
        );
        return cloudinary.url(publicId, {
          secure: true,
          transformation: [{ fetch_format: "auto", quality: "auto" }],
        });
      },

      // Uploads are served straight from Cloudinary's CDN, so Next never
      // proxies the bytes. The handler only answers if something asks this app
      // for the file directly.
      staticHandler: async (req, { params: { filename } }) => {
        const url = cloudinary.url(publicIdFor(filename), {
          secure: true,
          transformation: [{ fetch_format: "auto", quality: "auto" }],
        });
        return Response.redirect(url, 302);
      },
    };
  };
};

/** The delivery transformation, exported so callers can build sized URLs. */
export const cloudinaryDelivery = DELIVERY;
