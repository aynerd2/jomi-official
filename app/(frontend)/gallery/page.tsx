import type { Metadata } from "next";
import GalleryView from "./GalleryView";
import { getGallery, getPage } from "@/lib/cms";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("gallery");
  return { title: "Gallery", description: page.metaDescription };
}

export default async function GalleryPage() {
  const [images, page] = await Promise.all([getGallery(), getPage("gallery")]);
  return <GalleryView images={images} page={page} />;
}
