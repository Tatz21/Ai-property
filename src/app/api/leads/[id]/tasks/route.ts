import { NextResponse } from "next/server";
import { leadService } from "@/lib/leads/service";
import { CreateCRMTaskSchema } from "@/lib/leads/types";
import { z } from "zod";

const ToggleTaskSchema = z.object({
  taskId: z.string(),
});

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const validated = CreateCRMTaskSchema.parse(body);

    const task = await leadService.addTask(id, validated);
    if (!task) {
      return NextResponse.json({ error: { code: "NOT_FOUND", message: "Lead not found" } }, { status: 404 });
    }

    return NextResponse.json({ success: true, task }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: "VALIDATION_ERROR", message: error.errors?.[0]?.message || error.message } },
      { status: 400 }
    );
  }
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const validated = ToggleTaskSchema.parse(body);

    const task = await leadService.toggleTask(id, validated.taskId);
    if (!task) {
      return NextResponse.json({ error: { code: "NOT_FOUND", message: "Task or lead not found" } }, { status: 404 });
    }

    return NextResponse.json({ success: true, task }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: "VALIDATION_ERROR", message: error.message } },
      { status: 400 }
    );
  }
}
