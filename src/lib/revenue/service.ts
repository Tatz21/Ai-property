import { TransactionRecord, TransactionStatus, CommissionStatus, RevenueSummary } from "./types";
import { propertyService } from "@/lib/properties/service";
import { leadService } from "@/lib/leads/service";
import { usersDb } from "@/lib/db/users";
import { db } from "@/lib/db";

const INITIAL_TRANSACTIONS: TransactionRecord[] = [
  {
    id: "txn-kol-901",
    leadId: "lead-kol-101",
    propertyId: "prop-kol-001",
    propertyTitle: "Luxury 3 BHK Lake-Facing Sky Villa",
    propertyLocality: "New Town Action Area II",
    agentId: "usr-agent-01",
    agentName: "Sanjay Bhattacharya",
    customerId: "usr-cust-01",
    customerName: "Dr. Anirban Sengupta",
    dealValue: 9500000,
    brokerageRatePercent: 2.0,
    totalBrokerage: 190000, // 2% of 95L
    agentSharePercent: 60.0,
    agentPayout: 114000, // 60% of 1.9L
    platformShare: 76000, // 40% of 1.9L
    status: "registration_completed",
    commissionStatus: "approved",
    registryDate: "2026-09-20",
    createdAt: "2026-01-10T12:00:00.000Z",
    updatedAt: "2026-01-10T14:00:00.000Z"
  }
];

let transactionsStore: TransactionRecord[] = [...INITIAL_TRANSACTIONS];

export const revenueService = {
  findTransactions: async (filters?: { agentId?: string; customerId?: string; status?: TransactionStatus }) => {
    let results = [...transactionsStore];
    if (filters?.agentId) results = results.filter(t => t.agentId === filters.agentId);
    if (filters?.customerId) results = results.filter(t => t.customerId === filters.customerId);
    if (filters?.status) results = results.filter(t => t.status === filters.status);
    return results;
  },

  findTransactionById: async (id: string) => {
    return transactionsStore.find(t => t.id === id) || null;
  },

  createTransaction: async (data: {
    leadId: string;
    propertyId: string;
    dealValue: number;
    brokerageRatePercent?: number;
    agentSharePercent?: number;
    registryDate?: string;
  }, actorId: string = "usr-agent-01") => {
    const property = await propertyService.getById(data.propertyId);
    if (!property) throw new Error("Property not found");

    const lead = await leadService.findById(data.leadId);
    if (!lead) throw new Error("Lead not found");

    const agent = (await usersDb.findById(lead.assignedAgentId || "usr-agent-01")) || {
      id: "usr-agent-01",
      name: "Sanjay Bhattacharya",
    };

    const brokerageRate = data.brokerageRatePercent || 2.0;
    const agentShare = data.agentSharePercent || 60.0;

    // Server-side strict financial calculations
    const totalBrokerage = Math.round((data.dealValue * brokerageRate) / 100);
    const agentPayout = Math.round((totalBrokerage * agentShare) / 100);
    const platformShare = totalBrokerage - agentPayout;

    const id = `txn-kol-${Date.now().toString().slice(-4)}`;
    const now = new Date().toISOString();

    const newTxn: TransactionRecord = {
      id,
      leadId: data.leadId,
      propertyId: data.propertyId,
      propertyTitle: property.title,
      propertyLocality: property.locality,
      agentId: agent.id,
      agentName: agent.name,
      customerId: lead.customerId,
      customerName: lead.customerName,
      dealValue: data.dealValue,
      brokerageRatePercent: brokerageRate,
      totalBrokerage,
      agentSharePercent: agentShare,
      agentPayout,
      platformShare,
      status: "agreement_signed",
      commissionStatus: "pending_invoice",
      registryDate: data.registryDate || now.split("T")[0],
      createdAt: now,
      updatedAt: now,
    };

    transactionsStore.unshift(newTxn);

    // Advance lead status to closed
    await leadService.update(lead.id, { status: "closed" }, actorId);

    // Record Immutable Audit Event
    await db.auditLogs.create({
      id: `audit-${Date.now()}`,
      actorId,
      action: "TRANSACTION_CREATED",
      entity: "transaction",
      entityId: id,
      metadata: { dealValue: data.dealValue, totalBrokerage, agentPayout, platformShare },
      timestamp: now,
    });

    return newTxn;
  },

  updateTransactionStatus: async (
    id: string,
    updates: { status?: TransactionStatus; commissionStatus?: CommissionStatus },
    actorId: string
  ) => {
    const idx = transactionsStore.findIndex(t => t.id === id);
    if (idx === -1) return null;

    const now = new Date().toISOString();
    transactionsStore[idx] = {
      ...transactionsStore[idx],
      ...updates,
      ...(updates.status === "closed_disbursed" ? { closedAt: now } : {}),
      updatedAt: now,
    };

    await db.auditLogs.create({
      id: `audit-${Date.now()}`,
      actorId,
      action: "TRANSACTION_STATUS_UPDATED",
      entity: "transaction",
      entityId: id,
      metadata: updates,
      timestamp: now,
    });

    return transactionsStore[idx];
  },

  getRevenueSummary: async (): Promise<RevenueSummary> => {
    const totalPlatformGMV = transactionsStore.reduce((sum, t) => sum + t.dealValue, 0);
    const totalBrokerageRevenue = transactionsStore.reduce((sum, t) => sum + t.totalBrokerage, 0);
    const totalAgentPayouts = transactionsStore
      .filter(t => t.commissionStatus === "disbursed")
      .reduce((sum, t) => sum + t.agentPayout, 0);
    const pendingDisbursements = transactionsStore
      .filter(t => t.commissionStatus === "approved" || t.commissionStatus === "pending_invoice")
      .reduce((sum, t) => sum + t.agentPayout, 0);

    return {
      totalPlatformGMV,
      totalBrokerageRevenue,
      totalAgentPayouts,
      pendingDisbursements,
      closedDealsCount: transactionsStore.length,
    };
  }
};
