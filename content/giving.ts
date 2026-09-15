// Seed content: giving and partnership. Phase 3 moves this into the Payload `giving`
// global, and adds Paystack (NGN only) for online giving.

import { TODO } from "./todo";

// TODO: confirm with client - the account name reads as a truncated
// "New Reality Christian Centre Partners". Confirm the exact name on the account,
// and that these details are current.
export const bankAccount = {
  bankName: "Zenith Bank",
  accountName: "New Reality Christian Cent Partners",
  accountNumber: "1017155976",
  currency: "NGN",
};

export interface ImpactArea {
  title: string;
  description: string;
}

export const impactAreas: ImpactArea[] = [
  {
    title: "Support Missions",
    description:
      "Fund international crusades and outreaches to unreached nations.",
  },
  {
    title: "Train Leaders",
    description:
      "Equip ministers and church leaders through structured training programs.",
  },
  {
    title: "Media Outreach",
    description:
      "Spread the message of Christ through digital platforms and broadcasts.",
  },
];

export interface ImpactStat {
  label: string;
  value: string;
}

// The previous figures (25+ nations, 500K+ lives, 10K+ leaders, 200+ events) were
// unsourced, and contradicted a different set of numbers elsewhere on the site.
// TODO: confirm with client - real figures, or drop this section.
export const impactStats: ImpactStat[] = [
  { label: "Nations Reached", value: TODO },
  { label: "Lives Touched", value: TODO },
  { label: "Leaders Trained", value: TODO },
  { label: "Events Held", value: TODO },
];

export interface PartnerTier {
  name: string;
  amount: string;
  benefits: string[];
}

// The previous tiers (Bronze/Silver/Gold/Platinum, with benefits including
// "Direct access" and "Ministry trips") were invented, and promised things the
// ministry may not intend to offer.
// TODO: confirm with client - do partnership tiers exist? If so, supply the names,
// the monthly amounts in Naira, and only benefits the ministry can honour.
export const partnerTiers: PartnerTier[] = [];
