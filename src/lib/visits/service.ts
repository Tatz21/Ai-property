import { VisitRecord, VisitStatus, CreateVisitSchema } from "./types";
import { propertyService } from "@/lib/properties/service";
import { leadService } from "@/lib/leads/service";
import { notificationService } from "@/lib/notifications/service";
import { usersDb } from "@/lib/db/users";
import { db } from "@/lib/db";
import { formatINR } from "@/lib/utils";

const INITIAL_VISITS: VisitRecord[] = [
  {
    id: "visit-kol-001",
    leadId: "lead-kol-101",
    customerId: "usr-cust-01",
    customerName: "Dr. Anirban Sengupta",
    customerPhone: "+91 98300 12345",
    customerEmail: "anirban.s@example.com",
    propertyId: "prop-kol-001",
    propertyTitle: "Luxury 3 BHK Lake-Facing Sky Villa",
    propertyLocality: "New Town Action Area II",
    propertyPrice: 9500000,
    agentId: "usr-agent-01",
    agentName: "Sanjay Bhattacharya",
    slotDate: "2026-10-02",
    slotTime: "11:00 AM",
    status: "confirmed",
    notes: "Customer interested in high-floor units with Eco Park view. Needs parking near elevator.",
    createdAt: "2026-01-10T10:05:00.000Z",
    updatedAt: "2026-01-10T10:10:00.000Z"
  }
];

let visitsStore: VisitRecord[] = [...INITIAL_VISITS];

export const visitService = {
  findMany: async (filters?: { customerId?: string; agentId?: string; propertyId?: string; status?: VisitStatus }) => {
    let results = [...visitsStore];
    if (filters?.customerId) results = results.filter(v => v.customerId === filters.customerId);
    if (filters?.agentId) results = results.filter(v => v.agentId === filters.agentId);
    if (filters?.propertyId) results = results.filter(v => v.propertyId === filters.propertyId);
    if (filters?.status) results = results.filter(v => v.status === filters.status);
    return results;
  },

  findById: async (id: string) => {
    return visitsStore.find(v => v.id === id) || null;
  },

  create: async (data: any, customerId: string = "usr-cust-01") => {
    // 1. Re-validate live property availability (Rule: Unavailable properties cannot be booked for visits)
    const property = await propertyService.getById(data.propertyId);
    if (!property) {
      throw new Error("Property not found in verified database");
    }

    if (property.status !== "available") {
      throw new Error(`This property is currently ${property.status} and cannot accept new site visit bookings.`);
    }

    // 2. Resolve assigned agent
    const agent = (await usersDb.findById(property.agentId || "usr-agent-01")) || {
      id: "usr-agent-01",
      name: "Sanjay Bhattacharya",
      phone: "+91 98301 22334",
    };

    const id = `visit-kol-${Date.now().toString().slice(-4)}`;
    const now = new Date().toISOString();

    // 3. Create or attach CRM Lead
    const lead = await leadService.create({
      customerId,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      source: "Property Detail Visit Booking",
      preferredLocality: property.locality,
      budgetCap: property.price,
      bhkPreference: property.bhk,
      requirementsSummary: `Scheduled visit for ${property.title} on ${data.slotDate} at ${data.slotTime}`,
      shortlistedPropertyIds: [property.id],
    });

    const newVisit: VisitRecord = {
      id,
      leadId: lead.id,
      customerId,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail,
      propertyId: property.id,
      propertyTitle: property.title,
      propertyLocality: property.locality,
      propertyPrice: property.price,
      agentId: agent.id,
      agentName: agent.name,
      slotDate: data.slotDate,
      slotTime: data.slotTime,
      status: "scheduled",
      notes: data.notes,
      createdAt: now,
      updatedAt: now,
    };

    visitsStore.unshift(newVisit);

    // 4. Dispatch Multi-Channel Notifications
    // Customer WhatsApp Notification
    await notificationService.dispatch({
      userId: customerId,
      channel: "whatsapp",
      type: "visit_confirmation",
      title: `Site Inspection Scheduled - ${property.title}`,
      body: `Hello ${data.customerName}, your visit request for ${property.title} (${property.locality}) is confirmed for ${data.slotDate} at ${data.slotTime}. Local specialist ${agent.name} (${(agent as any).phone || "+91 98301 22334"}) will host you.`,
      metadata: { visitId: id, propertyId: property.id },
    });

    // Agent SMS Notification
    await notificationService.dispatch({
      userId: agent.id,
      channel: "sms",
      type: "visit_confirmation",
      title: "New Site Inspection Scheduled",
      body: `New booking: ${data.customerName} (${data.customerPhone}) booked inspection for ${property.title} on ${data.slotDate} at ${data.slotTime}.`,
      metadata: { visitId: id, leadId: lead.id },
    });

    // 5. Record Audit Event
    await db.auditLogs.create({
      id: `audit-${Date.now()}`,
      actorId: customerId,
      action: "VISIT_BOOKED",
      entity: "visit",
      entityId: id,
      metadata: { propertyId: property.id, slotDate: data.slotDate, slotTime: data.slotTime, agentId: agent.id },
      timestamp: now,
    });

    return newVisit;
  },

  updateStatus: async (id: string, status: VisitStatus, actorId?: string, cancellationReason?: string) => {
    const idx = visitsStore.findIndex(v => v.id === id);
    if (idx === -1) return null;

    visitsStore[idx].status = status;
    if (cancellationReason) {
      visitsStore[idx].cancellationReason = cancellationReason;
    }
    visitsStore[idx].updatedAt = new Date().toISOString();

    if (actorId) {
      await db.auditLogs.create({
        id: `audit-${Date.now()}`,
        actorId,
        action: `VISIT_STATUS_${status.toUpperCase()}`,
        entity: "visit",
        entityId: id,
        metadata: { status, cancellationReason },
        timestamp: new Date().toISOString(),
      });
    }

    return visitsStore[idx];
  }
};
