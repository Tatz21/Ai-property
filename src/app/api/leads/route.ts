import { NextResponse } from "next/server";
import { leadService } from "@/lib/leads/service";
import { CreateLeadSchema, LeadStatus, LeadIntent } from "@/lib/leads/types";
import { getServerSession } from "@/lib/auth/session";

export async function GET(req: Request) {
  const session = await getServerSession();
  const { searchParams } = new URL(req.url);

  const status = searchParams.get("status") as LeadStatus | undefined;
  const intent = searchParams.get("intent") as LeadIntent | undefined;
  let agentId = searchParams.get("agentId") || undefined;

  // If logged in as agent, scope to assigned leads unless admin
  if (session && session.role === "agent") {
    agentId = session.userId;
  }

  const leads = await leadService.findMany({ status, intent, agentId });

  return NextResponse.json({
    leads,
    count: leads.length,
  }, { status: 200 });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = CreateLeadSchema.parse(body);

    const newLead = await leadService.create(validated);

    return NextResponse.json({
      success: true,
      lead: newLead,
      message: "Lead created and routed to Kolkata specialist",
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: "VALIDATION_ERROR", message: error.errors?.[0]?.message || error.message } },
      { status: 400 }
    );
  }
}
