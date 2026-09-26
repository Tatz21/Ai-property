import { z } from "zod";

export interface MatchingWeights {
  localityWeight: number; // default 0.35
  budgetWeight: number;   // default 0.25
  bhkAreaWeight: number;  // default 0.20
  amenitiesWeight: number;// default 0.15
  verificationWeight: number; // default 0.05
}

export interface MatchScoreResult {
  propertyId: string;
  totalScore: number; // 0 to 100
  breakdown: {
    localityScore: number;
    budgetScore: number;
    bhkAreaScore: number;
    amenitiesScore: number;
    verificationScore: number;
  };
  reasons: string[];
  isHardFilterCompliant: boolean;
}

export interface ShortlistItem {
  id: string;
  customerId: string;
  propertyId: string;
  notes?: string;
  createdAt: string;
}

export interface SavedSearchItem {
  id: string;
  customerId: string;
  title: string;
  filters: {
    locality?: string;
    minPrice?: number;
    maxPrice?: number;
    bhk?: number;
    type?: string;
    verifiedOnly?: boolean;
  };
  alertFrequency: "instant" | "daily" | "weekly";
  isActive: boolean;
  createdAt: string;
}

export const CompareRequestSchema = z.object({
  propertyIds: z.array(z.string()).min(2, "Select at least 2 properties to compare").max(4, "Maximum 4 properties allowed for side-by-side comparison"),
});

export const ShortlistToggleSchema = z.object({
  propertyId: z.string(),
  notes: z.string().optional(),
});

export const SavedSearchSchema = z.object({
  title: z.string().min(2, "Title is required"),
  filters: z.object({
    locality: z.string().optional(),
    minPrice: z.number().optional(),
    maxPrice: z.number().optional(),
    bhk: z.number().optional(),
    type: z.string().optional(),
    verifiedOnly: z.boolean().optional(),
  }),
  alertFrequency: z.enum(["instant", "daily", "weekly"]).default("daily"),
});

export const MatchingWeightsSchema = z.object({
  localityWeight: z.number().min(0).max(1),
  budgetWeight: z.number().min(0).max(1),
  bhkAreaWeight: z.number().min(0).max(1),
  amenitiesWeight: z.number().min(0).max(1),
  verificationWeight: z.number().min(0).max(1),
});
