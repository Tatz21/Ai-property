import { z } from "zod";

export type UserRole = "customer" | "agent" | "owner" | "developer" | "admin";

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  phone?: string;
  passwordHash?: string;
  role: UserRole;
  status: "active" | "suspended" | "pending_verification";
  createdAt: string;
  updatedAt: string;
}

export interface BuyerProfile {
  userId: string;
  budgetMin?: number;
  budgetMax?: number;
  preferredLocalities: string[];
  propertyTypes: string[];
  preferredBhk: number[];
  purpose: "self_use" | "investment" | "rental_income";
  financingStatus: "pre_approved" | "seeking_loan" | "self_financed";
  notes?: string;
  updatedAt: string;
}

export interface AgentProfile {
  userId: string;
  serviceAreas: string[];
  specialties: string[];
  experienceYears: number;
  reraLicenseNumber?: string;
  availability: "active" | "busy" | "away";
  activeListingsCount: number;
  rating: number;
  updatedAt: string;
}

export const SignupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits").optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["customer", "agent", "owner", "developer"]).default("customer"),
  serviceAreas: z.array(z.string()).optional(),
});

export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const OTPRequestSchema = z.object({
  phoneOrEmail: z.string().min(3, "Phone or email is required"),
});

export const OTPVerifySchema = z.object({
  phoneOrEmail: z.string().min(3, "Phone or email is required"),
  otp: z.string().length(6, "OTP must be 6 digits"),
  role: z.enum(["customer", "agent", "owner", "developer"]).optional(),
  name: z.string().optional(),
});

export const UpdateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
  budgetMin: z.number().optional(),
  budgetMax: z.number().optional(),
  preferredLocalities: z.array(z.string()).optional(),
  preferredBhk: z.array(z.number()).optional(),
  purpose: z.enum(["self_use", "investment", "rental_income"]).optional(),
  financingStatus: z.enum(["pre_approved", "seeking_loan", "self_financed"]).optional(),
  serviceAreas: z.array(z.string()).optional(),
  specialties: z.array(z.string()).optional(),
  reraLicenseNumber: z.string().optional(),
});
