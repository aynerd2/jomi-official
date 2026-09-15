import type { Metadata } from "next";
import GalleryView from "./GalleryView";
import { getGallery } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Photographs from the services, conferences and outreaches of Jide Ojo Ministry International.",
};

export default async function GalleryPage() {
  const images = await getGallery();
  return <GalleryView images={images} />;
}
