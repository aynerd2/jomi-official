import type { Field } from "payload";

import type { SectionCopy } from "../../content/pages";

/**
 * A heading block for one section of a page: eyebrow, title, lede and, where
 * the section has a photo, an image.
 *
 * Defaults are the words the site already shows, so the admin opens with the
 * live copy filled in. Anything cleared falls back to the same default on the
 * site (see lib/cms.ts), so a heading can be reworded but never left blank.
 */
export function sectionCopyField(
  name: string,
  label: string,
  defaults: SectionCopy,
  options: { image?: boolean } = {},
): Field {
  const withImage = options.image ?? defaults.imageFile !== undefined;

  return {
    name,
    label,
    type: "group",
    admin: { hideGutter: true },
    fields: [
      {
        type: "row",
        fields: [
          {
            name: "eyebrow",
            type: "text",
            defaultValue: defaults.eyebrow,
            admin: { width: "35%", description: "The small label above the title." },
          },
          {
            name: "title",
            type: "text",
            defaultValue: defaults.title,
            admin: { width: "65%" },
          },
        ],
      },
      {
        name: "lede",
        label: "Introduction",
        type: "textarea",
        defaultValue: defaults.lede,
      },
      ...(withImage
        ? [
            {
              name: "image",
              type: "upload" as const,
              relationTo: "media" as const,
              admin: {
                description:
                  "Leave empty to keep the built-in photograph. The image's alt text in Media is used for screen readers.",
              },
            },
          ]
        : []),
    ],
  };
}
