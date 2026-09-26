import { z } from "zod";

export type LeadIntent = "high" | "medium" | "low";
export type LeadStatus = "new" | "contacted" | "visit_scheduled" | "negotiation" | "closed" | "lost";

export interface CRMTask {
  id: string;
  leadId: string;
  title: string;
  dueDate: string;
  completed: boolean;
  type: "call" | "visit" | "followup" | "document";
  createdAt: string;
}

export interface CRMNote {
  id: string;
  leadId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
}

export interface LeadRecord {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  assignedAgentId?: string;
  source: string;
  intent: LeadIntent;
  score: number;
  status: LeadStatus;
  conversationId?: string;
  requirementsSummary?: string;
  preferredLocality?: string;
  budgetCap?: number;
  bhkPreference?: number;
  shortlistedPropertyIds: string[];
  tasks: CRMTask[];
  notes: CRMNote[];
  createdAt: string;
  updatedAt: string;
}

export const CreateLeadSchema = z.object({
  customerId: z.string().optional().default("usr-cust-01"),
  customerName: z.string().min(2, "Name is required"),
  customerEmail: z.string().email("Valid email is required"),
  customerPhone: z.string().min(10, "Valid 10-digit phone is required"),
  source: z.string().default("AI Conversational Agent"),
  conversationId: z.string().optional(),
  requirementsSummary: z.string().optional(),
  preferredLocality: z.string().optional(),
  budgetCap: z.number().optional(),
  bhkPreference: z.number().optional(),
  shortlistedPropertyIds: z.array(z.string()).default([]),
});

export const UpdateLeadSchema = z.object({
  status: z.enum(["new", "contacted", "visit_scheduled", "negotiation", "closed", "lost"]).optional(),
  assignedAgentId: z.string().optional(),
  score: z.number().min(0).max(100).optional(),
  intent: z.enum(["high", "medium", "low"]).optional(),
});

export const CreateCRMTaskSchema = z.object({
  title: z.string().min(3, "Task title is required"),
  dueDate: z.string(),
  type: z.enum(["call", "visit", "followup", "document"]).default("followup"),
});

export const CreateCRMNoteSchema = z.object({
  content: z.string().min(3, "Note content cannot be empty"),
});
