/**
 * FundRight seed data — 12 communities, 11 fundraisers, 8 users, 48 donations.
 * totalRaised and donationCount are derived from donation records, not hardcoded.
 * Images: curated Unsplash (heroes/banners) + Pravatar (faces); see lib/data/fundraising-images.ts.
 */

import type { Community, Donation, Fundraiser, User } from "./types";
import {
  communityBanner,
  demoAvatarUrl,
  fundraiserHero,
  fundraisingHeroFromSeed,
} from "./fundraising-images";

// ——— Users (8) ———
const usersBase: Omit<User, "donationIds" | "totalDonated">[] = [
  {
    id: "user-1",
    username: "janahan",
    name: "Janahan Selvakumaran",
    bio: "Wildfire safety advocate and community organizer. Helping families get real-time alerts when it matters most.",
    avatar: demoAvatarUrl("user-1"),
    verified: true,
    joinDate: "2023-06-15",
    socialLinks: [
      { platform: "Twitter", url: "https://twitter.com/janahan" },
      { platform: "LinkedIn", url: "https://linkedin.com/in/janahan" },
    ],
    communityIds: ["comm-1", "comm-4", "comm-8", "comm-11"],
    sameAs: ["https://twitter.com/janahan", "https://linkedin.com/in/janahan"],
  },
  {
    id: "user-2",
    username: "maya_chen",
    name: "Maya Chen",
    bio: "Emergency response volunteer. Focused on disaster preparedness and community resilience.",
    avatar: demoAvatarUrl("user-2"),
    verified: true,
    joinDate: "2023-08-01",
    socialLinks: [{ platform: "Instagram", url: "https://instagram.com/mayachen" }],
    communityIds: ["comm-1", "comm-3", "comm-6", "comm-9", "comm-12"],
    sameAs: ["https://instagram.com/mayachen"],
  },
  {
    id: "user-3",
    username: "david_okonkwo",
    name: "David Okonkwo",
    bio: "Former firefighter. Raising funds for equipment and training in underserved communities.",
    avatar: demoAvatarUrl("user-3"),
    verified: true,
    joinDate: "2023-09-10",
    socialLinks: [],
    communityIds: ["comm-1", "comm-2", "comm-4", "comm-7", "comm-11"],
    sameAs: [],
  },
  {
    id: "user-4",
    username: "sarah_lee",
    name: "Sarah Lee",
    bio: "Medical bills advocate. Helping families navigate healthcare costs and crowdfunding.",
    avatar: demoAvatarUrl("user-4"),
    verified: false,
    joinDate: "2024-01-05",
    socialLinks: [{ platform: "Facebook", url: "https://facebook.com/sarahlee" }],
    communityIds: ["comm-2", "comm-6", "comm-10"],
    sameAs: ["https://facebook.com/sarahlee"],
  },
  {
    id: "user-5",
    username: "james_rivera",
    name: "James Rivera",
    bio: "Community health worker. Connecting people with resources for medical and housing needs.",
    avatar: demoAvatarUrl("user-5"),
    verified: true,
    joinDate: "2024-02-12",
    socialLinks: [],
    communityIds: ["comm-2", "comm-5", "comm-6", "comm-8", "comm-10"],
    sameAs: [],
  },
  {
    id: "user-6",
    username: "priya_sharma",
    name: "Priya Sharma",
    bio: "Donor and volunteer. Supporting wildfire relief and medical fundraisers.",
    avatar: demoAvatarUrl("user-6"),
    verified: false,
    joinDate: "2024-03-01",
    socialLinks: [],
    communityIds: ["comm-1", "comm-2", "comm-4", "comm-5", "comm-6", "comm-7", "comm-9", "comm-12"],
    sameAs: [],
  },
  {
    id: "user-7",
    username: "alex_kim",
    name: "Alex Kim",
    bio: "Tech for good. Building tools that help organizers reach more donors.",
    avatar: demoAvatarUrl("user-7"),
    verified: false,
    joinDate: "2024-03-15",
    socialLinks: [{ platform: "GitHub", url: "https://github.com/alexkim" }],
    communityIds: ["comm-1", "comm-3", "comm-6", "comm-7", "comm-9", "comm-10"],
    sameAs: ["https://github.com/alexkim"],
  },
  {
    id: "user-8",
    username: "maria_garcia",
    name: "Maria Garcia",
    bio: "Neighbor helping neighbors. Focused on local wildfire and medical relief.",
    avatar: demoAvatarUrl("user-8"),
    verified: true,
    joinDate: "2024-04-01",
    socialLinks: [],
    communityIds: ["comm-2", "comm-3", "comm-4", "comm-5", "comm-8", "comm-11", "comm-12"],
    sameAs: [],
  },
];

// ——— Communities (12) ———
const communitiesBase: Omit<Community, "totalRaised" | "donationCount" | "fundraiserCount" | "memberCount">[] = [
  {
    id: "comm-1",
    slug: "watch-duty",
    name: "Watch Duty",
    description: "A community dedicated to wildfire safety, real-time alerts, and helping families and first responders stay safe during fire season.",
    causeCategory: "Disaster Relief & Wildfire Safety",
    bannerImageUrl: communityBanner.mutualAid,
    memberIds: ["user-1", "user-2", "user-3", "user-6", "user-7"],
    fundraiserIds: ["fund-1", "fund-2", "fund-3"],
    sameAs: ["https://twitter.com/WatchDutyOrg", "https://www.watchduty.org"],
    nonprofitStatus: "501(c)(3)",
    faq: [
      { id: "faq-1-1", question: "How do I donate to wildfire relief near me?", answer: "Browse active wildfire relief fundraisers in the Watch Duty community. Each campaign lists its location, goal, and organizer. You can donate directly — 100% of your contribution goes to the campaign with no platform fee." },
      { id: "faq-1-2", question: "What is the best way to help wildfire victims in 2024?", answer: "The most effective way to help is donating to verified community fundraisers that fund real-time alert systems, firefighter equipment, and evacuation supplies. Watch Duty campaigns are organized by local volunteers and first responders who publish transparent updates on how funds are used." },
      { id: "faq-1-3", question: "Are wildfire relief donations tax-deductible?", answer: "Many Watch Duty campaigns are run by 501(c)(3) nonprofits, making donations tax-deductible. Check each fundraiser's details for the recipient organization's tax status. We recommend consulting a tax professional for your specific situation." },
      { id: "faq-1-4", question: "How does Watch Duty use donations for wildfire safety?", answer: "Donations fund four key areas: real-time alert system deployment (SMS and app notifications), firefighter PPE and communication equipment for volunteer departments, community evacuation hubs with supplies and trained volunteers, and neighborhood coordinator training programs." },
    ],
  },
  {
    id: "comm-2",
    slug: "medical-relief",
    name: "Medical Relief Network",
    description: "Supporting families facing medical bills, treatment costs, and healthcare access. We fundraise together for those in need.",
    causeCategory: "Medical & Healthcare",
    bannerImageUrl: communityBanner.familyHome,
    memberIds: ["user-3", "user-4", "user-5", "user-6", "user-8"],
    fundraiserIds: ["fund-4", "fund-5"],
    sameAs: ["https://twitter.com/MedReliefNet"],
    nonprofitStatus: "501(c)(3)",
    faq: [
      { id: "faq-2-1", question: "How can I crowdfund for medical bills?", answer: "Start a fundraiser on FundRight through the Medical Relief Network. Share your story, set a goal, and publish updates as your situation evolves. Donors give directly to your campaign with no platform fee. Verified organizers receive a trust badge that increases donor confidence." },
      { id: "faq-2-2", question: "What is the best fundraising site for medical expenses?", answer: "FundRight's Medical Relief Network connects families facing medical costs with a community of verified donors. Unlike generic platforms, every campaign is community-backed with organizer verification, transparent updates, and zero platform fees. A healthcare social worker reviews grant requests for the community fund." },
      { id: "faq-2-3", question: "How do I verify a medical fundraiser is legitimate?", answer: "Look for verified organizer badges, read campaign updates, and check the organizer's profile and donation history. Medical Relief Network campaigns include community oversight — members can flag concerns, and organizers with a track record of updates earn higher trust scores." },
      { id: "faq-2-4", question: "Does FundRight charge fees on medical donations?", answer: "FundRight charges no platform fee on any donation. Payment processors apply a small percentage (typically 2.9% + $0.30 per transaction). 100% of the remaining amount goes directly to the campaign organizer." },
    ],
  },
  {
    id: "comm-3",
    slug: "education-forward",
    name: "Education Forward",
    description: "A community supporting classroom supplies, after-school enrichment, and student-led opportunities in underfunded schools.",
    causeCategory: "Education",
    bannerImageUrl: communityBanner.classroom,
    memberIds: ["user-2", "user-7", "user-8"],
    fundraiserIds: ["fund-7"],
    sameAs: ["https://twitter.com/EduForward", "https://www.educationforward.org"],
    nonprofitStatus: "501(c)(3)",
    faq: [
      { id: "faq-3-1", question: "What kinds of education campaigns belong here?", answer: "Education Forward supports classroom projects, tutoring access, school technology, arts enrichment, and student opportunity funds. Organizers use the community to rally local donors around practical, high-impact education needs." },
      { id: "faq-3-2", question: "Can teachers and parents both start fundraisers?", answer: "Yes. Teachers, parents, student groups, and community advocates can all create campaigns as long as they clearly explain the need, goal amount, and who will benefit from the funds raised." },
      { id: "faq-3-3", question: "How do donors know where school funds go?", answer: "Each fundraiser includes a goal, updates, and organizer profile details so donors can follow progress. FundRight communities encourage transparent updates that show what was purchased or who benefited." },
    ],
  },
  {
    id: "comm-4",
    slug: "climate-resilience",
    name: "Climate Resilience Collective",
    description: "Organizing around local resilience projects, environmental recovery, and community preparedness for climate-driven emergencies.",
    causeCategory: "Environment & Climate",
    bannerImageUrl: communityBanner.climateAction,
    memberIds: ["user-1", "user-3", "user-6", "user-8"],
    fundraiserIds: [],
    sameAs: ["https://twitter.com/ClimateResilience", "https://www.climateresiliencecollective.org"],
    nonprofitStatus: "501(c)(3)",
    faq: [
      { id: "faq-4-1", question: "What does climate resilience mean in this community?", answer: "This community focuses on local projects that help people prepare for climate disruption, from emergency planning and cooling resources to neighborhood response systems and environmental recovery efforts." },
      { id: "faq-4-2", question: "Do environmental campaigns need to be nonprofit-led?", answer: "No. Grassroots organizers, neighborhood groups, and nonprofit teams can all participate, as long as the campaign is transparent about what the money funds and how the work benefits the community." },
      { id: "faq-4-3", question: "How can I help beyond donating?", answer: "Many campaigns here also need volunteers, local expertise, and people who can share resources. Check fundraiser updates and organizer profiles to see how each project invites community support." },
    ],
  },
  {
    id: "comm-5",
    slug: "animal-rescue-aid",
    name: "Animal Rescue Aid",
    description: "Helping shelters, fosters, and rescue volunteers cover urgent care, food, transport, and safe housing for animals in need.",
    causeCategory: "Animals & Wildlife",
    bannerImageUrl: communityBanner.animalCare,
    memberIds: ["user-5", "user-6", "user-8"],
    fundraiserIds: [],
    sameAs: ["https://instagram.com/animalrescueaid"],
    nonprofitStatus: "501(c)(3)",
    faq: [
      { id: "faq-5-1", question: "What kinds of animal fundraisers are supported here?", answer: "Animal Rescue Aid is built for foster care, emergency vet bills, shelter supply drives, rescue transport, and recovery support for animals displaced or injured in crisis situations." },
      { id: "faq-5-2", question: "Can individual rescuers create campaigns?", answer: "Yes. Individual rescuers and foster networks can create campaigns, especially when they explain the animal’s needs, care timeline, and how donors can follow along with updates." },
      { id: "faq-5-3", question: "How do updates help animal rescue campaigns?", answer: "Photos, health updates, and care milestones build trust with donors. They show the real impact of support and help rescue campaigns maintain momentum over time." },
    ],
  },
  {
    id: "comm-6",
    slug: "neighbors-first",
    name: "Neighbors First",
    description: "A mutual aid community for rent support, emergency essentials, and fast neighborhood response when families hit a sudden crisis.",
    causeCategory: "Community & Neighbors",
    bannerImageUrl: communityBanner.neighborsSupport,
    memberIds: ["user-2", "user-4", "user-5", "user-6", "user-7"],
    fundraiserIds: [],
    sameAs: ["https://facebook.com/neighborsfirst"],
    nonprofitStatus: "Community mutual aid network",
    faq: [
      { id: "faq-6-1", question: "What is mutual aid on FundRight?", answer: "Neighbors First supports direct community help: rent support, groceries, transportation, recovery costs, and other urgent essentials that keep people stable during a difficult moment." },
      { id: "faq-6-2", question: "How quickly do these campaigns move?", answer: "Mutual aid campaigns are often urgent and community-driven. Organizers typically post frequent updates so donors can see immediate needs, rapid response goals, and when a family reaches safety or stability." },
      { id: "faq-6-3", question: "Who creates community emergency campaigns here?", answer: "Campaigns often come from neighbors, local organizers, advocates, or people directly helping a family through a crisis. Strong organizer context and updates help donors feel confident supporting fast-moving needs." },
    ],
  },
  {
    id: "comm-7",
    slug: "youth-sports-alliance",
    name: "Youth Sports Alliance",
    description: "A community backing youth teams, school athletics, equipment drives, and access to sports for kids who might otherwise be left out.",
    causeCategory: "Community & Neighbors",
    bannerImageUrl: communityBanner.youthPrograms,
    memberIds: ["user-3", "user-6", "user-7"],
    fundraiserIds: [],
    sameAs: ["https://instagram.com/youthsportsalliance"],
    nonprofitStatus: "501(c)(3)",
    faq: [
      { id: "faq-7-1", question: "What do youth sports fundraisers usually cover?", answer: "This community supports equipment, league fees, travel support, uniforms, and safe access to after-school sports. Campaigns are designed to reduce participation barriers for young athletes and neighborhood teams." },
      { id: "faq-7-2", question: "Can coaches and parents both organize here?", answer: "Yes. Coaches, parents, boosters, and local program leaders can all launch campaigns if they clearly explain who benefits, what the funds cover, and how supporters can follow the impact." },
      { id: "faq-7-3", question: "Why include sports in a community aid platform?", answer: "Sports programs create belonging, stability, and healthy routines for young people. For many families, small costs like gear or fees can be the difference between participating and sitting out." },
    ],
  },
  {
    id: "comm-8",
    slug: "coastal-care-circle",
    name: "Coastal Care Circle",
    description: "Supporting beach cleanups, shoreline recovery, and local volunteer projects that protect coastal communities and habitats.",
    causeCategory: "Environment & Climate",
    bannerImageUrl: communityBanner.coastalCare,
    memberIds: ["user-1", "user-5", "user-8"],
    fundraiserIds: ["fund-9"],
    sameAs: ["https://www.coastalcarecircle.org"],
    nonprofitStatus: "501(c)(3)",
    faq: [
      { id: "faq-8-1", question: "What kinds of projects fit Coastal Care Circle?", answer: "Campaigns here fund beach cleanups, shoreline restoration, marine debris removal, volunteer supplies, and other projects that help coastal neighborhoods stay safer and healthier." },
      { id: "faq-8-2", question: "Are these projects local or national?", answer: "Most campaigns are local and community-led. The goal is to help donors support hands-on coastal recovery efforts where organizers can show direct progress through updates and volunteer milestones." },
      { id: "faq-8-3", question: "How can donors judge impact on environmental campaigns?", answer: "Organizers are encouraged to share before-and-after photos, cleanup counts, habitat outcomes, and local partner details so donors can see concrete environmental results instead of vague promises." },
    ],
  },
  {
    id: "comm-9",
    slug: "scholarship-access-project",
    name: "Scholarship Access Project",
    description: "Expanding access to tuition support, laptops, books, and mentorship for students pursuing their next step in school.",
    causeCategory: "Education",
    bannerImageUrl: communityBanner.scholarshipSupport,
    memberIds: ["user-2", "user-6", "user-7"],
    fundraiserIds: ["fund-6"],
    sameAs: ["https://twitter.com/ScholarAccess"],
    nonprofitStatus: "501(c)(3)",
    faq: [
      { id: "faq-9-1", question: "What does this community fund beyond tuition?", answer: "Scholarship Access Project supports books, laptops, testing fees, transportation, and mentorship-linked opportunity funds alongside tuition help. The goal is to remove the smaller barriers that often block student progress." },
      { id: "faq-9-2", question: "Who can create a student support campaign?", answer: "Students, families, educators, and community mentors can all create campaigns when they provide clear context around the need, timeline, and intended educational outcome." },
      { id: "faq-9-3", question: "Why are community-backed scholarship campaigns effective?", answer: "They combine financial support with trust and local validation. Donors can see who the organizer is, how funds will be used, and what milestone the student is working toward next." },
    ],
  },
  {
    id: "comm-10",
    slug: "community-kitchen-network",
    name: "Community Kitchen Network",
    description: "Helping neighborhood kitchens, food pantries, and rapid-response meal teams provide dignified support when families need it most.",
    causeCategory: "Community & Neighbors",
    bannerImageUrl: communityBanner.communityKitchen,
    memberIds: ["user-4", "user-5", "user-7"],
    fundraiserIds: ["fund-11"],
    sameAs: ["https://facebook.com/communitykitchennetwork"],
    nonprofitStatus: "Community mutual aid network",
    faq: [
      { id: "faq-10-1", question: "What do community kitchen campaigns typically fund?", answer: "Campaigns often cover groceries, meal prep supplies, cold storage, packaging, delivery support, and emergency pantry restocks so neighborhood food teams can respond quickly and reliably." },
      { id: "faq-10-2", question: "How is this different from a general food charity?", answer: "Community Kitchen Network focuses on fast, local response. Organizers are close to the need, share updates regularly, and often provide meals directly to families navigating a sudden job loss, illness, or crisis." },
      { id: "faq-10-3", question: "Can volunteers use the community without being a nonprofit?", answer: "Yes. Volunteer-run food programs can create campaigns as long as they explain the local need, show how funds will be used, and keep supporters informed with transparent updates." },
    ],
  },
  {
    id: "comm-11",
    slug: "wildlife-habitat-watch",
    name: "Wildlife Habitat Watch",
    description: "Protecting local habitats, wildlife rescue corridors, and community stewardship projects that keep animals and ecosystems safe.",
    causeCategory: "Animals & Wildlife",
    bannerImageUrl: communityBanner.wildlifeHabitat,
    memberIds: ["user-1", "user-3", "user-8"],
    fundraiserIds: ["fund-10"],
    sameAs: ["https://www.wildlifehabitatwatch.org"],
    nonprofitStatus: "501(c)(3)",
    faq: [
      { id: "faq-11-1", question: "What does Wildlife Habitat Watch support?", answer: "This community backs habitat restoration, rescue infrastructure, wildlife-safe fencing, migration corridor protection, and local education projects that help people coexist more safely with wildlife." },
      { id: "faq-11-2", question: "Are these campaigns more about rescue or prevention?", answer: "Both. Some campaigns respond to immediate rescue needs, while others fund long-term prevention work that protects habitats before emergencies or displacement happen." },
      { id: "faq-11-3", question: "How do organizers show progress on habitat campaigns?", answer: "Strong campaigns share site photos, restoration milestones, partner updates, and concrete stewardship goals so donors can understand how community support improves wildlife outcomes over time." },
    ],
  },
  {
    id: "comm-12",
    slug: "clean-air-action",
    name: "Clean Air Action",
    description: "A community focused on air quality monitors, clean-air shelters, and neighborhood resilience during smoke and pollution events.",
    causeCategory: "Environment & Climate",
    bannerImageUrl: communityBanner.cleanAirAction,
    memberIds: ["user-2", "user-6", "user-8"],
    fundraiserIds: ["fund-8"],
    sameAs: ["https://twitter.com/CleanAirAction"],
    nonprofitStatus: "501(c)(3)",
    faq: [
      { id: "faq-12-1", question: "What kinds of campaigns fit a clean air community?", answer: "Clean Air Action supports projects like air monitor deployment, filter distribution, smoke-safe spaces, and education campaigns that help neighborhoods respond quickly during poor air quality events." },
      { id: "faq-12-2", question: "Why is air quality a community fundraising issue?", answer: "Smoke and pollution events affect families unevenly, especially children, seniors, and people with asthma. Local campaigns let communities respond faster with practical tools and shared protection plans." },
      { id: "faq-12-3", question: "Can organizers connect air quality work to disaster preparedness?", answer: "Yes. Many campaigns here sit at the intersection of climate resilience and health, helping neighborhoods prepare for wildfire smoke, heat events, and longer periods of unhealthy air." },
    ],
  },
];

// ——— Fundraisers (11) — base with raisedAmount/donationCount/donationIds filled later from donations
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
    heroImageUrl: fundraiserHero.familySafety,
    updates: [
      { id: "up-1-1", date: "2024-05-01", text: "Partnership confirmed with County Fire. Alert system pilot starts next month.", quote: "This partnership means 12,000 families in fire zones will get alerts within 90 seconds of a new report — that's faster than any official channel. — Janahan Selvakumaran, Campaign Organizer" },
      { id: "up-1-2", date: "2024-05-15", text: "First 50 go-bags distributed. Training session scheduled for June.", quote: "We handed out 50 go-bags at the community center in under two hours. Families told us they'd never had an evacuation plan before. — Janahan Selvakumaran, Campaign Organizer" },
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
    heroImageUrl: fundraiserHero.firstResponder,
    updates: [
      { id: "up-2-1", date: "2024-04-20", text: "First department identified. Ordering first batch of gear.", quote: "These volunteers have been running into fires with 15-year-old turnout gear. This drive changes that. — David Okonkwo, Former Firefighter & Campaign Organizer" },
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
    heroImageUrl: fundraiserHero.familyTogether,
    updates: [
      { id: "up-3-1", date: "2024-05-10", text: "Location secured. Next step: supply list and volunteer sign-up.", quote: "In the last evacuation, people drove in circles looking for shelter. This hub means they'll know exactly where to go. — Maya Chen, Emergency Response Volunteer" },
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
    heroImageUrl: fundraiserHero.childHope,
    updates: [
      { id: "up-4-1", date: "2024-04-25", text: "Thank you to everyone who has given. We're about 40% of the way to our goal.", quote: "Every donation takes one more bill off the stack. We never expected this many people to step up. — Sarah Lee, Medical Bills Advocate" },
      { id: "up-4-2", date: "2024-05-05", text: "Child is home and doing well. Family is incredibly grateful.", quote: "Our son is back home playing with his sister. The community's support means we can focus on his recovery instead of the bills. — The Martinez Family" },
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
    heroImageUrl: fundraiserHero.careSupport,
    updates: [
      { id: "up-5-1", date: "2024-05-01", text: "Fund is live. First applications under review.", quote: "We've already received 3 applications in the first week. The need is real and urgent — families shouldn't have to choose between treatment and rent. — James Rivera, Community Health Worker" },
    ],
  },
  {
    id: "fund-6",
    slug: "laptops-for-first-gen-students",
    title: "Laptops for First-Gen Students",
    causeCategory: "Education",
    story: `Students in our Scholarship Access Project keep telling the same story: they have the grades, the drive, and the acceptance letters, but not the hardware they need to keep up once classes begin. Many are sharing one aging laptop across a household or trying to finish assignments on a phone.

**The need:** Reliable laptops are now a baseline requirement for high school dual-enrollment, college coursework, scholarship applications, and remote advising. Without them, students lose hours each week and fall behind on opportunities they already earned.

**What this campaign funds:** We are purchasing refurbished laptops, protective sleeves, and one year of basic software access for first-generation students preparing for the next school year. We are also setting aside a small portion for setup sessions so each student can leave with a working machine on day one.

**Why now:** Summer is the planning window. If we raise the money now, students can begin the fall term with the tools they need instead of starting behind.

This fundraiser gives practical support at a moment when a small intervention can change a student's entire trajectory.`,
    goalAmount: 9000,
    organizerId: "user-7",
    communityId: "comm-9",
    heroImageUrl: fundraisingHeroFromSeed("laptops-for-first-gen-students"),
    updates: [
      { id: "up-6-1", date: "2024-05-08", text: "School counselors confirmed the first list of students who need device support.", quote: "The difference between having a laptop on day one and waiting three weeks is huge. This campaign is about removing that gap before it becomes a setback. — Alex Kim, Campaign Organizer" },
    ],
  },
  {
    id: "fund-7",
    slug: "after-school-arts-scholarship-fund",
    title: "After-School Arts Scholarship Fund",
    causeCategory: "Education",
    story: `Creative programs are often the first thing families cut when money is tight, even though those same programs give students confidence, mentorship, and a reason to stay engaged after school.

**The challenge:** Families in our district are juggling rent, food, and transportation. Music lessons, theater fees, and art supplies quickly become unaffordable, especially for students who would benefit most from a consistent outlet.

**What we're funding:** This scholarship fund covers enrollment fees, instruments and art kits, transit support, and showcase costs for students joining after-school arts programs. We are partnering with two community centers so the dollars can move directly into placements before fall signups close.

**Why now:** Program applications open soon. We want families to say yes when the opportunity appears, instead of walking away because the total cost is just out of reach.

The goal is simple: keep creativity accessible for students who deserve the same chance to participate as anyone else.`,
    goalAmount: 12000,
    organizerId: "user-2",
    communityId: "comm-3",
    heroImageUrl: fundraisingHeroFromSeed("after-school-arts-scholarship-fund"),
    updates: [
      { id: "up-7-1", date: "2024-05-11", text: "Two arts nonprofits agreed to reserve spots for scholarship recipients.", quote: "We already know the interest is there. This fund makes sure money isn't the reason a student misses out. — Maya Chen, Community Organizer" },
    ],
  },
  {
    id: "fund-8",
    slug: "neighborhood-air-monitor-network",
    title: "Neighborhood Air Monitor Network",
    causeCategory: "Environment & Climate",
    story: `When wildfire smoke or industrial pollution drifts into a neighborhood, families need better information than a countywide average reported hours later. Parents of children with asthma and older residents need to know what the air is doing on their own block.

**The problem:** Most neighborhoods don't have enough local sensors to make fast, practical decisions about school pickup, outdoor work, or opening a clean-air room.

**What we're funding:** This campaign will purchase and install a small network of community air monitors, plus signage and a shared dashboard that neighborhood groups can use during smoke events. Funds also cover masks and filter replacements for our first response kits.

**Why now:** Smoke season is getting longer, and communities are improvising every year. A local monitor network gives us actionable data before the next bad-air week hits.

This is climate resilience in a form people can use immediately: clearer information, faster response, and healthier choices.`,
    goalAmount: 14000,
    organizerId: "user-6",
    communityId: "comm-12",
    heroImageUrl: fundraisingHeroFromSeed("neighborhood-air-monitor-network"),
    updates: [
      { id: "up-8-1", date: "2024-05-09", text: "The first two installation sites were approved by neighborhood partners.", quote: "People make better health decisions when the data is local, visible, and easy to trust. That's what this network provides. — Priya Sharma, Volunteer Organizer" },
    ],
  },
  {
    id: "fund-9",
    slug: "restore-the-coastal-cleanup-trailer",
    title: "Restore the Coastal Cleanup Trailer",
    causeCategory: "Environment & Climate",
    story: `Our volunteer cleanup team has outgrown the borrowed bins and folding tables we've relied on for years. We now support multiple shoreline events each month, but our equipment transport setup keeps breaking down at the exact moment volunteers arrive ready to help.

**The bottleneck:** Without dependable storage and transport, we lose time setting up, leave useful supplies behind, and limit how many cleanup sites we can cover in one weekend.

**What we're funding:** This fundraiser will repair and outfit a dedicated cleanup trailer with grabbers, gloves, sorting bins, water stations, and signage. The trailer becomes shared infrastructure for every future Coastal Care Circle event.

**Why now:** Volunteer turnout is strong, but our logistics are lagging. A reliable trailer lets us capitalize on that energy instead of wasting it.

This is a practical campaign with a long tail: one piece of infrastructure that makes every cleanup day more effective.`,
    goalAmount: 10000,
    organizerId: "user-1",
    communityId: "comm-8",
    heroImageUrl: fundraisingHeroFromSeed("restore-the-coastal-cleanup-trailer"),
    updates: [
      { id: "up-9-1", date: "2024-05-12", text: "A local repair shop offered discounted labor once materials are covered.", quote: "We're close to turning an old trailer into something the whole coast volunteer network can rely on. — Janahan Selvakumaran, Campaign Organizer" },
    ],
  },
  {
    id: "fund-10",
    slug: "wildlife-rescue-transport-van",
    title: "Wildlife Rescue Transport Van",
    causeCategory: "Animals & Wildlife",
    story: `Wildlife responders in our area are piecing together emergency transport with personal cars, borrowed crates, and a lot of luck. That works for one rescue at a time, but it doesn't hold up during heat waves, storm events, or habitat disruptions when calls come in back to back.

**The need:** Animals in distress often need quick transport to a rehab partner, foster site, or veterinary clinic. Delays increase stress on both the animal and the volunteers trying to help.

**What we're funding:** We are raising money for a used transport van retrofit with secure crates, washable surfaces, climate control support, and basic rescue equipment. The van will serve multiple rescue partners and reduce response times across the region.

**Why now:** Call volume is rising while our current patchwork approach is hitting its limit. A shared rescue vehicle gives the network capacity it has never had before.

This campaign funds a tool that turns scattered goodwill into a real, dependable rescue system.`,
    goalAmount: 18000,
    organizerId: "user-8",
    communityId: "comm-11",
    heroImageUrl: fundraisingHeroFromSeed("wildlife-rescue-transport-van"),
    updates: [
      { id: "up-10-1", date: "2024-05-10", text: "Three rehab partners signed on to share the van once it is ready.", quote: "A dedicated transport setup changes everything for animal rescue. It means faster handoffs, safer trips, and less improvising in emergencies. — Maria Garcia, Community Organizer" },
    ],
  },
  {
    id: "fund-11",
    slug: "emergency-grocery-cards-for-neighbors",
    title: "Emergency Grocery Cards for Neighbors",
    causeCategory: "Community & Neighbors",
    story: `When a family hits a sudden crisis, the fastest way to help is often the simplest: put groceries within reach today instead of next week. Community Kitchen Network volunteers see this constantly with families waiting on paychecks, recovery paperwork, or a first round of assistance.

**The problem:** Traditional aid can take time, and food insecurity shows up immediately. Parents are left choosing which bill can slide and what meal gets skipped.

**What we're funding:** This campaign creates a rotating pool of emergency grocery cards paired with meal deliveries for households referred by local school staff, clinic partners, and neighborhood organizers. A small reserve also covers baby formula and dietary accommodation needs.

**Why now:** Need is rising faster than our pantry can stock. Flexible grocery support lets families buy what fits their home while our volunteer kitchen fills the gap.

This fundraiser is built for speed and dignity: fast help, local trust, and support that meets families where they are.`,
    goalAmount: 11000,
    organizerId: "user-5",
    communityId: "comm-10",
    heroImageUrl: fundraisingHeroFromSeed("emergency-grocery-cards-for-neighbors"),
    updates: [
      { id: "up-11-1", date: "2024-05-13", text: "Referral partnerships are in place with two schools and one community clinic.", quote: "Families don't need a complicated system when they are hungry. They need relief they can use the same day. — James Rivera, Community Health Worker" },
    ],
  },
];

// ——— Donations (48) — raw list; we derive fundraiser and user stats from this
const donationsRaw: Donation[] = [
  { id: "don-1", amount: 500, donorId: "user-6", fundraiserId: "fund-1", message: "Stay safe out there.", createdAt: "2024-05-02T10:00:00Z" },
  { id: "don-2", amount: 1000, donorId: "user-7", fundraiserId: "fund-1", message: "Thank you for doing this.", createdAt: "2024-05-02T11:30:00Z" },
  { id: "don-3", amount: 250, donorId: "user-2", fundraiserId: "fund-1", createdAt: "2024-05-03T09:00:00Z" },
  { id: "don-4", amount: 2500, donorId: "user-3", fundraiserId: "fund-1", message: "Proud to support.", createdAt: "2024-05-03T14:00:00Z" },
  { id: "don-5", amount: 750, donorId: "user-8", fundraiserId: "fund-1", createdAt: "2024-05-04T08:00:00Z" },
  { id: "don-6", amount: 500, donorId: "user-1", fundraiserId: "fund-2", message: "For our firefighters.", createdAt: "2024-05-01T12:00:00Z" },
  { id: "don-7", amount: 1000, donorId: "user-6", fundraiserId: "fund-2", createdAt: "2024-05-02T16:00:00Z" },
  { id: "don-8", amount: 2000, donorId: "user-2", fundraiserId: "fund-2", message: "Critical cause.", createdAt: "2024-05-03T10:00:00Z" },
  { id: "don-9", amount: 500, donorId: "user-7", fundraiserId: "fund-2", createdAt: "2024-05-04T09:00:00Z" },
  { id: "don-10", amount: 250, donorId: "user-4", fundraiserId: "fund-2", createdAt: "2024-05-05T11:00:00Z" },
  { id: "don-11", amount: 500, donorId: "user-1", fundraiserId: "fund-3", createdAt: "2024-05-02T08:00:00Z" },
  { id: "don-12", amount: 1000, donorId: "user-6", fundraiserId: "fund-3", message: "Every community needs this.", createdAt: "2024-05-02T14:00:00Z" },
  { id: "don-13", amount: 500, donorId: "user-3", fundraiserId: "fund-3", createdAt: "2024-05-03T09:00:00Z" },
  { id: "don-14", amount: 250, donorId: "user-7", fundraiserId: "fund-3", createdAt: "2024-05-04T10:00:00Z" },
  { id: "don-15", amount: 750, donorId: "user-8", fundraiserId: "fund-3", message: "Glad to help.", createdAt: "2024-05-05T15:00:00Z" },
  { id: "don-16", amount: 1000, donorId: "user-3", fundraiserId: "fund-4", message: "Sending love to the family.", createdAt: "2024-04-26T10:00:00Z" },
  { id: "don-17", amount: 500, donorId: "user-6", fundraiserId: "fund-4", createdAt: "2024-04-27T12:00:00Z" },
  { id: "don-18", amount: 2500, donorId: "user-5", fundraiserId: "fund-4", message: "We're with you.", createdAt: "2024-04-28T09:00:00Z" },
  { id: "don-19", amount: 500, donorId: "user-8", fundraiserId: "fund-4", createdAt: "2024-04-29T14:00:00Z" },
  { id: "don-20", amount: 1000, donorId: "user-1", fundraiserId: "fund-4", createdAt: "2024-04-30T11:00:00Z" },
  { id: "don-21", amount: 250, donorId: "user-2", fundraiserId: "fund-4", createdAt: "2024-05-01T08:00:00Z" },
  { id: "don-22", amount: 750, donorId: "user-7", fundraiserId: "fund-4", message: "Hope things get easier.", createdAt: "2024-05-02T16:00:00Z" },
  { id: "don-23", amount: 1000, donorId: "user-4", fundraiserId: "fund-5", message: "Paying it forward.", createdAt: "2024-05-01T10:00:00Z" },
  { id: "don-24", amount: 500, donorId: "user-6", fundraiserId: "fund-5", createdAt: "2024-05-01T14:00:00Z" },
  { id: "don-25", amount: 2000, donorId: "user-8", fundraiserId: "fund-5", message: "Important work.", createdAt: "2024-05-02T09:00:00Z" },
  { id: "don-26", amount: 500, donorId: "user-3", fundraiserId: "fund-5", createdAt: "2024-05-03T11:00:00Z" },
  { id: "don-27", amount: 1000, donorId: "user-1", fundraiserId: "fund-5", createdAt: "2024-05-04T10:00:00Z" },
  { id: "don-28", amount: 250, donorId: "user-2", fundraiserId: "fund-5", createdAt: "2024-05-05T12:00:00Z" },
  { id: "don-29", amount: 1500, donorId: "user-5", fundraiserId: "fund-5", message: "For everyone fighting.", createdAt: "2024-05-06T08:00:00Z" },
  { id: "don-30", amount: 500, donorId: "user-7", fundraiserId: "fund-5", createdAt: "2024-05-06T14:00:00Z" },
  { id: "don-31", amount: 1200, donorId: "user-2", fundraiserId: "fund-6", message: "Every student should start with the right tools.", createdAt: "2024-05-08T09:30:00Z" },
  { id: "don-32", amount: 800, donorId: "user-6", fundraiserId: "fund-6", createdAt: "2024-05-08T13:10:00Z" },
  { id: "don-33", amount: 600, donorId: "user-8", fundraiserId: "fund-6", createdAt: "2024-05-09T16:45:00Z" },
  { id: "don-34", amount: 1000, donorId: "user-7", fundraiserId: "fund-7", message: "Arts access changes lives.", createdAt: "2024-05-11T10:00:00Z" },
  { id: "don-35", amount: 500, donorId: "user-3", fundraiserId: "fund-7", createdAt: "2024-05-11T13:20:00Z" },
  { id: "don-36", amount: 750, donorId: "user-8", fundraiserId: "fund-7", createdAt: "2024-05-12T09:15:00Z" },
  { id: "don-37", amount: 1500, donorId: "user-2", fundraiserId: "fund-8", message: "Local air data matters.", createdAt: "2024-05-09T11:25:00Z" },
  { id: "don-38", amount: 900, donorId: "user-1", fundraiserId: "fund-8", createdAt: "2024-05-09T18:00:00Z" },
  { id: "don-39", amount: 700, donorId: "user-8", fundraiserId: "fund-8", createdAt: "2024-05-10T08:40:00Z" },
  { id: "don-40", amount: 1100, donorId: "user-5", fundraiserId: "fund-9", message: "This will help every cleanup day.", createdAt: "2024-05-12T12:00:00Z" },
  { id: "don-41", amount: 650, donorId: "user-6", fundraiserId: "fund-9", createdAt: "2024-05-12T15:35:00Z" },
  { id: "don-42", amount: 400, donorId: "user-8", fundraiserId: "fund-9", createdAt: "2024-05-13T09:55:00Z" },
  { id: "don-43", amount: 1300, donorId: "user-3", fundraiserId: "fund-10", message: "Shared rescue infrastructure is huge.", createdAt: "2024-05-10T14:20:00Z" },
  { id: "don-44", amount: 900, donorId: "user-5", fundraiserId: "fund-10", createdAt: "2024-05-11T08:50:00Z" },
  { id: "don-45", amount: 600, donorId: "user-1", fundraiserId: "fund-10", createdAt: "2024-05-11T17:05:00Z" },
  { id: "don-46", amount: 1000, donorId: "user-4", fundraiserId: "fund-11", message: "Fast support makes all the difference.", createdAt: "2024-05-13T10:30:00Z" },
  { id: "don-47", amount: 750, donorId: "user-6", fundraiserId: "fund-11", createdAt: "2024-05-13T13:45:00Z" },
  { id: "don-48", amount: 500, donorId: "user-7", fundraiserId: "fund-11", createdAt: "2024-05-14T09:10:00Z" },
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

// ——— Derive user donationIds, totalDonated, coverPhoto from donations/communities ———
const COVER_BY_COMMUNITY: Record<string, string> = {
  "comm-1": communityBanner.mutualAid,
  "comm-2": communityBanner.familyHome,
};

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
    const coverPhoto = u.communityIds[0] ? COVER_BY_COMMUNITY[u.communityIds[0]] ?? communityBanner.mutualAid : communityBanner.mutualAid;
    return {
      ...u,
      donationIds: stats.ids,
      totalDonated: stats.total,
      coverPhoto,
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
