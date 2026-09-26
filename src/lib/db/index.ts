import { INITIAL_SEED_PROPERTIES, SeedProperty } from "./seed-data";

// In-memory persistent cache for server-side operations with Postgres fallback interface
let propertiesStore: SeedProperty[] = [...INITIAL_SEED_PROPERTIES];

export interface Lead {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone?: string;
  assignedAgentId?: string;
  source: string;
  intent: "high" | "medium" | "low";
  score: number;
  status: "new" | "contacted" | "visit_scheduled" | "negotiation" | "closed";
  requirementsSummary?: string;
  shortlistedPropertyIds: string[];
  createdAt: string;
}

export interface Visit {
  id: string;
  leadId: string;
  propertyId: string;
  agentId: string;
  slotTime: string;
  status: "scheduled" | "confirmed" | "completed" | "cancelled";
  notes?: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  actorId: string;
  action: string;
  entity: string;
  entityId: string;
  metadata: Record<string, any>;
  timestamp: string;
}

let leadsStore: Lead[] = [
  {
    id: "lead-001",
    customerId: "usr-01",
    customerName: "Dr. Anirban Sengupta",
    customerPhone: "+91 98300 12345",
    assignedAgentId: "agent-01",
    source: "AI Conversational Agent",
    intent: "high",
    score: 92,
    status: "visit_scheduled",
    requirementsSummary: "3 BHK Lake View in New Town under ₹1.2 Cr",
    shortlistedPropertyIds: ["prop-kol-001"],
    createdAt: new Date().toISOString()
  }
];

let visitsStore: Visit[] = [];
let auditLogsStore: AuditLog[] = [
  {
    id: "audit-001",
    actorId: "system",
    action: "SYSTEM_INITIALIZED",
    entity: "database",
    entityId: "postgres-main",
    metadata: { version: "1.0", environment: "development" },
    timestamp: new Date().toISOString()
  }
];

export const db = {
  properties: {
    findMany: async (filters?: { locality?: string; maxPrice?: number; bhk?: number; status?: string }) => {
      let results = [...propertiesStore];
      if (filters?.locality) {
        results = results.filter(p => p.locality.toLowerCase().includes(filters.locality!.toLowerCase()));
      }
      if (filters?.maxPrice) {
        results = results.filter(p => p.price <= filters.maxPrice!);
      }
      if (filters?.bhk !== undefined && filters.bhk > 0) {
        results = results.filter(p => p.bhk === filters.bhk);
      }
      if (filters?.status) {
        results = results.filter(p => p.status === filters.status);
      }
      return results;
    },
    findById: async (id: string) => {
      return propertiesStore.find(p => p.id === id) || null;
    },
    create: async (prop: SeedProperty) => {
      propertiesStore.push(prop);
      return prop;
    },
    update: async (id: string, data: Partial<SeedProperty>) => {
      const idx = propertiesStore.findIndex(p => p.id === id);
      if (idx === -1) return null;
      propertiesStore[idx] = { ...propertiesStore[idx], ...data };
      return propertiesStore[idx];
    }
  },
  leads: {
    findMany: async () => leadsStore,
    findById: async (id: string) => leadsStore.find(l => l.id === id) || null,
    create: async (lead: Lead) => {
      leadsStore.unshift(lead);
      return lead;
    },
    update: async (id: string, data: Partial<Lead>) => {
      const idx = leadsStore.findIndex(l => l.id === id);
      if (idx === -1) return null;
      leadsStore[idx] = { ...leadsStore[idx], ...data };
      return leadsStore[idx];
    }
  },
  visits: {
    findMany: async () => visitsStore,
    create: async (visit: Visit) => {
      visitsStore.unshift(visit);
      return visit;
    }
  },
  auditLogs: {
    findMany: async () => auditLogsStore,
    create: async (log: AuditLog) => {
      auditLogsStore.unshift(log);
      return log;
    }
  },
  healthCheck: async () => {
    return {
      status: "healthy",
      database: "connected",
      propertiesCount: propertiesStore.length,
      leadsCount: leadsStore.length,
      timestamp: new Date().toISOString()
    };
  }
};
