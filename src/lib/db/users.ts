import { UserRecord, BuyerProfile, AgentProfile, UserRole } from "@/lib/auth/types";

// Pre-seeded users for testing and local development
const SEED_USERS: UserRecord[] = [
  {
    id: "usr-admin-01",
    name: "System Admin (Kolkata Operations)",
    email: "admin@estateai.kolkata.in",
    phone: "+91 98300 00001",
    passwordHash: "admin123",
    role: "admin",
    status: "active",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "usr-agent-01",
    name: "Sanjay Bhattacharya",
    email: "sanjay.b@estateai.kolkata.in",
    phone: "+91 98301 22334",
    passwordHash: "agent123",
    role: "agent",
    status: "active",
    createdAt: "2026-01-05T00:00:00.000Z",
    updatedAt: "2026-01-05T00:00:00.000Z"
  },
  {
    id: "usr-cust-01",
    name: "Dr. Anirban Sengupta",
    email: "anirban.s@example.com",
    phone: "+91 98300 12345",
    passwordHash: "customer123",
    role: "customer",
    status: "active",
    createdAt: "2026-01-10T00:00:00.000Z",
    updatedAt: "2026-01-10T00:00:00.000Z"
  },
  {
    id: "usr-owner-01",
    name: "Debasish Roy",
    email: "debasish.roy@example.com",
    phone: "+91 98311 55443",
    passwordHash: "owner123",
    role: "owner",
    status: "active",
    createdAt: "2026-01-12T00:00:00.000Z",
    updatedAt: "2026-01-12T00:00:00.000Z"
  },
  {
    id: "usr-dev-01",
    name: "Bengal Shapoorji Realcon",
    email: "contact@shapoorji-bengal.com",
    phone: "+91 33 2288 9900",
    passwordHash: "developer123",
    role: "developer",
    status: "active",
    createdAt: "2026-01-15T00:00:00.000Z",
    updatedAt: "2026-01-15T00:00:00.000Z"
  }
];

const SEED_BUYER_PROFILES: Record<string, BuyerProfile> = {
  "usr-cust-01": {
    userId: "usr-cust-01",
    budgetMin: 8000000,
    budgetMax: 12000000,
    preferredLocalities: ["New Town Action Area II", "Salt Lake Sector V"],
    propertyTypes: ["apartment", "penthouse"],
    preferredBhk: [3, 4],
    purpose: "self_use",
    financingStatus: "pre_approved",
    notes: "Requires lake or park view, high-floor flat with ready possession.",
    updatedAt: "2026-01-10T00:00:00.000Z"
  }
};

const SEED_AGENT_PROFILES: Record<string, AgentProfile> = {
  "usr-agent-01": {
    userId: "usr-agent-01",
    serviceAreas: ["New Town Action Area I", "New Town Action Area II", "Rajarhat", "Salt Lake"],
    specialties: ["Luxury Apartments", "High-Rise Sky Villas", "Commercial IT Space"],
    experienceYears: 8,
    reraLicenseNumber: "WBRERA/A/KOL/2022/000145",
    availability: "active",
    activeListingsCount: 14,
    rating: 4.9,
    updatedAt: "2026-01-05T00:00:00.000Z"
  }
};

let usersStore: UserRecord[] = [...SEED_USERS];
let buyerProfilesStore: Record<string, BuyerProfile> = { ...SEED_BUYER_PROFILES };
let agentProfilesStore: Record<string, AgentProfile> = { ...SEED_AGENT_PROFILES };

export const usersDb = {
  findMany: async (role?: UserRole) => {
    if (role) return usersStore.filter(u => u.role === role);
    return usersStore;
  },
  findById: async (id: string) => {
    return usersStore.find(u => u.id === id) || null;
  },
  findByEmail: async (email: string) => {
    return usersStore.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  },
  findByPhoneOrEmail: async (identifier: string) => {
    const clean = identifier.trim().toLowerCase();
    return usersStore.find(u => u.email.toLowerCase() === clean || (u.phone && u.phone.includes(clean))) || null;
  },
  create: async (user: Omit<UserRecord, "id" | "createdAt" | "updatedAt">) => {
    const id = `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();
    const newUser: UserRecord = {
      ...user,
      id,
      createdAt: now,
      updatedAt: now
    };
    usersStore.push(newUser);

    // Initialize default profile based on role
    if (user.role === "customer") {
      buyerProfilesStore[id] = {
        userId: id,
        preferredLocalities: ["Kolkata"],
        propertyTypes: ["apartment"],
        preferredBhk: [2, 3],
        purpose: "self_use",
        financingStatus: "seeking_loan",
        updatedAt: now
      };
    } else if (user.role === "agent") {
      agentProfilesStore[id] = {
        userId: id,
        serviceAreas: ["New Town", "Salt Lake"],
        specialties: ["Residential"],
        experienceYears: 1,
        availability: "active",
        activeListingsCount: 0,
        rating: 5.0,
        updatedAt: now
      };
    }

    return newUser;
  },
  update: async (id: string, data: Partial<UserRecord>) => {
    const index = usersStore.findIndex(u => u.id === id);
    if (index === -1) return null;
    usersStore[index] = { ...usersStore[index], ...data, updatedAt: new Date().toISOString() };
    return usersStore[index];
  },
  getBuyerProfile: async (userId: string) => {
    return buyerProfilesStore[userId] || null;
  },
  updateBuyerProfile: async (userId: string, data: Partial<BuyerProfile>) => {
    const existing = buyerProfilesStore[userId] || {
      userId,
      preferredLocalities: [],
      propertyTypes: [],
      preferredBhk: [],
      purpose: "self_use",
      financingStatus: "seeking_loan",
      updatedAt: new Date().toISOString()
    };
    buyerProfilesStore[userId] = { ...existing, ...data, updatedAt: new Date().toISOString() };
    return buyerProfilesStore[userId];
  },
  getAgentProfile: async (userId: string) => {
    return agentProfilesStore[userId] || null;
  },
  updateAgentProfile: async (userId: string, data: Partial<AgentProfile>) => {
    const existing = agentProfilesStore[userId] || {
      userId,
      serviceAreas: [],
      specialties: [],
      experienceYears: 0,
      availability: "active",
      activeListingsCount: 0,
      rating: 5.0,
      updatedAt: new Date().toISOString()
    };
    agentProfilesStore[userId] = { ...existing, ...data, updatedAt: new Date().toISOString() };
    return agentProfilesStore[userId];
  }
};
