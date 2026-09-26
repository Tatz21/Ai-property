import { NextResponse } from "next/server";
import { shortlistsDb } from "@/lib/db/shortlists";
import { propertyService } from "@/lib/properties/service";
import { getServerSession } from "@/lib/auth/session";
import { ShortlistToggleSchema } from "@/lib/matching/types";

export async function GET(req: Request) {
  const session = await getServerSession();
  const customerId = session?.userId || "usr-cust-01";

  const shortlistRecords = await shortlistsDb.getShortlistByCustomer(customerId);
  const properties = [];

  for (const item of shortlistRecords) {
    const prop = await propertyService.getById(item.propertyId);
    if (prop) {
      properties.push({
        ...prop,
        shortlistId: item.id,
        shortlistedAt: item.createdAt,
        notes: item.notes,
      });
    }
  }

  return NextResponse.json({
    shortlist: properties,
    count: properties.length,
  }, { status: 200 });
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    const customerId = session?.userId || "usr-cust-01";

    const body = await req.json();
    const validated = ShortlistToggleSchema.parse(body);

    const item = await shortlistsDb.addShortlist(customerId, validated.propertyId, validated.notes);

    return NextResponse.json({
      success: true,
      shortlist: item,
      message: "Property added to shortlist",
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: "VALIDATION_ERROR", message: error.errors?.[0]?.message || error.message } },
      { status: 400 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession();
    const customerId = session?.userId || "usr-cust-01";

    const { searchParams } = new URL(req.url);
    const propertyId = searchParams.get("propertyId");

    if (!propertyId) {
      return NextResponse.json(
        { error: { code: "BAD_REQUEST", message: "propertyId is required" } },
        { status: 400 }
      );
    }

    await shortlistsDb.removeShortlist(customerId, propertyId);

    return NextResponse.json({
      success: true,
      message: "Property removed from shortlist",
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: "ERROR", message: error.message } },
      { status: 400 }
    );
  }
}
