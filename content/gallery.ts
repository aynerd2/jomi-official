// Seed content: the photo gallery. Phase 3 moves this into the Payload `gallery`
// collection, where images are uploaded rather than imported from the repo.
//
// These are the ministry's own photographs, several of which were sitting unused
// in the repo. Captions are descriptive rather than invented detail.
//
// TODO: confirm with client - real captions (event, city and year for each), and
// more photography from services, conferences and outreaches.


export interface GalleryImage {
  id: string;
  /** Filename under assets/images; the bundler side resolves it via assets/registry. */
  imageFile: string;
  caption: string;
}

export const galleryImages: GalleryImage[] = [
  { id: "audience", imageFile: "audience.jpg", caption: "The congregation in worship" },
  { id: "jomi-start", imageFile: "Jomi_Start.jpg", caption: "The early days of the ministry" },
  { id: "apostle-and-pastor", imageFile: "apostle-and-pastor-ojo.webp", caption: "Apostle Jide Ojo and Pastor Funmi Ojo" },
  { id: "daddy1", imageFile: "Daddy1.jpg", caption: "Apostle Jide Ojo ministering" },
  { id: "daddy2", imageFile: "Daddy2.jpg", caption: "Teaching the finished works of Christ" },
  { id: "daddy3", imageFile: "Daddy3.jpg", caption: "Ministering at a gathering" },
  { id: "daddy4", imageFile: "Daddy4.jpg", caption: "At the altar" },
  { id: "dad-shot", imageFile: "dad-shot.jpg", caption: "Apostle Jide Ojo" },
  { id: "dad-shot2", imageFile: "dad-shot2.jpg", caption: "Apostle Jide Ojo" },
  { id: "apostle-portrait", imageFile: "apostle-jide-ojo-portrait.jpg", caption: "Apostle Jide Ojo, President" },
  { id: "mummy1", imageFile: "Mummy1.jpg", caption: "Pastor Funmi Ojo ministering" },
  { id: "pastor-portrait", imageFile: "pastor-funmi-ojo-portrait.jpg", caption: "Pastor Funmi Ojo, Vice President" },
  { id: "partner", imageFile: "Partner.jpg", caption: "Partners of the ministry" },
  { id: "testimony", imageFile: "Testimony.jpg", caption: "Giving glory to God" },
];
