import type { Metadata } from "next";
import TestimoniesView from "./TestimoniesView";
import { getTestimonies } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Testimonies",
  description:
    "Testimonies of salvation, healing and restoration through Jide Ojo Ministry International.",
};

export default async function TestimoniesPage() {
  const testimonies = await getTestimonies();
  return <TestimoniesView testimonies={testimonies} />;
}
