import { NextResponse } from "next/server";
import { propertyService } from "@/lib/properties/service";
import { getServerSession } from "@/lib/auth/session";
import { z } from "zod";

const VerifySchema = z.object({
  status: z.enum(["verified", "rejected", "pending"]),
  notes: z.string().optional(),
});

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json(
        { error: { code: "FORBIDDEN", message: "Admin authorization required to moderate property verification" } },
        { status: 403 }
      );
    }

    const { id } = await context.params;
    const body = await req.json();
    const validated = VerifySchema.parse(body);

    const updated = await propertyService.setVerification(id, validated.status, session.userId, validated.notes);
    if (!updated) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Property not found" } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      property: updated,
      message: `Property verification status updated to ${validated.status}`,
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: "VALIDATION_ERROR", message: error.errors?.[0]?.message || error.message } },
      { status: 400 }
    );
  }
}
