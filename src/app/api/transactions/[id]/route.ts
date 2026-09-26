import { NextResponse } from "next/server";
import { revenueService } from "@/lib/revenue/service";
import { UpdateTransactionStatusSchema } from "@/lib/revenue/types";
import { getServerSession } from "@/lib/auth/session";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const transaction = await revenueService.findTransactionById(id);

  if (!transaction) {
    return NextResponse.json({ error: { code: "NOT_FOUND", message: "Transaction not found" } }, { status: 404 });
  }

  return NextResponse.json({ transaction }, { status: 200 });
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    const actorId = session?.userId || "usr-admin-01";
    const { id } = await context.params;
    const body = await req.json();
    const validated = UpdateTransactionStatusSchema.parse(body);

    const updated = await revenueService.updateTransactionStatus(id, validated, actorId);
    if (!updated) {
      return NextResponse.json({ error: { code: "NOT_FOUND", message: "Transaction not found" } }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      transaction: updated,
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: "VALIDATION_ERROR", message: error.errors?.[0]?.message || error.message } },
      { status: 400 }
    );
  }
}
