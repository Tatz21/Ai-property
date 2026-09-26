import { NextResponse } from "next/server";
import { visitService } from "@/lib/visits/service";
import { CreateVisitSchema, VisitStatus } from "@/lib/visits/types";
import { getServerSession } from "@/lib/auth/session";

export async function GET(req: Request) {
  const session = await getServerSession();
  const { searchParams } = new URL(req.url);

  const status = searchParams.get("status") as VisitStatus | undefined;
  let customerId = searchParams.get("customerId") || undefined;
  let agentId = searchParams.get("agentId") || undefined;

  if (session) {
    if (session.role === "customer") {
      customerId = session.userId;
    } else if (session.role === "agent") {
      agentId = session.userId;
    }
  }

  const visits = await visitService.findMany({ customerId, agentId, status });

  return NextResponse.json({
    visits,
    count: visits.length,
  }, { status: 200 });
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    const customerId = session?.userId || "usr-cust-01";

    const body = await req.json();
    const validated = CreateVisitSchema.parse(body);

    const visit = await visitService.create(validated, customerId);

    return NextResponse.json({
      success: true,
      visit,
      message: "Site visit successfully booked & assigned to local specialist",
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: "BOOKING_ERROR", message: error.errors?.[0]?.message || error.message } },
      { status: 400 }
    );
  }
}
