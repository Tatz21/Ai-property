import { z } from "zod";

export type TransactionStatus = "draft" | "agreement_signed" | "registration_completed" | "commission_invoiced" | "closed_disbursed" | "cancelled";
export type CommissionStatus = "pending_invoice" | "approved" | "disbursed" | "disputed";

export interface TransactionRecord {
  id: string;
  leadId: string;
  propertyId: string;
  propertyTitle: string;
  propertyLocality: string;
  agentId: string;
  agentName: string;
  customerId: string;
  customerName: string;
  dealValue: number; // in INR
  brokerageRatePercent: number; // e.g. 2.0%
  totalBrokerage: number; // dealValue * brokerageRatePercent
  agentSharePercent: number; // e.g. 60%
  agentPayout: number; // totalBrokerage * agentSharePercent
  platformShare: number; // totalBrokerage * (1 - agentSharePercent)
  status: TransactionStatus;
  commissionStatus: CommissionStatus;
  registryDate?: string;
  closedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RevenueSummary {
  totalPlatformGMV: number;
  totalBrokerageRevenue: number;
  totalAgentPayouts: number;
  pendingDisbursements: number;
  closedDealsCount: number;
}

export const CreateTransactionSchema = z.object({
  leadId: z.string().min(1, "Lead ID is required"),
  propertyId: z.string().min(1, "Property ID is required"),
  dealValue: z.number().positive("Deal value must be greater than 0"),
  brokerageRatePercent: z.number().min(0.5).max(5.0).default(2.0),
  agentSharePercent: z.number().min(30).max(90).default(60.0),
  registryDate: z.string().optional(),
});

export const UpdateTransactionStatusSchema = z.object({
  status: z.enum(["draft", "agreement_signed", "registration_completed", "commission_invoiced", "closed_disbursed", "cancelled"]).optional(),
  commissionStatus: z.enum(["pending_invoice", "approved", "disbursed", "disputed"]).optional(),
});
