import { z } from "zod";

export interface PropertyMediaItem {
  id: string;
  propertyId: string;
  type: "image" | "floor_plan" | "video_tour";
  url: string;
  sortOrder: number;
  altText: string;
}

export interface PropertyRecord {
  id: string;
  ownerId: string;
  agentId?: string;
  title: string;
  description: string;
  type: "apartment" | "villa" | "commercial" | "penthouse" | "plot";
  bhk: number;
  price: number;
  areaSqFt: number;
  locality: string;
  city: string;
  address: string;
  lat: number;
  lng: number;
  status: "available" | "under_offer" | "sold";
  verificationStatus: "verified" | "pending" | "rejected";
  reraId?: string;
  possessionDate: string;
  amenities: string[];
  media: PropertyMediaItem[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export const CreatePropertySchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  type: z.enum(["apartment", "villa", "commercial", "penthouse", "plot"]).default("apartment"),
  bhk: z.number().int().min(0, "BHK must be 0 or higher"),
  price: z.number().positive("Price must be greater than 0"),
  areaSqFt: z.number().positive("Area must be positive"),
  locality: z.string().min(2, "Locality is required"),
  city: z.string().default("Kolkata"),
  address: z.string().min(5, "Full address is required"),
  lat: z.number().optional().default(22.5726),
  lng: z.number().optional().default(88.3639),
  reraId: z.string().optional(),
  possessionDate: z.string().default("Ready to Move"),
  amenities: z.array(z.string()).default([]),
  images: z.array(z.string().url()).default([]),
  tags: z.array(z.string()).default([]),
});

export const UpdatePropertySchema = CreatePropertySchema.partial().extend({
  status: z.enum(["available", "under_offer", "sold"]).optional(),
  verificationStatus: z.enum(["verified", "pending", "rejected"]).optional(),
});

export const PropertySearchFilterSchema = z.object({
  query: z.string().optional(),
  locality: z.string().optional(),
  city: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  bhk: z.coerce.number().optional(),
  type: z.enum(["apartment", "villa", "commercial", "penthouse", "plot"]).optional(),
  status: z.enum(["available", "under_offer", "sold"]).optional(),
  verificationStatus: z.enum(["verified", "pending", "rejected"]).optional(),
  lat: z.coerce.number().optional(),
  lng: z.coerce.number().optional(),
  radiusKm: z.coerce.number().optional(),
  sortBy: z.enum(["price_asc", "price_desc", "newest", "area_desc", "distance"]).optional().default("newest"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
});

export type PropertySearchFilters = z.infer<typeof PropertySearchFilterSchema>;
