import { NextResponse } from "next/server";
import { leadService } from "@/lib/leads/service";
import { getServerSession } from "@/lib/auth/session";
import { z } from "zod";

const AdminLeadUpdateSchema = z.object({
  leadId: z.string(),
  assignedAgentId: z.string().optional(),
  status: z.enum(["new", "contacted", "visit_scheduled", "negotiation", "closed", "lost"]).optional(),
});

export async function GET() {
  const session = await getServerSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json(
      { error: { code: "FORBIDDEN", message: "Admin privileges required" } },
      { status: 403 }
    );
  }

  const leads = await leadService.findMany();
  return NextResponse.json({ leads }, { status: 200 });
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json(
        { error: { code: "FORBIDDEN", message: "Admin privileges required" } },
        { status: 403 }
      );
    }

    const body = await req.json();
    const validated = AdminLeadUpdateSchema.parse(body);

    const updated = await leadService.update(validated.leadId, {
      ...(validated.assignedAgentId ? { assignedAgentId: validated.assignedAgentId } : {}),
      ...(validated.status ? { status: validated.status } : {}),
    }, session.userId);

    return NextResponse.json({ success: true, lead: updated }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: "VALIDATION_ERROR", message: error.message } },
      { status: 400 }
    );
  }
}
