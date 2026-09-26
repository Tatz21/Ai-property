import { NextResponse } from "next/server";
import { extractRequirementsFromText } from "@/lib/ai/engine";
import { z } from "zod";

const ExtractRequestSchema = z.object({
  text: z.string().min(1, "Text is required"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = ExtractRequestSchema.parse(body);

    const extracted = extractRequirementsFromText(validated.text);

    return NextResponse.json({
      success: true,
      extracted,
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: "VALIDATION_ERROR", message: error.message } },
      { status: 400 }
    );
  }
}
