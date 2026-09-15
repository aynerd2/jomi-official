/**
 * Static imports of the seed photography, keyed by filename.
 *
 * The seed modules in content/ hold filenames rather than imports, so they can
 * be read by plain Node (the seed script) as well as by the bundler. This
 * registry is the bundler side: it turns a filename back into the
 * StaticImageData that next/image wants, with width, height and a blur
 * placeholder.
 *
 * Only used for the seed fallback. Once content is in the CMS, images come from
 * Cloudinary as URLs.
 */
import type { StaticImageData } from "next/image";

import apostleAndPastor from "@/assets/images/apostle-and-pastor-ojo.webp";
import apostleJideOjo from "@/assets/images/apostle-jide-ojo.webp";
import apostlePortrait from "@/assets/images/apostle-jide-ojo-portrait.jpg";
import audience from "@/assets/images/audience.jpg";
import daddy1 from "@/assets/images/Daddy1.jpg";
import daddy2 from "@/assets/images/Daddy2.jpg";
import daddy3 from "@/assets/images/Daddy3.jpg";
import daddy4 from "@/assets/images/Daddy4.jpg";
import dadShot from "@/assets/images/dad-shot.jpg";
import dadShot2 from "@/assets/images/dad-shot2.jpg";
import jomiStart from "@/assets/images/Jomi_Start.jpg";
import mummy1 from "@/assets/images/Mummy1.jpg";
import partner from "@/assets/images/Partner.jpg";
import pastorFunmiOjo from "@/assets/images/pastor-funmi-ojo.webp";
import pastorPortrait from "@/assets/images/pastor-funmi-ojo-portrait.jpg";
import testimony from "@/assets/images/Testimony.jpg";

export const imageRegistry: Record<string, StaticImageData> = {
  "apostle-and-pastor-ojo.webp": apostleAndPastor,
  "apostle-jide-ojo.webp": apostleJideOjo,
  "apostle-jide-ojo-portrait.jpg": apostlePortrait,
  "audience.jpg": audience,
  "Daddy1.jpg": daddy1,
  "Daddy2.jpg": daddy2,
  "Daddy3.jpg": daddy3,
  "Daddy4.jpg": daddy4,
  "dad-shot.jpg": dadShot,
  "dad-shot2.jpg": dadShot2,
  "Jomi_Start.jpg": jomiStart,
  "Mummy1.jpg": mummy1,
  "Partner.jpg": partner,
  "pastor-funmi-ojo.webp": pastorFunmiOjo,
  "pastor-funmi-ojo-portrait.jpg": pastorPortrait,
  "Testimony.jpg": testimony,
};

export function seedImage(fileName: string): StaticImageData | undefined {
  return imageRegistry[fileName];
}
