import { NextResponse } from "next/server";
import { propertyService } from "@/lib/properties/service";
import { CreatePropertySchema, PropertySearchFilterSchema } from "@/lib/properties/types";
import { getServerSession } from "@/lib/auth/session";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const queryParams: Record<string, any> = {};

    searchParams.forEach((value, key) => {
      queryParams[key] = value;
    });

    const parsedFilters = PropertySearchFilterSchema.parse(queryParams);
    const results = await propertyService.search(parsedFilters);

    return NextResponse.json(results, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: "BAD_REQUEST", message: error.errors?.[0]?.message || error.message } },
      { status: 400 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "You must be signed in to add a property listing" } },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validated = CreatePropertySchema.parse(body);

    const newProperty = await propertyService.create(validated, session.userId);

    return NextResponse.json({
      success: true,
      property: newProperty,
      message: "Property created and submitted for verification",
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: "VALIDATION_ERROR", message: error.errors?.[0]?.message || error.message } },
      { status: 400 }
    );
  }
}
