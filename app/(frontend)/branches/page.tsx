import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";

import { Section } from "@/components/ui/Section";
import { PageHero } from "@/components/ui/PageHero";
import { StaggerGroup, StaggerItem } from "@/components/ui/Reveal";
import { getBranches, getPage } from "@/lib/cms";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("branches");
  return { title: "Our Centres", description: page.metaDescription };
}

export default async function BranchesPage() {
  const [branches, page] = await Promise.all([getBranches(), getPage("branches")]);
  const { hero } = page;

  return (
    <>

      <main>
        <PageHero
          eyebrow={hero.eyebrow}
          title={hero.title}
          lede={hero.lede}
          image={hero.image}
          imageAlt={hero.imageAlt}
        />

        <Section tone="muted">
          <StaggerGroup className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {branches.map((branch) => (
              <StaggerItem key={branch.slug}>
                <Link
                  href={`/branches/${branch.slug}`}
                  className="card-interactive group flex h-full flex-col p-7"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-50 text-gold-600">
                      <MapPin className="h-4 w-4" />
                    </span>
                    <div>
                      <h2 className="text-h4 text-navy-900">{branch.city}</h2>
                      <p className="text-caption text-ink-500">{branch.state}</p>
                    </div>
                    {branch.isHeadquarters && (
                      <span className="ml-auto rounded-full bg-navy-900 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-white">
                        HQ
                      </span>
                    )}
                  </div>

                  <p className="mt-5 flex-1 text-body-sm text-ink-600">
                    {branch.description}
                  </p>

                  {branch.address && (
                    <p className="mt-5 text-body-sm text-ink-500">
                      {branch.address}
                    </p>
                  )}

                  <span className="mt-6 inline-flex items-center gap-2 text-body-sm font-semibold text-navy-900 transition-colors group-hover:text-gold-600">
                    Visit this centre
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Section>
      </main>
    </>
  );
}
