// Seed content: who JOMI is. Phase 3 moves this into the Payload `about` global.
//
// TODO: confirm with client - this prose was already on the site and reads as genuine
// ministry copy, so it has been kept rather than blanked out. Please read it through
// and correct anything that is off before launch.

export const mission =
  "Taking the message of the finished works of Christ to the ends of the earth.";

export const vision =
  "To raise a triumphant generation that reveals the glory of Christ.";

export const summary = [
  "Jide Ojo Ministry International is an apostolic commission with a mandate to reveal the finished works of Christ and raise believers who walk in the fullness of their redemptive rights.",
  "Led by Apostle Jide Ojo, the ministry is characterized by deep revelatory teaching, demonstrations of the Spirit, and a passion to see the body of Christ come into maturity and stature.",
];

export const history = [
  "Jide Ojo Ministry International (JOMI) was born out of a clear vision received in a place of prayer and consecration. In response to God's call, Apostle Jide Ojo received a divine assignment to reveal the finished works of Christ and raise a triumphant generation grounded in their redemptive realities.",
  "What began as a small fellowship of believers with a deep hunger for the truth of God's Word has, by the leading of the Holy Spirit, grown into a ministry with expanding influence across cities and nations. Through the consistent teaching of the gospel of grace and the power of the Spirit, many lives have been transformed, destinies restored, and believers established in their identity and authority in Christ.",
  "Over the years, the ministry has witnessed testimonies of salvation, healing, restoration, and spiritual growth, confirming the faithfulness of God to His word. JOMI remains committed to building strong believers who are equipped to walk in victory and to represent Christ effectively in every sphere of life.",
  "Today, Jide Ojo Ministry International continues to advance the Kingdom through apostolic missions, leadership development, conferences, and training platforms, carrying the message of Christ to the nations and strengthening the body of Christ for global impact.",
];

// TODO: confirm with client - who should this quote be attributed to?
export const featuredQuote =
  "The gospel is not just a message we preach, it is the power of God that transforms lives.";

export interface Pillar {
  title: string;
  description: string;
}

export const mandate: Pillar[] = [
  {
    title: "Global Reach",
    description:
      "Taking the gospel to the nations through crusades, media, and church planting.",
  },
  {
    title: "Discipleship",
    description:
      "Raising believers who know their identity and walk in the authority of Christ.",
  },
  {
    title: "Compassion",
    description:
      "Demonstrating the love of God through humanitarian projects and community service.",
  },
];

export const ministryFocus: Pillar[] = [
  {
    title: "The Word",
    description:
      "Uncompromising teaching of the finished works of Christ, establishing believers in grace and truth.",
  },
  {
    title: "Equipping",
    description:
      "Training sessions, seminars, and schools of ministry to equip the saints for the work of ministry.",
  },
  {
    title: "Fellowship",
    description:
      "Creating an atmosphere of love and community where believers can grow and thrive together.",
  },
  {
    title: "Evangelism",
    description:
      "Aggressive evangelism through crusades, street outreaches, and digital media to win souls.",
  },
];

export const beliefs: Pillar[] = [
  {
    title: "The Bible",
    description:
      "We believe the Bible is the inspired, only infallible, authoritative Word of God.",
  },
  {
    title: "The Trinity",
    description:
      "We believe in one God, eternally existent in three persons: Father, Son, and Holy Spirit.",
  },
  {
    title: "Salvation",
    description:
      "We believe that salvation is by grace through faith in the finished work of Jesus Christ.",
  },
  {
    title: "The Holy Spirit",
    description:
      "We believe in the present ministry of the Holy Spirit and the gifts of the Spirit.",
  },
  {
    title: "Eternal Life",
    description:
      "We believe in the resurrection of both the saved and the lost.",
  },
];

export const values: Pillar[] = [
  {
    title: "Excellence",
    description: "We do all things with a spirit of excellence as unto the Lord.",
  },
  {
    title: "Love",
    description:
      "We are motivated by the love of God to reach the lost and serve the body.",
  },
  {
    title: "Integrity",
    description:
      "We uphold the highest standards of integrity in life and ministry.",
  },
  {
    title: "Faith",
    description:
      "We walk by faith and not by sight, trusting in God's promises.",
  },
  {
    title: "Family",
    description: "We believe in the sanctity of marriage and the family unit.",
  },
];
