import { NextResponse } from "next/server";
import { revenueService } from "@/lib/revenue/service";
import { CreateTransactionSchema, TransactionStatus } from "@/lib/revenue/types";
import { getServerSession } from "@/lib/auth/session";

export async function GET(req: Request) {
  const session = await getServerSession();
  const { searchParams } = new URL(req.url);

  const status = searchParams.get("status") as TransactionStatus | undefined;
  let agentId = searchParams.get("agentId") || undefined;

  if (session && session.role === "agent") {
    agentId = session.userId;
  }

  const transactions = await revenueService.findTransactions({ agentId, status });

  return NextResponse.json({
    transactions,
    count: transactions.length,
  }, { status: 200 });
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    const actorId = session?.userId || "usr-agent-01";

    const body = await req.json();
    const validated = CreateTransactionSchema.parse(body);

    const transaction = await revenueService.createTransaction(validated, actorId);

    return NextResponse.json({
      success: true,
      transaction,
      message: "Transaction created and commission record generated",
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: "TRANSACTION_ERROR", message: error.errors?.[0]?.message || error.message } },
      { status: 400 }
    );
  }
}
