import { NextResponse } from "next/server";
import { AIChatRequestSchema } from "@/lib/ai/types";
import { aiEngine } from "@/lib/ai/engine";
import { aiStore } from "@/lib/ai/store";
import { getServerSession } from "@/lib/auth/session";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = AIChatRequestSchema.parse(body);

    const session = await getServerSession();
    const customerId = session?.userId || validated.customerId || "usr-cust-01";

    let conversationId = validated.conversationId;
    if (!conversationId) {
      const newConv = await aiStore.createConversation(customerId, validated.customerName);
      conversationId = newConv.id;
    }

    const result = await aiEngine.processChat(conversationId, validated.message, customerId);

    return NextResponse.json({
      success: true,
      conversationId: result.conversationId,
      message: result.message,
      extractedRequirement: result.extractedRequirement,
      matchedProperties: result.matchedProperties,
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: "AI_PROCESSING_ERROR", message: error.errors?.[0]?.message || error.message } },
      { status: 400 }
    );
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const conversationId = searchParams.get("conversationId");

  if (!conversationId) {
    return NextResponse.json(
      { error: { code: "BAD_REQUEST", message: "conversationId is required" } },
      { status: 400 }
    );
  }

  const conversation = await aiStore.getConversation(conversationId);
  if (!conversation) {
    return NextResponse.json(
      { error: { code: "NOT_FOUND", message: "Conversation not found" } },
      { status: 404 }
    );
  }

  return NextResponse.json({ conversation }, { status: 200 });
}
