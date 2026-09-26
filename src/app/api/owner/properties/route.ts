import { NextResponse } from "next/server";
import { propertyService } from "@/lib/properties/service";
import { visitService } from "@/lib/visits/service";
import { getServerSession } from "@/lib/auth/session";

export async function GET() {
  const session = await getServerSession();
  const ownerId = session?.userId || "usr-owner-01";

  const searchResults = await propertyService.search({ limit: 50 });
  const ownerProperties = searchResults.properties.filter(p => p.ownerId === ownerId);

  const visits = await visitService.findMany();
  const ownerPropertyIds = ownerProperties.map(p => p.id);
  const relevantVisits = visits.filter(v => ownerPropertyIds.includes(v.propertyId));

  return NextResponse.json({
    properties: ownerProperties,
    visits: relevantVisits,
    count: ownerProperties.length,
  }, { status: 200 });
}
