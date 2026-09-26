import { NextResponse } from "next/server";
import { propertyService } from "@/lib/properties/service";
import { UpdatePropertySchema } from "@/lib/properties/types";
import { getServerSession } from "@/lib/auth/session";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const property = await propertyService.getById(id);

  if (!property) {
    return NextResponse.json(
      { error: { code: "NOT_FOUND", message: "Property not found" } },
      { status: 404 }
    );
  }

  return NextResponse.json({ property }, { status: 200 });
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Authentication required" } },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const existing = await propertyService.getById(id);
    if (!existing) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Property not found" } },
        { status: 404 }
      );
    }

    // Authorization check: only owner, assigned agent, or admin can mutate
    const isAuthorized =
      session.role === "admin" ||
      existing.ownerId === session.userId ||
      existing.agentId === session.userId;

    if (!isAuthorized) {
      return NextResponse.json(
        { error: { code: "FORBIDDEN", message: "You do not have permission to edit this listing" } },
        { status: 403 }
      );
    }

    const body = await req.json();
    const validated = UpdatePropertySchema.parse(body);

    const updated = await propertyService.update(id, validated, session.userId);

    return NextResponse.json({
      success: true,
      property: updated,
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: "VALIDATION_ERROR", message: error.errors?.[0]?.message || error.message } },
      { status: 400 }
    );
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Authentication required" } },
      { status: 401 }
    );
  }

  const { id } = await context.params;
  const existing = await propertyService.getById(id);
  if (!existing) {
    return NextResponse.json(
      { error: { code: "NOT_FOUND", message: "Property not found" } },
      { status: 404 }
    );
  }

  const isAuthorized = session.role === "admin" || existing.ownerId === session.userId;
  if (!isAuthorized) {
    return NextResponse.json(
      { error: { code: "FORBIDDEN", message: "You do not have permission to delete this listing" } },
      { status: 403 }
    );
  }

  await propertyService.delete(id, session.userId);

  return NextResponse.json({
    success: true,
    message: "Property listing removed",
  }, { status: 200 });
}
