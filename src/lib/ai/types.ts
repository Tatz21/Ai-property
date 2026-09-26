import { z } from "zod";

export interface ExtractedRequirement {
  locality?: string;
  minPrice?: number;
  maxPrice?: number;
  bhk?: number;
  propertyType?: "apartment" | "villa" | "commercial" | "penthouse" | "plot";
  amenities?: string[];
  purpose?: "self_use" | "investment" | "rental_income";
  possession?: "ready" | "under_construction";
  confidenceScore: number;
}

export interface AIMessage {
  id: string;
  conversationId: string;
  senderType: "user" | "assistant" | "system";
  content: string;
  toolCalls?: {
    toolName: string;
    arguments: Record<string, any>;
    resultSummary: string;
  }[];
  matchedPropertyIds?: string[];
  extractedRequirement?: Partial<ExtractedRequirement>;
  createdAt: string;
}

export interface AIConversation {
  id: string;
  customerId: string;
  customerName?: string;
  status: "active" | "lead_generated" | "archived";
  requirements?: ExtractedRequirement;
  messages: AIMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface AIRunRecord {
  id: string;
  conversationId: string;
  model: string;
  promptVersion: string;
  latencyMs: number;
  tokensUsed: number;
  status: "success" | "fallback_applied" | "error";
  toolsInvoked: string[];
  createdAt: string;
}

export const AIChatRequestSchema = z.object({
  conversationId: z.string().optional(),
  message: z.string().min(1, "Message cannot be empty"),
  customerId: z.string().optional().default("usr-cust-01"),
  customerName: z.string().optional().default("Guest Buyer"),
});

export const RequirementExtractionSchema = z.object({
  locality: z.string().nullable().optional(),
  minPrice: z.number().nullable().optional(),
  maxPrice: z.number().nullable().optional(),
  bhk: z.number().nullable().optional(),
  propertyType: z.enum(["apartment", "villa", "commercial", "penthouse", "plot"]).nullable().optional(),
  amenities: z.array(z.string()).nullable().optional(),
  purpose: z.enum(["self_use", "investment", "rental_income"]).nullable().optional(),
  possession: z.enum(["ready", "under_construction"]).nullable().optional(),
});
