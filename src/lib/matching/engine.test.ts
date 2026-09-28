import { describe, it, expect, beforeEach } from "vitest";
import { matchingEngine } from "./engine";
import { PropertyRecord } from "@/lib/properties/types";

describe("Matching Engine Unit Tests", () => {
  const mockProperty: PropertyRecord = {
    id: "prop-test-01",
    ownerId: "usr-owner-01",
    title: "EcoSpace Luxury Heights",
    description: "3 BHK premium flat in New Town Action Area II",
    type: "apartment",
    bhk: 3,
    price: 8500000, // 85 Lakh
    areaSqFt: 1450,
    locality: "New Town",
    city: "Kolkata",
    address: "Action Area II, New Town, Kolkata 700156",
    lat: 22.5868,
    lng: 88.4178,
    status: "available",
    verificationStatus: "verified",
    reraId: "WBRERA/P/NOR/2023/000123",
    possessionDate: "2026-12-31",
    amenities: ["Swimming Pool", "Gymnasium", "Power Backup", "Clubhouse", "24/7 Security"],
    tags: ["luxury", "new town", "rera verified"],
    media: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  beforeEach(() => {
    // Reset weights before each test
    matchingEngine.setWeights({
      localityWeight: 0.35,
      budgetWeight: 0.25,
      bhkAreaWeight: 0.20,
      amenitiesWeight: 0.15,
      verificationWeight: 0.05,
    });
  });

  it("should calculate high match score (>85) for an exact match in locality, budget, and BHK", () => {
    const criteria = {
      locality: "New Town",
      maxPrice: 9000000,
      bhk: 3,
      requiredAmenities: ["Swimming Pool", "Gymnasium"],
    };

    const result = matchingEngine.calculateMatch(mockProperty, criteria);

    expect(result.totalScore).toBeGreaterThanOrEqual(85);
    expect(result.isHardFilterCompliant).toBe(true);
    expect(result.breakdown.localityScore).toBe(100);
    expect(result.breakdown.bhkAreaScore).toBe(100);
    expect(result.breakdown.verificationScore).toBe(100);
    expect(result.reasons.length).toBeGreaterThan(0);
  });

  it("should heavily penalize properties exceeding budget significantly and fail hard filter", () => {
    const criteria = {
      locality: "New Town",
      maxPrice: 6000000, // Budget 60L vs 85L price
      bhk: 3,
      hardFilterOnly: true,
    };

    const result = matchingEngine.calculateMatch(mockProperty, criteria);

    expect(result.isHardFilterCompliant).toBe(false);
    expect(result.breakdown.budgetScore).toBeLessThan(50);
  });

  it("should rank multiple properties accurately according to match score", () => {
    const cheapProperty: PropertyRecord = {
      ...mockProperty,
      id: "prop-test-02",
      locality: "Rajarhat",
      price: 5500000,
      bhk: 2,
    };

    const results = matchingEngine.rankProperties(
      [mockProperty, cheapProperty],
      { locality: "New Town", maxPrice: 9000000, bhk: 3 }
    );

    expect(results.length).toBe(2);
    expect(results[0].property.id).toBe(mockProperty.id);
    expect(results[0].match.totalScore).toBeGreaterThan(results[1].match.totalScore);
  });

  it("should correctly update and read active matching weights", () => {
    matchingEngine.setWeights({ localityWeight: 0.50, budgetWeight: 0.10 });
    const weights = matchingEngine.getWeights();

    expect(weights.localityWeight).toBe(0.50);
    expect(weights.budgetWeight).toBe(0.10);
  });
});
