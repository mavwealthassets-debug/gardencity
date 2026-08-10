import type { Buyer, Plot, PlotFacing } from "@/types";

// Deterministic pseudo-random generator so mock data is stable across reloads.
function mulberry32(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rng = mulberry32(20250115);

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const FIRST_NAMES = [
  "Amit", "Neha", "Vikram", "Pooja", "Rohit", "Sneha", "Arjun", "Kavita", "Manish", "Ritika",
  "Sandeep", "Anjali", "Rakesh", "Divya", "Vikas", "Sunita", "Ajay", "Meera", "Deepak", "Shalini",
  "Gaurav", "Priyanka", "Nikhil", "Swati", "Rahul", "Anita", "Suresh", "Kirti", "Varun", "Alok",
  "Nitin", "Preeti", "Sanjay", "Ruchi", "Karan", "Isha", "Yogesh", "Rekha", "Mohit", "Simran",
];
const LAST_NAMES = [
  "Sharma", "Verma", "Gupta", "Singh", "Patel", "Mehta", "Kapoor", "Desai", "Nair", "Agarwal",
  "Yadav", "Chauhan", "Malhotra", "Reddy", "Iyer", "Joshi", "Rao", "Bhatia", "Saxena", "Tiwari",
];
const CITIES = [
  "Gurugram, Haryana", "New Delhi", "Patna, Bihar", "Lucknow, UP", "Noida, UP", "Jaipur, Rajasthan",
  "Faridabad, Haryana", "Meerut, UP", "Agra, UP", "Chandigarh",
];
const SOURCES: Buyer["source"][] = ["Website", "Referral", "Walk-in", "Broker", "Advertisement"];
const RM_IDS = ["rm-sandeep", "rm-priya", "rm-neha", "rm-ankit"];
const EXECUTIVES = ["Neha Sharma", "Sandeep Singh", "Saurabh Agarwal", "Ritika Taneja", "Manish Nair"];
const FACINGS: PlotFacing[] = ["North", "South", "East", "West", "North-East", "North-West", "South-East", "South-West"];

function nameFor(i: number) {
  const first = FIRST_NAMES[i % FIRST_NAMES.length];
  const last = LAST_NAMES[(i * 3 + 5) % LAST_NAMES.length];
  return `${first} ${last}`;
}

function phoneFor(i: number) {
  const base = 9000000000 + ((i * 7919) % 999999999);
  return `+91 ${String(base).slice(0, 5)} ${String(base).slice(5, 10)}`;
}

// --- Blocks & size categories -----------------------------------------------------------

interface BlockDef { block: string; start: number; end: number }
const BLOCKS: BlockDef[] = [
  { block: "A", start: 1, end: 20 },
  { block: "B", start: 21, end: 50 },
  { block: "C", start: 51, end: 70 },
  { block: "D", start: 71, end: 90 },
  { block: "E", start: 91, end: 101 },
];
function blockFor(n: number): string {
  return BLOCKS.find((b) => n >= b.start && n <= b.end)?.block ?? "A";
}

interface SizeCat { label: string; min: number; max: number; pricePerSqYd: number }
const SIZE_CATS: SizeCat[] = [
  { label: "170 - 200 sq yd", min: 170, max: 200, pricePerSqYd: 17500 },
  { label: "200 - 250 sq yd", min: 200, max: 250, pricePerSqYd: 19500 },
  { label: "300 - 500 sq yd", min: 300, max: 500, pricePerSqYd: 22500 },
];
const sizeAssignment = shuffle([
  ...Array(36).fill(0),
  ...Array(41).fill(1),
  ...Array(24).fill(2),
]);

// Status distribution: 41 available, 11 booked, 43 sold, 6 reserved = 101
const statusAssignment = shuffle<Plot["status"]>([
  ...Array(41).fill("available"),
  ...Array(11).fill("booked"),
  ...Array(43).fill("sold"),
  ...Array(6).fill("reserved"),
]);

// --- Hero buyers (rich CRM narratives, reused across features) -------------------------

export const HERO_PLOT_NOS = {
  rahul: "GCN-047",
  rohit: "GCN-045",
  priya: "GCN-078",
  amit: "GCN-012",
  neha: "GCN-073",
  vikram: "GCN-021",
} as const;

export const heroBuyers: Buyer[] = [
  {
    id: "buyer-rahul",
    name: "Rahul Kumar",
    phone: "+91 98765 43210",
    email: "rahul.kumar@email.com",
    city: "Patna, Bihar",
    status: "Active",
    purpose: "Investment",
    source: "Website",
    assignedRmId: "rm-sandeep",
    buyerSince: "2025-01-14",
    kycStatus: "Verified",
    registrationStatus: "In Progress",
    plotId: HERO_PLOT_NOS.rahul,
    notes: "Looking for long-term investment opportunity in a fast-developing residential township.",
    nextFollowUp: { date: "2026-08-20", note: "Follow up on pending payment and offer possession timeline.", assignedTo: "Sandeep Singh" },
  },
  {
    id: "buyer-rohit",
    name: "Rohit Sharma",
    phone: "+91 98765 11223",
    email: "rohit.sharma@email.com",
    city: "Gurugram, Haryana",
    status: "Active",
    purpose: "Self Use",
    source: "Referral",
    assignedRmId: "rm-priya",
    buyerSince: "2024-11-02",
    kycStatus: "Verified",
    registrationStatus: "Completed",
    plotId: HERO_PLOT_NOS.rohit,
    notes: "Wants possession before his daughter's wedding in late 2026.",
    nextFollowUp: { date: "2026-08-18", note: "Share final registration receipt.", assignedTo: "Priya Singh" },
  },
  {
    id: "buyer-priya",
    name: "Priya Sharma",
    phone: "+91 98765 43333",
    email: "priya.sharma@email.com",
    city: "Lucknow, UP",
    status: "Active",
    purpose: "Self Use",
    source: "Walk-in",
    assignedRmId: "rm-sandeep",
    buyerSince: "2025-05-30",
    kycStatus: "Pending",
    registrationStatus: "Pending",
    plotId: HERO_PLOT_NOS.priya,
    notes: "First-time buyer, needs guidance on the registration process.",
    nextFollowUp: { date: "2026-08-14", note: "Collect pending bank statement and ITR.", assignedTo: "Sandeep Singh" },
  },
  {
    id: "buyer-amit",
    name: "Amit Verma",
    phone: "+91 98765 12345",
    email: "amit.verma@email.com",
    city: "New Delhi",
    status: "Active",
    purpose: "Investment",
    source: "Broker",
    assignedRmId: "rm-neha",
    buyerSince: "2025-02-20",
    kycStatus: "Verified",
    registrationStatus: "In Progress",
    plotId: HERO_PLOT_NOS.amit,
    notes: "Referred two friends already; highly engaged buyer.",
    nextFollowUp: { date: "2026-08-22", note: "Discuss referral bonus payout.", assignedTo: "Neha Sharma" },
  },
  {
    id: "buyer-neha",
    name: "Neha Gupta",
    phone: "+91 98123 45678",
    email: "neha.gupta@email.com",
    city: "Noida, UP",
    status: "Lead",
    purpose: "Investment",
    source: "Website",
    assignedRmId: "rm-neha",
    buyerSince: "2026-05-30",
    kycStatus: "Pending",
    registrationStatus: "Pending",
    plotId: HERO_PLOT_NOS.neha,
    notes: "Booking created recently, awaiting first payment confirmation.",
    nextFollowUp: { date: "2026-08-16", note: "Confirm booking amount payment.", assignedTo: "Neha Sharma" },
  },
  {
    id: "buyer-vikram",
    name: "Vikram Desai",
    phone: "+91 99887 66554",
    email: "vikram.desai@email.com",
    city: "Jaipur, Rajasthan",
    status: "Active",
    purpose: "Self Use",
    source: "Referral",
    assignedRmId: "rm-priya",
    buyerSince: "2025-03-10",
    kycStatus: "Verified",
    registrationStatus: "Completed",
    plotId: HERO_PLOT_NOS.vikram,
    notes: "Purchased jointly with spouse Pooja Desai.",
    nextFollowUp: { date: "2026-08-25", note: "Share festive season greetings and site photos.", assignedTo: "Priya Singh" },
  },
];

// --- Plot generation ---------------------------------------------------------------------

function buildPlot(n: number): Plot {
  const plotNo = `GCN-${String(n).padStart(3, "0")}`;
  const block = blockFor(n);
  const cat = SIZE_CATS[sizeAssignment[n - 1]];
  const areaSqYd = cat.min + ((n * 13) % (cat.max - cat.min + 1));
  const widthFt = Math.round(Math.sqrt((areaSqYd * 9) / 1.5));
  const depthFt = Math.round((areaSqYd * 9) / widthFt);
  const facing = FACINGS[n % FACINGS.length];
  const roadWidthFt = [24, 30, 33, 40][n % 4];
  const isCorner = n % 7 === 0;
  const isParkFacing = n % 9 === 0;
  let status = statusAssignment[n - 1];

  const heroEntry = Object.entries(HERO_PLOT_NOS).find(([, no]) => no === plotNo);
  if (heroEntry) {
    status = heroEntry[0] === "neha" ? "booked" : "sold";
  }

  const basePricePerSqYd = cat.pricePerSqYd;
  const basePrice = Math.round((areaSqYd * basePricePerSqYd) / 1000) * 1000;
  const discount = status === "available" ? 0 : Math.round((basePrice * (2 + (n % 5))) / 100 / 1000) * 1000;
  const finalPrice = basePrice - discount;

  const plot: Plot = {
    id: plotNo,
    plotNo,
    projectId: "proj-gcn",
    block,
    widthFt,
    depthFt,
    areaSqYd,
    category: isCorner ? "Corner" : cat.label,
    facing,
    roadWidthFt,
    isCorner,
    isParkFacing,
    status,
    basePricePerSqYd,
    basePrice,
    discount,
    finalPrice,
    assignedExecutive: status === "available" ? undefined : EXECUTIVES[n % EXECUTIVES.length],
  };

  if (heroEntry) {
    applyHeroOverrides(plot, heroEntry[0] as keyof typeof HERO_PLOT_NOS);
  } else if (status === "sold" || status === "booked") {
    plot.buyerId = `buyer-gen-${n}`;
    const paidPct = status === "sold" ? 0.55 + (n % 5) * 0.09 : 0.15 + (n % 4) * 0.05;
    plot.paidAmount = Math.round((finalPrice * Math.min(paidPct, 1)) / 1000) * 1000;
    plot.balanceAmount = finalPrice - plot.paidAmount;
    plot.bookingDate = `2025-${String(1 + (n % 12)).padStart(2, "0")}-${String(1 + (n % 27)).padStart(2, "0")}`;
  }

  return plot;
}

function applyHeroOverrides(plot: Plot, key: keyof typeof HERO_PLOT_NOS) {
  const overrides: Record<keyof typeof HERO_PLOT_NOS, Partial<Plot> & { buyerId: string }> = {
    rahul: {
      buyerId: "buyer-rahul", block: "B", areaSqYd: 200, category: "200 - 250 sq yd", facing: "East",
      roadWidthFt: 30, isCorner: true, isParkFacing: false, basePrice: 3900000, discount: 40000,
      finalPrice: 4350000, paidAmount: 3500000, balanceAmount: 850000, bookingDate: "2025-01-14",
      assignedExecutive: "Sandeep Singh",
    },
    rohit: {
      buyerId: "buyer-rohit", block: "A", areaSqYd: 200, category: "200 - 250 sq yd", facing: "North",
      finalPrice: 1850000, paidAmount: 1850000, balanceAmount: 0, bookingDate: "2024-11-02",
      assignedExecutive: "Priya Singh",
    },
    priya: {
      buyerId: "buyer-priya", block: "B", areaSqYd: 250, category: "200 - 250 sq yd", facing: "North-East",
      finalPrice: 5000000, paidAmount: 200000, balanceAmount: 4800000, bookingDate: "2025-05-30",
      assignedExecutive: "Sandeep Singh",
    },
    amit: {
      buyerId: "buyer-amit", block: "A", areaSqYd: 180, category: "170 - 200 sq yd", facing: "West",
      finalPrice: 3200000, paidAmount: 2350000, balanceAmount: 850000, bookingDate: "2025-02-20",
      assignedExecutive: "Neha Sharma",
    },
    neha: {
      buyerId: "buyer-neha", block: "B", areaSqYd: 200, category: "200 - 250 sq yd", facing: "South",
      finalPrice: 3800000, paidAmount: 400000, balanceAmount: 3400000, bookingDate: "2026-05-30",
      assignedExecutive: "Neha Sharma",
    },
    vikram: {
      buyerId: "buyer-vikram", block: "A", areaSqYd: 300, category: "Corner", facing: "South-West",
      isCorner: true, finalPrice: 6600000, paidAmount: 6600000, balanceAmount: 0, bookingDate: "2025-03-10",
      assignedExecutive: "Priya Singh",
    },
  };
  Object.assign(plot, overrides[key]);
}

export const plots: Plot[] = Array.from({ length: 101 }, (_, i) => buildPlot(i + 1));

// --- Generated fill-in buyers for non-hero sold/booked plots ----------------------------

const generatedBuyers: Buyer[] = plots
  .filter((p) => p.buyerId?.startsWith("buyer-gen-"))
  .map((p, idx) => {
    const n = Number(p.buyerId!.split("-")[2]);
    const rmId = RM_IDS[idx % RM_IDS.length];
    return {
      id: p.buyerId!,
      name: nameFor(n),
      phone: phoneFor(n),
      email: `${nameFor(n).toLowerCase().replace(" ", ".")}@email.com`,
      city: CITIES[n % CITIES.length],
      status: p.status === "sold" ? "Active" : "Active",
      purpose: n % 2 === 0 ? "Investment" : "Self Use",
      source: SOURCES[n % SOURCES.length],
      assignedRmId: rmId,
      buyerSince: p.bookingDate ?? "2025-06-01",
      kycStatus: n % 5 === 0 ? "Pending" : "Verified",
      registrationStatus: p.status === "sold" ? (n % 4 === 0 ? "In Progress" : "Completed") : "Pending",
      plotId: p.plotNo,
      notes: "Standard onboarding in progress. No special remarks recorded yet.",
    } satisfies Buyer;
  });

export const buyers: Buyer[] = [...heroBuyers, ...generatedBuyers];

export function getBuyerById(id: string): Buyer | undefined {
  return buyers.find((b) => b.id === id);
}
export function getPlotByNo(plotNo: string): Plot | undefined {
  return plots.find((p) => p.plotNo === plotNo);
}
export function getPlotsForBuyer(buyerId: string): Plot[] {
  return plots.filter((p) => p.buyerId === buyerId);
}
