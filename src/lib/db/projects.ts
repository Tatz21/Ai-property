export interface ProjectRecord {
  id: string;
  developerId: string;
  name: string;
  locality: string;
  city: string;
  address: string;
  projectStatus: "pre_launch" | "under_construction" | "ready_to_move";
  reraRegistrationNumber: string;
  possessionDate: string;
  totalTowers: number;
  totalUnits: number;
  amenities: string[];
  createdAt: string;
}

export interface UnitRecord {
  id: string;
  projectId: string;
  unitNumber: string;
  tower: string;
  floor: number;
  type: "1BHK" | "2BHK" | "3BHK" | "4BHK" | "Penthouse" | "Commercial";
  carpetAreaSqFt: number;
  superBuiltupSqFt: number;
  price: number;
  status: "available" | "blocked" | "booked" | "sold";
}

const SEED_PROJECTS: ProjectRecord[] = [
  {
    id: "proj-01",
    developerId: "usr-dev-01",
    name: "Shapoorji Pallonji Joyville Newtown",
    locality: "Action Area III, New Town",
    city: "Kolkata",
    address: "Action Area III, Major Arterial Road, New Town, Kolkata 700135",
    projectStatus: "under_construction",
    reraRegistrationNumber: "WBRERA/P/NOR/2023/000189",
    possessionDate: "2026-06-30",
    totalTowers: 6,
    totalUnits: 480,
    amenities: ["Grand Clubhouse", "Olympic Size Pool", "Tennis Court", "Co-working Lounge", "24/7 Security"],
    createdAt: "2026-01-15T00:00:00.000Z"
  }
];

const SEED_UNITS: UnitRecord[] = [
  {
    id: "unit-01-101",
    projectId: "proj-01",
    unitNumber: "T1-1002",
    tower: "Tower 1 - Emerald",
    floor: 10,
    type: "3BHK",
    carpetAreaSqFt: 1120,
    superBuiltupSqFt: 1540,
    price: 8850000,
    status: "available"
  },
  {
    id: "unit-01-102",
    projectId: "proj-01",
    unitNumber: "T1-1404",
    tower: "Tower 1 - Emerald",
    floor: 14,
    type: "2BHK",
    carpetAreaSqFt: 780,
    superBuiltupSqFt: 1080,
    price: 6150000,
    status: "available"
  },
  {
    id: "unit-01-103",
    projectId: "proj-01",
    unitNumber: "T2-0801",
    tower: "Tower 2 - Sapphire",
    floor: 8,
    type: "3BHK",
    carpetAreaSqFt: 1150,
    superBuiltupSqFt: 1580,
    price: 9200000,
    status: "booked"
  }
];

let projectsStore: ProjectRecord[] = [...SEED_PROJECTS];
let unitsStore: UnitRecord[] = [...SEED_UNITS];

export const projectsDb = {
  findProjects: async (developerId?: string) => {
    if (developerId) return projectsStore.filter(p => p.developerId === developerId);
    return projectsStore;
  },
  findProjectById: async (id: string) => {
    return projectsStore.find(p => p.id === id) || null;
  },
  findUnitsByProject: async (projectId: string) => {
    return unitsStore.filter(u => u.projectId === projectId);
  },
  findUnitById: async (id: string) => {
    return unitsStore.find(u => u.id === id) || null;
  },
  createProject: async (proj: Omit<ProjectRecord, "id" | "createdAt">) => {
    const id = `proj-${Date.now()}`;
    const newProj: ProjectRecord = {
      ...proj,
      id,
      createdAt: new Date().toISOString()
    };
    projectsStore.unshift(newProj);
    return newProj;
  },
  createUnit: async (unit: Omit<UnitRecord, "id">) => {
    const id = `unit-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;
    const newUnit: UnitRecord = { ...unit, id };
    unitsStore.push(newUnit);
    return newUnit;
  },
  updateUnit: async (id: string, data: Partial<UnitRecord>) => {
    const idx = unitsStore.findIndex(u => u.id === id);
    if (idx === -1) return null;
    unitsStore[idx] = { ...unitsStore[idx], ...data };
    return unitsStore[idx];
  },
  getAnalytics: async (developerId: string) => {
    const projects = projectsStore.filter(p => p.developerId === developerId);
    const projectIds = projects.map(p => p.id);
    const units = unitsStore.filter(u => projectIds.includes(u.projectId));

    const totalUnits = units.length;
    const availableUnits = units.filter(u => u.status === "available").length;
    const bookedUnits = units.filter(u => u.status === "booked").length;
    const soldUnits = units.filter(u => u.status === "sold").length;

    return {
      totalProjects: projects.length,
      totalUnits,
      availableUnits,
      bookedUnits,
      soldUnits,
      totalViews: 1420,
      uniqueVisitors: 890,
      shortlistCount: 68,
      inquiriesCount: 24,
      visitsScheduled: 11,
      conversionRate: 15.8,
    };
  }
};
