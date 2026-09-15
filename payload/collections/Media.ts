import type { CollectionConfig } from "payload";

import { anyone, isContributor, isEditor } from "../access/roles";

export const Media: CollectionConfig = {
  slug: "media",
  admin: {
    group: "Content",
    description:
      "Photographs and images used across the site: leader portraits, gallery, sermon thumbnails and book covers.",
  },
  access: {
    read: anyone,
    create: isContributor,
    update: isContributor,
    delete: isEditor,
  },
  upload: {
    // Kept as the local fallback: with no Cloudinary credentials configured,
    // uploads land here so development still works.
    staticDir: "public/media",
    mimeTypes: ["image/*"],
    // No imageSizes. Cloudinary resizes and re-encodes on delivery, so
    // generating a fixed set on upload would mean storing variants nobody asks
    // for. Without Cloudinary configured, next/image still sizes them.
    focalPoint: true,
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
      admin: {
        description:
          "Describe the image for people using a screen reader, e.g. 'Apostle Jide Ojo ministering at the 2026 Finished Works Conference'.",
      },
    },
    {
      name: "caption",
      type: "text",
      admin: {
        description: "Shown under the image in the gallery. Optional.",
      },
    },
    {
      name: "credit",
      type: "text",
      admin: { description: "Photographer credit, if one is required." },
    },
  ],
};
