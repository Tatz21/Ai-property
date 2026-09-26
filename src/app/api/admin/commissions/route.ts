import { NextResponse } from "next/server";
import { revenueService } from "@/lib/revenue/service";
import { getServerSession } from "@/lib/auth/session";

export async function GET() {
  const session = await getServerSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: { code: "FORBIDDEN", message: "Admin privileges required" } }, { status: 403 });
  }

  const transactions = await revenueService.findTransactions();
  const summary = await revenueService.getRevenueSummary();

  return NextResponse.json({
    transactions,
    summary,
  }, { status: 200 });
}
