// Seed content: leadership profiles. Phase 3 moves this into the Payload `leadership`
// collection, where photos are uploaded rather than imported from the repo.

export interface Leader {
  name: string;
  role: string;
  bio: string;
  /** Filename under assets/images; the bundler side resolves it via assets/registry. */
  photoFile: string;
  instagram?: string;
}

// TODO: confirm with client - job titles ("President" / "Vice President") and the
// wording of both bios.
export const leadership: Leader[] = [
  {
    name: "Apostle Jide Ojo",
    role: "President, JOMI",
    bio: "Apostle Jide Ojo is a visionary leader with a mandate to reveal the finished works of Christ to the nations. His ministry is characterized by deep revelation, demonstrations of the Spirit, and raising believers to walk in dominion.",
    photoFile: "apostle-jide-ojo.webp",
    instagram: "https://www.instagram.com/apostlejideojo/",
  },
  {
    name: "Pastor Funmi Ojo",
    role: "Vice President, JOMI",
    bio: "Pastor Funmi Ojo ministers with compassion and authority, strengthening women, families, and believers in their identity in Christ. She carries a special grace for restoration and wholeness, impacting lives with God's love.",
    photoFile: "pastor-funmi-ojo.webp",
    instagram: "https://instagram.com/pastorfunmiojo",
  },
];
