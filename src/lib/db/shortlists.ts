import { ShortlistItem, SavedSearchItem } from "@/lib/matching/types";

let shortlistsStore: ShortlistItem[] = [
  {
    id: "short-01",
    customerId: "usr-cust-01",
    propertyId: "prop-kol-001",
    notes: "Lake-facing, shortlisted after AI recommendation",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
  },
  {
    id: "short-02",
    customerId: "usr-cust-01",
    propertyId: "prop-kol-002",
    notes: "Near metro station, good investment backup",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString()
  }
];

let savedSearchesStore: SavedSearchItem[] = [
  {
    id: "search-01",
    customerId: "usr-cust-01",
    title: "New Town Lake View 3 BHK under 1.2 Cr",
    filters: {
      locality: "New Town Action Area II",
      bhk: 3,
      maxPrice: 12000000,
      verifiedOnly: true
    },
    alertFrequency: "daily",
    isActive: true,
    createdAt: new Date().toISOString()
  }
];

export const shortlistsDb = {
  getShortlistByCustomer: async (customerId: string) => {
    return shortlistsStore.filter(s => s.customerId === customerId);
  },

  addShortlist: async (customerId: string, propertyId: string, notes?: string) => {
    const existing = shortlistsStore.find(s => s.customerId === customerId && s.propertyId === propertyId);
    if (existing) return existing;

    const newItem: ShortlistItem = {
      id: `short-${Date.now()}`,
      customerId,
      propertyId,
      notes,
      createdAt: new Date().toISOString()
    };
    shortlistsStore.unshift(newItem);
    return newItem;
  },

  removeShortlist: async (customerId: string, propertyId: string) => {
    const idx = shortlistsStore.findIndex(s => s.customerId === customerId && s.propertyId === propertyId);
    if (idx === -1) return false;
    shortlistsStore.splice(idx, 1);
    return true;
  },

  isShortlisted: async (customerId: string, propertyId: string) => {
    return shortlistsStore.some(s => s.customerId === customerId && s.propertyId === propertyId);
  },

  getSavedSearches: async (customerId: string) => {
    return savedSearchesStore.filter(s => s.customerId === customerId);
  },

  createSavedSearch: async (customerId: string, data: Omit<SavedSearchItem, "id" | "customerId" | "createdAt" | "isActive">) => {
    const newItem: SavedSearchItem = {
      ...data,
      id: `saved-${Date.now()}`,
      customerId,
      isActive: true,
      createdAt: new Date().toISOString()
    };
    savedSearchesStore.unshift(newItem);
    return newItem;
  },

  deleteSavedSearch: async (customerId: string, id: string) => {
    const idx = savedSearchesStore.findIndex(s => s.customerId === customerId && s.id === id);
    if (idx === -1) return false;
    savedSearchesStore.splice(idx, 1);
    return true;
  }
};
