import { LeadRecord, LeadIntent, LeadStatus, CRMTask, CRMNote } from "./types";
import { usersDb } from "@/lib/db/users";
import { db } from "@/lib/db";

const INITIAL_LEADS: LeadRecord[] = [
  {
    id: "lead-kol-101",
    customerId: "usr-cust-01",
    customerName: "Dr. Anirban Sengupta",
    customerEmail: "anirban.s@example.com",
    customerPhone: "+91 98300 12345",
    assignedAgentId: "usr-agent-01",
    source: "AI Conversational Agent",
    intent: "high",
    score: 94,
    status: "visit_scheduled",
    conversationId: "conv-demo-01",
    requirementsSummary: "Lake-facing 3 BHK near Eco Park New Town under ₹1.1 Cr with Italian marble & ready possession.",
    preferredLocality: "New Town Action Area II",
    budgetCap: 11000000,
    bhkPreference: 3,
    shortlistedPropertyIds: ["prop-kol-001"],
    tasks: [
      {
        id: "task-01",
        leadId: "lead-kol-101",
        title: "Site visit inspection at Eco Park Lake Villa",
        dueDate: "2026-10-02T11:00:00.000Z",
        completed: false,
        type: "visit",
        createdAt: "2026-01-10T10:05:00.000Z"
      }
    ],
    notes: [
      {
        id: "note-01",
        leadId: "lead-kol-101",
        authorId: "usr-agent-01",
        authorName: "Sanjay Bhattacharya",
        content: "Spoke with Dr. Sengupta. He is pre-approved with HDFC for ₹90L loan and self-financing the rest. High urgency to move by November.",
        createdAt: "2026-01-10T10:15:00.000Z"
      }
    ],
    createdAt: "2026-01-10T10:00:00.000Z",
    updatedAt: "2026-01-10T10:15:00.000Z"
  },
  {
    id: "lead-kol-102",
    customerId: "usr-cust-02",
    customerName: "Poulomi Chatterjee",
    customerEmail: "poulomi.c@example.com",
    customerPhone: "+91 98310 99887",
    assignedAgentId: "usr-agent-01",
    source: "Properties Search Portal",
    intent: "medium",
    score: 72,
    status: "contacted",
    requirementsSummary: "2 BHK apartment in Rajarhat / Chinar Park within 500m of metro.",
    preferredLocality: "Rajarhat Chinar Park",
    budgetCap: 5500000,
    bhkPreference: 2,
    shortlistedPropertyIds: ["prop-kol-002"],
    tasks: [
      {
        id: "task-02",
        leadId: "lead-kol-102",
        title: "Send floor plan brochure & RERA certificate copy",
        dueDate: "2026-09-28T16:00:00.000Z",
        completed: true,
        type: "document",
        createdAt: "2026-01-11T12:00:00.000Z"
      }
    ],
    notes: [
      {
        id: "note-02",
        leadId: "lead-kol-102",
        authorId: "usr-agent-01",
        authorName: "Sanjay Bhattacharya",
        content: "Customer reviewed 2 BHK near Chinar park. Waiting for bank loan sanction eligibility.",
        createdAt: "2026-01-11T14:00:00.000Z"
      }
    ],
    createdAt: "2026-01-11T11:30:00.000Z",
    updatedAt: "2026-01-11T14:00:00.000Z"
  }
];

let leadsStore: LeadRecord[] = [...INITIAL_LEADS];

// Calculate lead intent score based on attributes & engagement signals
export function calculateLeadScore(params: {
  hasPhone: boolean;
  hasBudget: boolean;
  hasLocality: boolean;
  hasConversation: boolean;
  shortlistCount: number;
  visitScheduled: boolean;
}): { score: number; intent: LeadIntent } {
  let score = 20; // baseline

  if (params.hasPhone) score += 20;
  if (params.hasBudget && params.hasLocality) score += 25;
  if (params.hasConversation) score += 15;
  if (params.shortlistCount > 0) score += Math.min(10, params.shortlistCount * 5);
  if (params.visitScheduled) score += 15;

  score = Math.min(100, score);

  let intent: LeadIntent = "low";
  if (score >= 75) intent = "high";
  else if (score >= 45) intent = "medium";

  return { score, intent };
}

// Territory routing engine to find the best eligible Kolkata agent
export async function routeLeadToAgent(locality?: string): Promise<string> {
  const agents = await usersDb.findMany("agent");
  if (agents.length === 0) return "usr-agent-01";

  if (locality) {
    for (const agent of agents) {
      const profile = await usersDb.getAgentProfile(agent.id);
      if (profile && profile.availability === "active") {
        const matchesArea = profile.serviceAreas.some(area =>
          area.toLowerCase().includes(locality.toLowerCase()) ||
          locality.toLowerCase().includes(area.toLowerCase())
        );
        if (matchesArea) return agent.id;
      }
    }
  }

  return agents[0].id;
}

export const leadService = {
  findMany: async (filters?: { status?: LeadStatus; intent?: LeadIntent; agentId?: string }) => {
    let results = [...leadsStore];
    if (filters?.status) results = results.filter(l => l.status === filters.status);
    if (filters?.intent) results = results.filter(l => l.intent === filters.intent);
    if (filters?.agentId) results = results.filter(l => l.assignedAgentId === filters.agentId);
    return results;
  },

  findById: async (id: string) => {
    return leadsStore.find(l => l.id === id) || null;
  },

  create: async (data: any) => {
    const id = `lead-kol-${Date.now().toString().slice(-4)}`;
    const now = new Date().toISOString();

    const { score, intent } = calculateLeadScore({
      hasPhone: !!data.customerPhone,
      hasBudget: !!data.budgetCap,
      hasLocality: !!data.preferredLocality,
      hasConversation: !!data.conversationId,
      shortlistCount: (data.shortlistedPropertyIds || []).length,
      visitScheduled: false,
    });

    const assignedAgentId = await routeLeadToAgent(data.preferredLocality);

    const newLead: LeadRecord = {
      id,
      customerId: data.customerId || "usr-cust-01",
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      assignedAgentId,
      source: data.source || "AI Conversational Agent",
      intent,
      score,
      status: "new",
      conversationId: data.conversationId,
      requirementsSummary: data.requirementsSummary,
      preferredLocality: data.preferredLocality,
      budgetCap: data.budgetCap,
      bhkPreference: data.bhkPreference,
      shortlistedPropertyIds: data.shortlistedPropertyIds || [],
      tasks: [
        {
          id: `task-${Date.now()}`,
          leadId: id,
          title: "Initial callback & qualification",
          dueDate: new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString(),
          completed: false,
          type: "call",
          createdAt: now,
        }
      ],
      notes: [],
      createdAt: now,
      updatedAt: now,
    };

    leadsStore.unshift(newLead);

    await db.auditLogs.create({
      id: `audit-${Date.now()}`,
      actorId: data.customerId || "system",
      action: "LEAD_CREATED",
      entity: "lead",
      entityId: id,
      metadata: { customerName: data.customerName, assignedAgentId, intent, score },
      timestamp: now,
    });

    return newLead;
  },

  update: async (id: string, data: Partial<LeadRecord>, actorId?: string) => {
    const idx = leadsStore.findIndex(l => l.id === id);
    if (idx === -1) return null;

    leadsStore[idx] = {
      ...leadsStore[idx],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    if (actorId) {
      await db.auditLogs.create({
        id: `audit-${Date.now()}`,
        actorId,
        action: "LEAD_UPDATED",
        entity: "lead",
        entityId: id,
        metadata: data,
        timestamp: new Date().toISOString(),
      });
    }

    return leadsStore[idx];
  },

  addTask: async (leadId: string, task: Omit<CRMTask, "id" | "leadId" | "completed" | "createdAt">) => {
    const lead = leadsStore.find(l => l.id === leadId);
    if (!lead) return null;

    const newTask: CRMTask = {
      ...task,
      id: `task-${Date.now()}`,
      leadId,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    lead.tasks.unshift(newTask);
    lead.updatedAt = new Date().toISOString();
    return newTask;
  },

  toggleTask: async (leadId: string, taskId: string) => {
    const lead = leadsStore.find(l => l.id === leadId);
    if (!lead) return null;

    const task = lead.tasks.find(t => t.id === taskId);
    if (!task) return null;

    task.completed = !task.completed;
    lead.updatedAt = new Date().toISOString();
    return task;
  },

  addNote: async (leadId: string, note: { authorId: string; authorName: string; content: string }) => {
    const lead = leadsStore.find(l => l.id === leadId);
    if (!lead) return null;

    const newNote: CRMNote = {
      id: `note-${Date.now()}`,
      leadId,
      authorId: note.authorId,
      authorName: note.authorName,
      content: note.content,
      createdAt: new Date().toISOString(),
    };

    lead.notes.unshift(newNote);
    lead.updatedAt = new Date().toISOString();
    return newNote;
  }
};
