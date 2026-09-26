import { NextResponse } from "next/server";
import { leadService } from "@/lib/leads/service";
import { CreateCRMNoteSchema } from "@/lib/leads/types";
import { getServerSession } from "@/lib/auth/session";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    const { id } = await context.params;
    const body = await req.json();
    const validated = CreateCRMNoteSchema.parse(body);

    const note = await leadService.addNote(id, {
      authorId: session?.userId || "usr-agent-01",
      authorName: session?.name || "Assigned Specialist",
      content: validated.content,
    });

    if (!note) {
      return NextResponse.json({ error: { code: "NOT_FOUND", message: "Lead not found" } }, { status: 404 });
    }

    return NextResponse.json({ success: true, note }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: "VALIDATION_ERROR", message: error.errors?.[0]?.message || error.message } },
      { status: 400 }
    );
  }
}
