import { NextResponse } from "next/server";
import { revenueService } from "@/lib/revenue/service";
import { getServerSession } from "@/lib/auth/session";

export async function GET() {
  const session = await getServerSession();
  const agentId = session?.userId || "usr-agent-01";

  const transactions = await revenueService.findTransactions({ agentId });

  const totalEarned = transactions
    .filter(t => t.commissionStatus === "disbursed")
    .reduce((sum, t) => sum + t.agentPayout, 0);

  const pendingPayout = transactions
    .filter(t => t.commissionStatus === "approved" || t.commissionStatus === "pending_invoice")
    .reduce((sum, t) => sum + t.agentPayout, 0);

  return NextResponse.json({
    transactions,
    summary: {
      totalEarned,
      pendingPayout,
      dealsClosed: transactions.length,
    }
  }, { status: 200 });
}
