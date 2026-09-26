import { NextResponse } from "next/server";
import { propertyService } from "@/lib/properties/service";
import { z } from "zod";

const MatchRequestSchema = z.object({
  locality: z.string().optional(),
  maxPrice: z.number().optional(),
  minPrice: z.number().optional(),
  bhk: z.number().optional(),
  type: z.enum(["apartment", "villa", "commercial", "penthouse", "plot"]).optional(),
  amenities: z.array(z.string()).optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = MatchRequestSchema.parse(body);

    const searchResults = await propertyService.search({
      locality: validated.locality,
      maxPrice: validated.maxPrice,
      minPrice: validated.minPrice,
      bhk: validated.bhk,
      type: validated.type,
      limit: 10,
    });

    return NextResponse.json({
      success: true,
      matches: searchResults.properties,
      count: searchResults.properties.length,
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: "VALIDATION_ERROR", message: error.message } },
      { status: 400 }
    );
  }
}
