import { describe, it, expect } from "vitest";
import { propertyService } from "./service";

describe("Property Inventory & Search Service Unit Tests", () => {
  it("should search and filter properties by locality and price range", async () => {
    const result = await propertyService.search({
      locality: "New Town",
      maxPrice: 15000000,
    });

    expect(result.properties.length).toBeGreaterThan(0);
    result.properties.forEach((p) => {
      expect(p.locality.toLowerCase()).toContain("new town");
      expect(p.price).toBeLessThanOrEqual(15000000);
    });
  });

  it("should filter properties by minimum BHK and verification status", async () => {
    const result = await propertyService.search({
      bhk: 3,
      verificationStatus: "verified",
    });

    expect(result.properties.length).toBeGreaterThan(0);
    result.properties.forEach((p) => {
      expect(p.bhk).toBeGreaterThanOrEqual(3);
      expect(p.verificationStatus).toBe("verified");
    });
  });

  it("should perform geospatial radius search using Haversine calculation", async () => {
    // Sector V coordinates
    const sectorVLat = 22.5868;
    const sectorVLng = 88.4178;

    const result = await propertyService.search({
      lat: sectorVLat,
      lng: sectorVLng,
      radiusKm: 5.0, // within 5 km radius
      sortBy: "distance",
    });

    expect(result.properties.length).toBeGreaterThan(0);
    result.properties.forEach((p) => {
      expect(p.distanceKm).toBeDefined();
      expect(p.distanceKm!).toBeLessThanOrEqual(5.0);
    });
  });

  it("should create a new property listing with audit log generation", async () => {
    const newProp = await propertyService.create({
      title: "Silver Spring Residency Tower 4",
      description: "Spacious 3 BHK apartment on EM Bypass with clubhouse and high floor views.",
      type: "apartment",
      bhk: 3,
      price: 13500000,
      areaSqFt: 1680,
      locality: "EM Bypass",
      city: "Kolkata",
      address: "EM Bypass, Near Science City, Kolkata 700046",
      lat: 22.5400,
      lng: 88.3980,
      possessionDate: "2027-03-31",
      amenities: ["Swimming Pool", "Gym", "24/7 Security", "Power Backup"],
      tags: ["em bypass", "luxury", "science city"],
      reraId: "WBRERA/P/KOL/2024/000987",
    }, "usr-owner-01");

    expect(newProp.id).toBeDefined();
    expect(newProp.verificationStatus).toBe("pending"); // new listings require moderation

    const verified = await propertyService.setVerification(newProp.id, "verified", "usr-admin-01", "Title deeds verified with WBRERA registry");
    expect(verified?.verificationStatus).toBe("verified");
  });
});
