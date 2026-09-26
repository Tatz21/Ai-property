import { z } from "zod";

export interface ProjectAnalytics {
  totalViews: number;
  uniqueVisitors: number;
  shortlistCount: number;
  inquiriesCount: number;
  visitsScheduled: number;
  conversionRate: number;
}

export const CreateProjectSchema = z.object({
  name: z.string().min(3, "Project name must be at least 3 characters"),
  locality: z.string().min(2, "Locality is required"),
  city: z.string().default("Kolkata"),
  address: z.string().min(5, "Address is required"),
  projectStatus: z.enum(["pre_launch", "under_construction", "ready_to_move"]).default("under_construction"),
  reraRegistrationNumber: z.string().min(5, "Valid WB RERA number is required"),
  possessionDate: z.string().min(4, "Possession date is required"),
  totalTowers: z.number().int().positive().default(1),
  totalUnits: z.number().int().positive().default(50),
  amenities: z.array(z.string()).default([]),
});

export const CreateUnitSchema = z.object({
  projectId: z.string(),
  unitNumber: z.string().min(1, "Unit number is required"),
  tower: z.string().default("Tower 1"),
  floor: z.number().int().min(0),
  type: z.enum(["1BHK", "2BHK", "3BHK", "4BHK", "Penthouse", "Commercial"]),
  carpetAreaSqFt: z.number().positive(),
  superBuiltupSqFt: z.number().positive(),
  price: z.number().positive(),
  status: z.enum(["available", "blocked", "booked", "sold"]).default("available"),
});

export const UpdateUnitSchema = z.object({
  price: z.number().positive().optional(),
  status: z.enum(["available", "blocked", "booked", "sold"]).optional(),
});
