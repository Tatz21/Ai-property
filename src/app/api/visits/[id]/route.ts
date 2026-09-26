import { NextResponse } from "next/server";
import { visitService } from "@/lib/visits/service";
import { UpdateVisitSchema } from "@/lib/visits/types";
import { getServerSession } from "@/lib/auth/session";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const visit = await visitService.findById(id);

  if (!visit) {
    return NextResponse.json({ error: { code: "NOT_FOUND", message: "Visit not found" } }, { status: 404 });
  }

  return NextResponse.json({ visit }, { status: 200 });
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    const { id } = await context.params;
    const body = await req.json();
    const validated = UpdateVisitSchema.parse(body);

    const visit = await visitService.findById(id);
    if (!visit) {
      return NextResponse.json({ error: { code: "NOT_FOUND", message: "Visit not found" } }, { status: 404 });
    }

    if (validated.status) {
      await visitService.updateStatus(id, validated.status, session?.userId, validated.cancellationReason);
    }

    const updated = await visitService.findById(id);

    return NextResponse.json({
      success: true,
      visit: updated,
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: "VALIDATION_ERROR", message: error.errors?.[0]?.message || error.message } },
      { status: 400 }
    );
  }
}
