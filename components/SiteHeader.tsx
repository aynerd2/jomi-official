import Navigation from "./Navigation";
import { getMinistryArms } from "@/lib/cms";

/**
 * Server wrapper around the navigation, so the Ministries dropdown is built
 * from the CMS while the navigation itself stays a client component.
 */
export default async function SiteHeader() {
  const arms = await getMinistryArms();
  return <Navigation arms={arms} />;
}
