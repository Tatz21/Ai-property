import { NextResponse } from "next/server";
import { leadService } from "@/lib/leads/service";
import { UpdateLeadSchema } from "@/lib/leads/types";
import { aiStore } from "@/lib/ai/store";
import { propertyService } from "@/lib/properties/service";
import { getServerSession } from "@/lib/auth/session";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const lead = await leadService.findById(id);

  if (!lead) {
    return NextResponse.json(
      { error: { code: "NOT_FOUND", message: "Lead not found" } },
      { status: 404 }
    );
  }

  // Fetch full AI conversation transcript if available
  let conversation = null;
  if (lead.conversationId) {
    conversation = await aiStore.getConversation(lead.conversationId);
  }

  // Fetch shortlisted properties
  const shortlistedProperties = [];
  for (const propId of lead.shortlistedPropertyIds) {
    const prop = await propertyService.getById(propId);
    if (prop) shortlistedProperties.push(prop);
  }

  return NextResponse.json({
    lead,
    conversation,
    shortlistedProperties,
  }, { status: 200 });
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    const { id } = await context.params;
    const body = await req.json();
    const validated = UpdateLeadSchema.parse(body);

    const updated = await leadService.update(id, validated, session?.userId);
    if (!updated) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Lead not found" } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      lead: updated,
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: "VALIDATION_ERROR", message: error.errors?.[0]?.message || error.message } },
      { status: 400 }
    );
  }
}
