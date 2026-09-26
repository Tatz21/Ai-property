import { NextResponse } from "next/server";
import { propertyService } from "@/lib/properties/service";
import { CompareRequestSchema } from "@/lib/matching/types";
import { PropertyRecord } from "@/lib/properties/types";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = CompareRequestSchema.parse(body);

    const properties: PropertyRecord[] = [];
    for (const id of validated.propertyIds) {
      const prop = await propertyService.getById(id);
      if (prop) {
        properties.push(prop);
      }
    }

    if (properties.length < 2) {
      return NextResponse.json(
        { error: { code: "NOT_ENOUGH_PROPERTIES", message: "Could not find at least 2 valid properties to compare" } },
        { status: 400 }
      );
    }

    // Build unique master list of amenities across compared properties
    const allAmenitiesSet = new Set<string>();
    properties.forEach(p => p.amenities.forEach(a => allAmenitiesSet.add(a)));
    const allAmenities = Array.from(allAmenitiesSet);

    // Compute comparative metrics
    const comparisonMatrix = {
      properties: properties.map(p => ({
        id: p.id,
        title: p.title,
        price: p.price,
        locality: p.locality,
        bhk: p.bhk,
        areaSqFt: p.areaSqFt,
        pricePerSqFt: Math.round(p.price / p.areaSqFt),
        possessionDate: p.possessionDate,
        verificationStatus: p.verificationStatus,
        reraId: p.reraId || "N/A",
        media: p.media[0]?.url || "",
        amenities: p.amenities,
      })),
      amenitiesComparison: allAmenities.map(amenity => ({
        amenity,
        availability: properties.map(p => ({
          propertyId: p.id,
          hasAmenity: p.amenities.includes(amenity),
        })),
      })),
      bestPricePerSqFt: properties.reduce((min, p) => (p.price / p.areaSqFt < min.price / min.areaSqFt ? p : min), properties[0]).id,
      largestArea: properties.reduce((max, p) => (p.areaSqFt > max.areaSqFt ? p : max), properties[0]).id,
    };

    return NextResponse.json({
      success: true,
      comparison: comparisonMatrix,
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: "VALIDATION_ERROR", message: error.errors?.[0]?.message || error.message } },
      { status: 400 }
    );
  }
}
