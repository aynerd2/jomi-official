import type { Metadata } from "next";
import TestimoniesView from "./TestimoniesView";
import { getPage, getTestimonies } from "@/lib/cms";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("testimonies");
  return { title: "Testimonies", description: page.metaDescription };
}

export default async function TestimoniesPage() {
  const [testimonies, page] = await Promise.all([
    getTestimonies(),
    getPage("testimonies"),
  ]);
  return <TestimoniesView testimonies={testimonies} page={page} />;
}
