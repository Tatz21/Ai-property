import { MatchingWeights, MatchScoreResult } from "./types";
import { PropertyRecord } from "@/lib/properties/types";
import { formatINR } from "@/lib/utils";

let activeWeights: MatchingWeights = {
  localityWeight: 0.35,
  budgetWeight: 0.25,
  bhkAreaWeight: 0.20,
  amenitiesWeight: 0.15,
  verificationWeight: 0.05,
};

export interface MatchingCriteria {
  locality?: string;
  minPrice?: number;
  maxPrice?: number;
  bhk?: number;
  requiredAmenities?: string[];
  purpose?: string;
  hardFilterOnly?: boolean;
}

export const matchingEngine = {
  getWeights: () => ({ ...activeWeights }),

  setWeights: (newWeights: Partial<MatchingWeights>) => {
    activeWeights = { ...activeWeights, ...newWeights };
    return activeWeights;
  },

  calculateMatch: (property: PropertyRecord, criteria: MatchingCriteria, weights = activeWeights): MatchScoreResult => {
    const reasons: string[] = [];
    let isHardFilterCompliant = true;

    // 1. Locality Score
    let localityScore = 50; // baseline for same city
    if (criteria.locality) {
      if (property.locality.toLowerCase() === criteria.locality.toLowerCase()) {
        localityScore = 100;
        reasons.push(`Direct match in requested locality: ${property.locality}`);
      } else if (property.locality.toLowerCase().includes(criteria.locality.toLowerCase()) || criteria.locality.toLowerCase().includes(property.locality.toLowerCase())) {
        localityScore = 85;
        reasons.push(`Located in primary sub-market: ${property.locality}`);
      } else {
        localityScore = 30;
      }
    } else {
      localityScore = 80;
    }

    // 2. Budget Score & Hard Filter
    let budgetScore = 80;
    if (criteria.maxPrice) {
      if (property.price <= criteria.maxPrice) {
        const savingsRatio = (criteria.maxPrice - property.price) / criteria.maxPrice;
        budgetScore = Math.min(100, Math.round(85 + savingsRatio * 15));
        reasons.push(`Within budget (${formatINR(property.price)} vs max ${formatINR(criteria.maxPrice)})`);
      } else {
        // Exceeds max price
        const excessRatio = (property.price - criteria.maxPrice) / criteria.maxPrice;
        if (excessRatio > 0.20) {
          isHardFilterCompliant = false;
          budgetScore = 0;
        } else {
          budgetScore = Math.max(20, Math.round(70 - excessRatio * 200));
          reasons.push(`Slightly above target budget by ${(excessRatio * 100).toFixed(0)}%`);
        }
      }
    }

    if (criteria.minPrice && property.price < criteria.minPrice) {
      budgetScore = Math.max(30, budgetScore - 30);
    }

    // 3. BHK & Area Score
    let bhkAreaScore = 70;
    if (criteria.bhk !== undefined && criteria.bhk > 0) {
      if (property.bhk === criteria.bhk) {
        bhkAreaScore = 100;
        reasons.push(`Exact ${property.bhk} BHK configuration (${property.areaSqFt} sq.ft)`);
      } else if (property.bhk === criteria.bhk + 1) {
        bhkAreaScore = 75;
        reasons.push(`Spacious ${property.bhk} BHK alternative with extra room`);
      } else {
        bhkAreaScore = 30;
        if (criteria.hardFilterOnly) isHardFilterCompliant = false;
      }
    }

    // 4. Amenities Overlap Score
    let amenitiesScore = 60;
    if (criteria.requiredAmenities && criteria.requiredAmenities.length > 0) {
      const matchCount = criteria.requiredAmenities.filter(reqAmenity =>
        property.amenities.some(a => a.toLowerCase().includes(reqAmenity.toLowerCase()))
      ).length;
      amenitiesScore = Math.round((matchCount / criteria.requiredAmenities.length) * 100);
      if (matchCount > 0) {
        reasons.push(`Includes ${matchCount} requested amenities (${property.amenities.slice(0, 2).join(", ")})`);
      }
    }

    // 5. Verification & RERA Trust Score
    let verificationScore = 50;
    if (property.verificationStatus === "verified") {
      verificationScore = 100;
      if (property.reraId) {
        reasons.push(`100% West Bengal RERA Verified (${property.reraId})`);
      } else {
        reasons.push("Platform Verified Listing with inspected title documents");
      }
    } else {
      verificationScore = 30;
    }

    // Weighted composite score calculation
    const totalScore = Math.round(
      localityScore * weights.localityWeight +
      budgetScore * weights.budgetWeight +
      bhkAreaScore * weights.bhkAreaWeight +
      amenitiesScore * weights.amenitiesWeight +
      verificationScore * weights.verificationWeight
    );

    return {
      propertyId: property.id,
      totalScore: Math.min(100, Math.max(0, totalScore)),
      breakdown: {
        localityScore,
        budgetScore,
        bhkAreaScore,
        amenitiesScore,
        verificationScore,
      },
      reasons,
      isHardFilterCompliant,
    };
  },

  rankProperties: (properties: PropertyRecord[], criteria: MatchingCriteria, weights = activeWeights) => {
    return properties
      .map(p => ({
        property: p,
        match: matchingEngine.calculateMatch(p, criteria, weights),
      }))
      .filter(item => !criteria.hardFilterOnly || item.match.isHardFilterCompliant)
      .sort((a, b) => b.match.totalScore - a.match.totalScore);
  }
};
