/**
 * FundRight seed data — 2 communities, 5 fundraisers, 8 users, 30 donations.
 * totalRaised and donationCount are derived from donation records, not hardcoded.
 * Images use placeholder services (no local assets required): UI Avatars, Picsum.
 */

import type { Community, Donation, Fundraiser, User } from "./types";

/** Avatar URL from name (ui-avatars.com). No local image files needed. */
function avatarUrl(name: string): string {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=059669&color=fff&size=256`;
}

/** Deterministic placeholder image (picsum.photos) for heroes/banners. */
function placeholderImage(seed: string, width = 800, height = 400): string {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${width}/${height}`;
}

// ——— Users (8) ———
const usersBase: Omit<User, "donationIds" | "totalDonated">[] = [
  {
    id: "user-1",
    username: "janahan",
    name: "Janahan Selvakumaran",
    bio: "Wildfire safety advocate and community organizer. Helping families get real-time alerts when it matters most.",
    avatar: avatarUrl("Janahan Selvakumaran"),
    verified: true,
    joinDate: "2023-06-15",
    socialLinks: [
      { platform: "Twitter", url: "https://twitter.com/janahan" },
      { platform: "LinkedIn", url: "https://linkedin.com/in/janahan" },
    ],
    communityIds: ["comm-1"],
  },
  {
    id: "user-2",
    username: "maya_chen",
    name: "Maya Chen",
    bio: "Emergency response volunteer. Focused on disaster preparedness and community resilience.",
    avatar: avatarUrl("Maya Chen"),
    verified: true,
    joinDate: "2023-08-01",
    socialLinks: [{ platform: "Instagram", url: "https://instagram.com/mayachen" }],
    communityIds: ["comm-1"],
  },
  {
    id: "user-3",
    username: "david_okonkwo",
    name: "David Okonkwo",
    bio: "Former firefighter. Raising funds for equipment and training in underserved communities.",
    avatar: avatarUrl("David Okonkwo"),
    verified: true,
    joinDate: "2023-09-10",
    socialLinks: [],
    communityIds: ["comm-1", "comm-2"],
  },
  {
    id: "user-4",
    username: "sarah_lee",
    name: "Sarah Lee",
    bio: "Medical bills advocate. Helping families navigate healthcare costs and crowdfunding.",
    avatar: avatarUrl("Sarah Lee"),
    verified: false,
    joinDate: "2024-01-05",
    socialLinks: [{ platform: "Facebook", url: "https://facebook.com/sarahlee" }],
    communityIds: ["comm-2"],
  },
  {
    id: "user-5",
    username: "james_rivera",
    name: "James Rivera",
    bio: "Community health worker. Connecting people with resources for medical and housing needs.",
    avatar: avatarUrl("James Rivera"),
    verified: true,
    joinDate: "2024-02-12",
    socialLinks: [],
    communityIds: ["comm-2"],
  },
  {
    id: "user-6",
    username: "priya_sharma",
    name: "Priya Sharma",
    bio: "Donor and volunteer. Supporting wildfire relief and medical fundraisers.",
    avatar: avatarUrl("Priya Sharma"),
    verified: false,
    joinDate: "2024-03-01",
    socialLinks: [],
    communityIds: ["comm-1", "comm-2"],
  },
  {
    id: "user-7",
    username: "alex_kim",
    name: "Alex Kim",
    bio: "Tech for good. Building tools that help organizers reach more donors.",
    avatar: avatarUrl("Alex Kim"),
    verified: false,
    joinDate: "2024-03-15",
    socialLinks: [{ platform: "GitHub", url: "https://github.com/alexkim" }],
    communityIds: ["comm-1"],
  },
  {
    id: "user-8",
    username: "maria_garcia",
    name: "Maria Garcia",
    bio: "Neighbor helping neighbors. Focused on local wildfire and medical relief.",
    avatar: avatarUrl("Maria Garcia"),
    verified: true,
    joinDate: "2024-04-01",
    socialLinks: [],
    communityIds: ["comm-2"],
  },
];

// ——— Communities (2) ———
const communitiesBase: Omit<Community, "totalRaised" | "donationCount" | "fundraiserCount" | "memberCount">[] = [
  {
    id: "comm-1",
    slug: "watch-duty",
    name: "Watch Duty",
    description: "A community dedicated to wildfire safety, real-time alerts, and helping families and first responders stay safe during fire season.",
    causeCategory: "Disaster Relief & Wildfire Safety",
    bannerImageUrl: placeholderImage("watch-duty", 1200, 400),
    memberIds: ["user-1", "user-2", "user-3", "user-6", "user-7"],
    fundraiserIds: ["fund-1", "fund-2", "fund-3"],
    faq: [
      { id: "faq-1-1", question: "What is Watch Duty?", answer: "Watch Duty is a community focused on wildfire safety, real-time alerts, and supporting families and first responders during fire season. We fundraise for alert systems, equipment, and evacuation resources." },
      { id: "faq-1-2", question: "How can I help?", answer: "You can donate to any active fundraiser in this community, start your own campaign, or share fundraisers to spread awareness. Every contribution helps deploy alerts and resources where they're needed." },
      { id: "faq-1-3", question: "Where does the money go?", answer: "Funds go directly to the campaigns you choose: alert system deployment, firefighter equipment, evacuation hubs, and community training. Organizers publish updates so you can see impact." },
      { id: "faq-1-4", question: "Is my donation tax-deductible?", answer: "Tax treatment depends on the recipient organization. Check each fundraiser for details; many campaigns are run by 501(c)(3) nonprofits." },
    ],
  },
  {
    id: "comm-2",
    slug: "medical-relief",
    name: "Medical Relief Network",
    description: "Supporting families facing medical bills, treatment costs, and healthcare access. We fundraise together for those in need.",
    causeCategory: "Medical & Healthcare",
    bannerImageUrl: placeholderImage("medical-relief", 1200, 400),
    memberIds: ["user-3", "user-4", "user-5", "user-6", "user-8"],
    fundraiserIds: ["fund-4", "fund-5"],
    faq: [
      { id: "faq-2-1", question: "What is the Medical Relief Network?", answer: "We're a community that rallies around families facing medical bills, treatment costs, and healthcare access. We pool donations and support vetted campaigns so funds reach those in need." },
      { id: "faq-2-2", question: "How can I get help with medical bills?", answer: "Browse active fundraisers or start one for yourself or someone you know. Organizers share their story and goals; donors give directly to the campaign." },
      { id: "faq-2-3", question: "How are campaigns verified?", answer: "We rely on organizer profiles, updates, and community oversight. Look for verified organizers and read campaign updates before giving." },
      { id: "faq-2-4", question: "Are there fees?", answer: "FundRight charges no platform fee on donations. Payment processors may apply a small percentage; check the donation flow for details." },
    ],
  },
];

// ——— Fundraisers (5) — base with raisedAmount/donationCount/donationIds filled later from donations
const fundraisersBase: Omit<Fundraiser, "raisedAmount" | "donationCount" | "donationIds">[] = [
  {
    id: "fund-1",
    slug: "realtime-alerts-for-wildfire-safety",
    title: "Real-Time Alerts for Wildfire Safety",
    causeCategory: "Disaster Relief & Wildfire Safety",
    story: `Wildfires have become an ever-present threat in our region. Every year, families are caught off guard because they don't have access to timely, accurate information. This fundraiser exists to change that.

**The problem:** Official channels often lag. By the time evacuation orders are widely known, roads are congested and lives are at risk. Our community needs a reliable, real-time alert system that integrates with local fire agencies and volunteer networks.

**What we're funding:** We're raising money to deploy and maintain a community-run alert system that sends SMS and app notifications the moment new fires are reported or perimeters change. We're also funding training for neighborhood coordinators and distribution of emergency go-bags in high-risk zones.

**Why now:** Fire season is lengthening. The window to prepare is shortening. We've already secured partnerships with two county agencies; this fundraiser will pay for the first year of infrastructure and outreach so that thousands of families can sleep a little easier.

**Impact so far:** With your support, we've already placed alert towers in three at-risk communities. Donations have funded two training sessions and 200 go-bags. Every dollar goes directly to equipment, training, and materials—no overhead.

Thank you for helping us build a safer, more prepared community.`,
    goalAmount: 25000,
    organizerId: "user-1",
    communityId: "comm-1",
    heroImageUrl: placeholderImage("fund-1-wildfire", 800, 450),
    updates: [
      { id: "up-1-1", date: "2024-05-01", text: "Partnership confirmed with County Fire. Alert system pilot starts next month." },
      { id: "up-1-2", date: "2024-05-15", text: "First 50 go-bags distributed. Training session scheduled for June." },
    ],
  },
  {
    id: "fund-2",
    slug: "firefighter-equipment-drive",
    title: "Firefighter Equipment Drive for Underserved Communities",
    causeCategory: "Disaster Relief & Wildfire Safety",
    story: `Volunteer fire departments in rural and underserved areas often operate with outdated or insufficient equipment. When wildfires strike, these crews are the first line of defense—but they're asked to do more with less.

**The problem:** Many small departments rely on hand-me-down gear and donations. Turnout gear, respirators, and communication equipment are expensive. Without them, volunteers face greater risk and slower response times.

**What we're funding:** This drive will purchase and distribute essential PPE and communication equipment to three volunteer departments in high wildfire-risk areas. We're working with a certified supplier to get gear at cost.

**Why now:** Fire season is already underway. Getting equipment into the hands of these crews before the peak could make the difference between a contained incident and a disaster.

**Transparency:** All funds go to equipment and shipping. Labor and coordination are volunteer. We'll publish a full breakdown once the drive closes.`,
    goalAmount: 15000,
    organizerId: "user-3",
    communityId: "comm-1",
    heroImageUrl: placeholderImage("fund-2-firefighter", 800, 450),
    updates: [
      { id: "up-2-1", date: "2024-04-20", text: "First department identified. Ordering first batch of gear." },
    ],
  },
  {
    id: "fund-3",
    slug: "community-evacuation-hub",
    title: "Community Evacuation Hub — Supplies and Shelter",
    causeCategory: "Disaster Relief & Wildfire Safety",
    story: `When evacuations happen, families need a safe place to go and basic supplies. This fundraiser establishes a designated community evacuation hub with stored water, blankets, masks, and a clear protocol for opening and staffing it.

**The problem:** In past evacuations, people didn't know where to go. Shelters were overcrowded and supplies ran short. We want a local, well-stocked option that our neighborhood can rely on.

**What we're funding:** A leased space, storage for emergency supplies, and a small stipend for trained volunteers who can open the hub within 2 hours of an evacuation order. We'll also fund signage and outreach so everyone knows the location and plan.

**Why now:** Our community has grown. So has fire risk. Setting this up before the next event saves confusion and stress when every minute counts.`,
    goalAmount: 12000,
    organizerId: "user-2",
    communityId: "comm-1",
    heroImageUrl: placeholderImage("fund-3-evacuation", 800, 450),
    updates: [
      { id: "up-3-1", date: "2024-05-10", text: "Location secured. Next step: supply list and volunteer sign-up." },
    ],
  },
  {
    id: "fund-4",
    slug: "help-the-martinez-family-medical-bills",
    title: "Help the Martinez Family with Medical Bills",
    causeCategory: "Medical & Healthcare",
    story: `The Martinez family has been hit with overwhelming medical bills after their youngest child required emergency surgery and a week in the hospital. They have insurance, but out-of-pocket costs and lost wages have put them in a difficult position.

**The situation:** Their child is recovering well, but the family is facing tens of thousands in bills and has had to cut back on essentials to make payments. We're rallying to ease that burden so they can focus on recovery.

**What we're funding:** Direct support for outstanding medical bills, prescriptions, and a portion of lost income during the hospital stay. All funds go to the family; we're not taking a cut.

**Why now:** Bills are due. Every delay adds stress. Our goal is to get them to a stable place before the next round of statements.`,
    goalAmount: 20000,
    organizerId: "user-4",
    communityId: "comm-2",
    heroImageUrl: placeholderImage("fund-4-martinez", 800, 450),
    updates: [
      { id: "up-4-1", date: "2024-04-25", text: "Thank you to everyone who has given. We're about 40% of the way to our goal." },
      { id: "up-4-2", date: "2024-05-05", text: "Child is home and doing well. Family is incredibly grateful." },
    ],
  },
  {
    id: "fund-5",
    slug: "cancer-treatment-support-fund",
    title: "Cancer Treatment Support Fund",
    causeCategory: "Medical & Healthcare",
    story: `We've created a community fund to help families in our network who are facing cancer treatment costs. Insurance doesn't cover everything—travel, lodging near treatment centers, and uncovered procedures add up fast.

**The problem:** Several families in our community are struggling with treatment-related costs. We want to pool resources so that when someone is in need, we can offer quick, no-hassle support.

**What we're funding:** Grants to verified families for out-of-pocket treatment costs, travel, and temporary housing. A small committee of community members and a healthcare social worker will review requests and disburse funds.

**Why now:** Need is ongoing. The sooner we build this fund, the sooner we can help the next family that gets a difficult diagnosis.`,
    goalAmount: 30000,
    organizerId: "user-5",
    communityId: "comm-2",
    heroImageUrl: placeholderImage("fund-5-cancer", 800, 450),
    updates: [
      { id: "up-5-1", date: "2024-05-01", text: "Fund is live. First applications under review." },
    ],
  },
];

// ——— Donations (30) — raw list; we derive fundraiser and user stats from this
const donationsRaw: Donation[] = [
  { id: "don-1", amount: 50, donorId: "user-6", fundraiserId: "fund-1", message: "Stay safe out there.", createdAt: "2024-05-02T10:00:00Z" },
  { id: "don-2", amount: 100, donorId: "user-7", fundraiserId: "fund-1", message: "Thank you for doing this.", createdAt: "2024-05-02T11:30:00Z" },
  { id: "don-3", amount: 25, donorId: "user-2", fundraiserId: "fund-1", createdAt: "2024-05-03T09:00:00Z" },
  { id: "don-4", amount: 250, donorId: "user-3", fundraiserId: "fund-1", message: "Proud to support.", createdAt: "2024-05-03T14:00:00Z" },
  { id: "don-5", amount: 75, donorId: "user-8", fundraiserId: "fund-1", createdAt: "2024-05-04T08:00:00Z" },
  { id: "don-6", amount: 50, donorId: "user-1", fundraiserId: "fund-2", message: "For our firefighters.", createdAt: "2024-05-01T12:00:00Z" },
  { id: "don-7", amount: 100, donorId: "user-6", fundraiserId: "fund-2", createdAt: "2024-05-02T16:00:00Z" },
  { id: "don-8", amount: 200, donorId: "user-2", fundraiserId: "fund-2", message: "Critical cause.", createdAt: "2024-05-03T10:00:00Z" },
  { id: "don-9", amount: 50, donorId: "user-7", fundraiserId: "fund-2", createdAt: "2024-05-04T09:00:00Z" },
  { id: "don-10", amount: 25, donorId: "user-4", fundraiserId: "fund-2", createdAt: "2024-05-05T11:00:00Z" },
  { id: "don-11", amount: 50, donorId: "user-1", fundraiserId: "fund-3", createdAt: "2024-05-02T08:00:00Z" },
  { id: "don-12", amount: 100, donorId: "user-6", fundraiserId: "fund-3", message: "Every community needs this.", createdAt: "2024-05-02T14:00:00Z" },
  { id: "don-13", amount: 50, donorId: "user-3", fundraiserId: "fund-3", createdAt: "2024-05-03T09:00:00Z" },
  { id: "don-14", amount: 25, donorId: "user-7", fundraiserId: "fund-3", createdAt: "2024-05-04T10:00:00Z" },
  { id: "don-15", amount: 75, donorId: "user-8", fundraiserId: "fund-3", message: "Glad to help.", createdAt: "2024-05-05T15:00:00Z" },
  { id: "don-16", amount: 100, donorId: "user-3", fundraiserId: "fund-4", message: "Sending love to the family.", createdAt: "2024-04-26T10:00:00Z" },
  { id: "don-17", amount: 50, donorId: "user-6", fundraiserId: "fund-4", createdAt: "2024-04-27T12:00:00Z" },
  { id: "don-18", amount: 250, donorId: "user-5", fundraiserId: "fund-4", message: "We're with you.", createdAt: "2024-04-28T09:00:00Z" },
  { id: "don-19", amount: 50, donorId: "user-8", fundraiserId: "fund-4", createdAt: "2024-04-29T14:00:00Z" },
  { id: "don-20", amount: 100, donorId: "user-1", fundraiserId: "fund-4", createdAt: "2024-04-30T11:00:00Z" },
  { id: "don-21", amount: 25, donorId: "user-2", fundraiserId: "fund-4", createdAt: "2024-05-01T08:00:00Z" },
  { id: "don-22", amount: 75, donorId: "user-7", fundraiserId: "fund-4", message: "Hope things get easier.", createdAt: "2024-05-02T16:00:00Z" },
  { id: "don-23", amount: 100, donorId: "user-4", fundraiserId: "fund-5", message: "Paying it forward.", createdAt: "2024-05-01T10:00:00Z" },
  { id: "don-24", amount: 50, donorId: "user-6", fundraiserId: "fund-5", createdAt: "2024-05-01T14:00:00Z" },
  { id: "don-25", amount: 200, donorId: "user-8", fundraiserId: "fund-5", message: "Important work.", createdAt: "2024-05-02T09:00:00Z" },
  { id: "don-26", amount: 50, donorId: "user-3", fundraiserId: "fund-5", createdAt: "2024-05-03T11:00:00Z" },
  { id: "don-27", amount: 100, donorId: "user-1", fundraiserId: "fund-5", createdAt: "2024-05-04T10:00:00Z" },
  { id: "don-28", amount: 25, donorId: "user-2", fundraiserId: "fund-5", createdAt: "2024-05-05T12:00:00Z" },
  { id: "don-29", amount: 150, donorId: "user-5", fundraiserId: "fund-5", message: "For everyone fighting.", createdAt: "2024-05-06T08:00:00Z" },
  { id: "don-30", amount: 50, donorId: "user-7", fundraiserId: "fund-5", createdAt: "2024-05-06T14:00:00Z" },
];

// ——— Derive fundraiser stats from donations ———
function buildFundraisers(): Fundraiser[] {
  const byFundraiser = new Map<string, { raised: number; count: number; ids: string[] }>();
  for (const d of donationsRaw) {
    const cur = byFundraiser.get(d.fundraiserId) ?? { raised: 0, count: 0, ids: [] };
    cur.raised += d.amount;
    cur.count += 1;
    cur.ids.push(d.id);
    byFundraiser.set(d.fundraiserId, cur);
  }
  return fundraisersBase.map((f) => {
    const stats = byFundraiser.get(f.id) ?? { raised: 0, count: 0, ids: [] };
    return {
      ...f,
      raisedAmount: stats.raised,
      donationCount: stats.count,
      donationIds: stats.ids,
    };
  });
}

// ——— Derive user donationIds and totalDonated from donations ———
function buildUsers(): User[] {
  const byUser = new Map<string, { ids: string[]; total: number }>();
  for (const d of donationsRaw) {
    const cur = byUser.get(d.donorId) ?? { ids: [], total: 0 };
    cur.ids.push(d.id);
    cur.total += d.amount;
    byUser.set(d.donorId, cur);
  }
  return usersBase.map((u) => {
    const stats = byUser.get(u.id) ?? { ids: [], total: 0 };
    return {
      ...u,
      donationIds: stats.ids,
      totalDonated: stats.total,
    };
  });
}

// ——— Derive community stats from fundraisers (use built fundraisers) ———
function buildCommunities(fundraisers: Fundraiser[]): Community[] {
  const fundByComm = new Map<string, Fundraiser[]>();
  for (const f of fundraisers) {
    const list = fundByComm.get(f.communityId) ?? [];
    list.push(f);
    fundByComm.set(f.communityId, list);
  }
  return communitiesBase.map((c) => {
    const commFunds = fundByComm.get(c.id) ?? [];
    const totalRaised = commFunds.reduce((s, f) => s + f.raisedAmount, 0);
    const donationCount = commFunds.reduce((s, f) => s + f.donationCount, 0);
    return {
      ...c,
      totalRaised,
      donationCount,
      fundraiserCount: commFunds.length,
      memberCount: c.memberIds.length,
    };
  });
}

// ——— Public seed (order: build fundraisers first, then users, then communities) ———
const fundraisers = buildFundraisers();
export const users: User[] = buildUsers();
export const fundraisersSeed: Fundraiser[] = fundraisers;
export const communities: Community[] = buildCommunities(fundraisers);
export const donations: Donation[] = donationsRaw;

export const seed = {
  users,
  fundraisers: fundraisersSeed,
  communities,
  donations,
};

export default seed;
