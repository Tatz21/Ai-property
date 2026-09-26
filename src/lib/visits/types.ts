import { z } from "zod";

export type VisitStatus = "scheduled" | "confirmed" | "completed" | "cancelled" | "no_show" | "rescheduled";
export type NotificationChannel = "email" | "sms" | "whatsapp" | "web_push";

export interface VisitRecord {
  id: string;
  leadId?: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  propertyId: string;
  propertyTitle: string;
  propertyLocality: string;
  propertyPrice: number;
  agentId: string;
  agentName: string;
  slotDate: string; // YYYY-MM-DD
  slotTime: string; // e.g. "11:00 AM"
  status: VisitStatus;
  cancellationReason?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationRecord {
  id: string;
  userId: string;
  channel: NotificationChannel;
  type: "visit_confirmation" | "visit_reminder" | "price_drop" | "lead_assigned" | "verification_update";
  title: string;
  body: string;
  status: "delivered" | "pending" | "failed";
  metadata?: Record<string, any>;
  sentAt?: string;
  createdAt: string;
}

export const CreateVisitSchema = z.object({
  propertyId: z.string().min(1, "Property ID is required"),
  slotDate: z.string().min(1, "Date is required"),
  slotTime: z.string().min(1, "Time slot is required"),
  customerName: z.string().min(2, "Name is required"),
  customerPhone: z.string().min(10, "10-digit phone is required"),
  customerEmail: z.string().email("Valid email is required"),
  notes: z.string().optional(),
});

export const UpdateVisitSchema = z.object({
  status: z.enum(["scheduled", "confirmed", "completed", "cancelled", "no_show", "rescheduled"]).optional(),
  slotDate: z.string().optional(),
  slotTime: z.string().optional(),
  notes: z.string().optional(),
  cancellationReason: z.string().optional(),
});

export const CancelVisitSchema = z.object({
  reason: z.string().min(3, "Cancellation reason is required"),
});
