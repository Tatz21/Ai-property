import { NextResponse } from "next/server";
import { leadService } from "@/lib/leads/service";
import { getServerSession } from "@/lib/auth/session";
import { z } from "zod";

const AssignSchema = z.object({
  agentId: z.string(),
});

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    const { id } = await context.params;
    const body = await req.json();
    const validated = AssignSchema.parse(body);

    const updated = await leadService.update(id, { assignedAgentId: validated.agentId }, session?.userId);
    if (!updated) {
      return NextResponse.json({ error: { code: "NOT_FOUND", message: "Lead not found" } }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      lead: updated,
      message: "Lead successfully assigned to agent",
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: "VALIDATION_ERROR", message: error.message } },
      { status: 400 }
    );
  }
}
