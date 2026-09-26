import { NextResponse } from "next/server";
import { visitService } from "@/lib/visits/service";
import { CancelVisitSchema } from "@/lib/visits/types";
import { getServerSession } from "@/lib/auth/session";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    const { id } = await context.params;
    const body = await req.json();
    const validated = CancelVisitSchema.parse(body);

    const updated = await visitService.updateStatus(id, "cancelled", session?.userId, validated.reason);
    if (!updated) {
      return NextResponse.json({ error: { code: "NOT_FOUND", message: "Visit not found" } }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      visit: updated,
      message: "Site visit cancelled successfully",
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: "VALIDATION_ERROR", message: error.errors?.[0]?.message || error.message } },
      { status: 400 }
    );
  }
}
