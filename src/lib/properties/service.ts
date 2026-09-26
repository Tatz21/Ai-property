import { PropertyRecord, PropertyMediaItem, PropertySearchFilters, CreatePropertySchema } from "./types";
import { INITIAL_SEED_PROPERTIES } from "@/lib/db/seed-data";
import { db } from "@/lib/db";

// Transform initial seed properties to rich PropertyRecord format
const INITIAL_PROPERTIES: PropertyRecord[] = INITIAL_SEED_PROPERTIES.map((seed, idx) => ({
  id: seed.id,
  ownerId: "usr-owner-01",
  agentId: "usr-agent-01",
  title: seed.title,
  description: seed.description,
  type: seed.type,
  bhk: seed.bhk,
  price: seed.price,
  areaSqFt: seed.areaSqFt,
  locality: seed.locality,
  city: seed.city,
  address: seed.address,
  lat: seed.lat,
  lng: seed.lng,
  status: seed.status,
  verificationStatus: seed.verificationStatus,
  reraId: seed.reraId,
  possessionDate: seed.possessionDate,
  amenities: seed.amenities,
  tags: seed.tags,
  media: seed.images.map((url, imgIdx) => ({
    id: `med-${seed.id}-${imgIdx}`,
    propertyId: seed.id,
    type: "image",
    url,
    sortOrder: imgIdx,
    altText: `${seed.title} photo ${imgIdx + 1}`
  })),
  createdAt: new Date(Date.now() - idx * 86400000 * 3).toISOString(),
  updatedAt: new Date().toISOString()
}));

let propertyStore: PropertyRecord[] = [...INITIAL_PROPERTIES];

// Haversine distance calculator (in Kilometers)
function calculateGeoDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export const propertyService = {
  search: async (filters: Partial<PropertySearchFilters> = {}) => {
    let results = [...propertyStore];

    // Text search on title, description, locality or tags
    if (filters.query) {
      const q = filters.query.toLowerCase();
      results = results.filter(
        p => p.title.toLowerCase().includes(q) ||
             p.locality.toLowerCase().includes(q) ||
             p.description.toLowerCase().includes(q) ||
             p.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    // Locality filter
    if (filters.locality) {
      const loc = filters.locality.toLowerCase();
      results = results.filter(p => p.locality.toLowerCase().includes(loc));
    }

    // City filter
    if (filters.city) {
      results = results.filter(p => p.city.toLowerCase() === filters.city!.toLowerCase());
    }

    // Price range
    if (filters.minPrice !== undefined) {
      results = results.filter(p => p.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      results = results.filter(p => p.price <= filters.maxPrice!);
    }

    // BHK filter
    if (filters.bhk !== undefined) {
      results = results.filter(p => p.bhk === filters.bhk);
    }

    // Property Type
    if (filters.type) {
      results = results.filter(p => p.type === filters.type);
    }

    // Status filter
    if (filters.status) {
      results = results.filter(p => p.status === filters.status);
    }

    // Verification Status filter
    if (filters.verificationStatus) {
      results = results.filter(p => p.verificationStatus === filters.verificationStatus);
    }

    // PostGIS geo-radius simulation
    let resultsWithDistance = results.map(p => {
      let distanceKm: number | undefined;
      if (filters.lat !== undefined && filters.lng !== undefined) {
        distanceKm = calculateGeoDistanceKm(filters.lat, filters.lng, p.lat, p.lng);
      }
      return { ...p, distanceKm };
    });

    if (filters.lat !== undefined && filters.lng !== undefined && filters.radiusKm !== undefined) {
      resultsWithDistance = resultsWithDistance.filter(
        p => p.distanceKm !== undefined && p.distanceKm <= filters.radiusKm!
      );
    }

    // Sorting
    switch (filters.sortBy) {
      case "price_asc":
        resultsWithDistance.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        resultsWithDistance.sort((a, b) => b.price - a.price);
        break;
      case "area_desc":
        resultsWithDistance.sort((a, b) => b.areaSqFt - a.areaSqFt);
        break;
      case "distance":
        resultsWithDistance.sort((a, b) => (a.distanceKm || 9999) - (b.distanceKm || 9999));
        break;
      case "newest":
      default:
        resultsWithDistance.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    // Pagination
    const total = resultsWithDistance.length;
    const page = filters.page || 1;
    const limit = filters.limit || 12;
    const totalPages = Math.ceil(total / limit);
    const paginatedItems = resultsWithDistance.slice((page - 1) * limit, page * limit);

    return {
      properties: paginatedItems,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore: page < totalPages,
      }
    };
  },

  getById: async (id: string) => {
    return propertyStore.find(p => p.id === id) || null;
  },

  create: async (data: any, ownerId: string, agentId?: string) => {
    const id = `prop-kol-${Date.now().toString().slice(-4)}`;
    const now = new Date().toISOString();

    const media: PropertyMediaItem[] = (data.images || []).map((url: string, idx: number) => ({
      id: `med-${id}-${idx}`,
      propertyId: id,
      type: "image",
      url,
      sortOrder: idx,
      altText: `${data.title} image ${idx + 1}`
    }));

    const newProperty: PropertyRecord = {
      id,
      ownerId,
      agentId: agentId || "usr-agent-01",
      title: data.title,
      description: data.description,
      type: data.type,
      bhk: data.bhk,
      price: data.price,
      areaSqFt: data.areaSqFt,
      locality: data.locality,
      city: data.city || "Kolkata",
      address: data.address,
      lat: data.lat || 22.5726,
      lng: data.lng || 88.3639,
      status: "available",
      verificationStatus: "pending", // New listings start in moderation queue
      reraId: data.reraId,
      possessionDate: data.possessionDate || "Ready to Move",
      amenities: data.amenities || [],
      tags: data.tags || [],
      media,
      createdAt: now,
      updatedAt: now
    };

    propertyStore.unshift(newProperty);

    // Record audit event
    await db.auditLogs.create({
      id: `audit-${Date.now()}`,
      actorId: ownerId,
      action: "PROPERTY_CREATED",
      entity: "property",
      entityId: id,
      metadata: { title: data.title, price: data.price, locality: data.locality },
      timestamp: now
    });

    return newProperty;
  },

  update: async (id: string, data: Partial<PropertyRecord>, actorId?: string) => {
    const idx = propertyStore.findIndex(p => p.id === id);
    if (idx === -1) return null;

    const updated = {
      ...propertyStore[idx],
      ...data,
      updatedAt: new Date().toISOString()
    };
    propertyStore[idx] = updated;

    if (actorId) {
      await db.auditLogs.create({
        id: `audit-${Date.now()}`,
        actorId,
        action: "PROPERTY_UPDATED",
        entity: "property",
        entityId: id,
        metadata: data,
        timestamp: new Date().toISOString()
      });
    }

    return updated;
  },

  setVerification: async (id: string, verificationStatus: "verified" | "rejected" | "pending", actorId: string, notes?: string) => {
    const idx = propertyStore.findIndex(p => p.id === id);
    if (idx === -1) return null;

    propertyStore[idx].verificationStatus = verificationStatus;
    propertyStore[idx].updatedAt = new Date().toISOString();

    await db.auditLogs.create({
      id: `audit-${Date.now()}`,
      actorId,
      action: `PROPERTY_VERIFICATION_${verificationStatus.toUpperCase()}`,
      entity: "property",
      entityId: id,
      metadata: { notes },
      timestamp: new Date().toISOString()
    });

    return propertyStore[idx];
  },

  delete: async (id: string, actorId: string) => {
    const idx = propertyStore.findIndex(p => p.id === id);
    if (idx === -1) return false;

    propertyStore.splice(idx, 1);

    await db.auditLogs.create({
      id: `audit-${Date.now()}`,
      actorId,
      action: "PROPERTY_DELETED",
      entity: "property",
      entityId: id,
      metadata: {},
      timestamp: new Date().toISOString()
    });

    return true;
  }
};
