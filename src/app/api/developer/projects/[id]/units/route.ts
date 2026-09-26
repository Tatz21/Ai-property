import { NextResponse } from "next/server";
import { projectsDb } from "@/lib/db/projects";
import { CreateUnitSchema, UpdateUnitSchema } from "@/lib/developer/types";
import { z } from "zod";

const PatchUnitBodySchema = UpdateUnitSchema.extend({
  unitId: z.string(),
});

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const project = await projectsDb.findProjectById(id);

  if (!project) {
    return NextResponse.json({ error: { code: "NOT_FOUND", message: "Project not found" } }, { status: 404 });
  }

  const units = await projectsDb.findUnitsByProject(id);

  return NextResponse.json({
    project,
    units,
    count: units.length,
  }, { status: 200 });
}

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const validated = CreateUnitSchema.parse({ ...body, projectId: id });

    const newUnit = await projectsDb.createUnit(validated);

    return NextResponse.json({
      success: true,
      unit: newUnit,
      message: "Unit added to project inventory",
    }, { status: 201 });
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
    const body = await req.json();
    const validated = PatchUnitBodySchema.parse(body);

    const updated = await projectsDb.updateUnit(validated.unitId, {
      ...(validated.price !== undefined ? { price: validated.price } : {}),
      ...(validated.status ? { status: validated.status } : {}),
    });

    if (!updated) {
      return NextResponse.json({ error: { code: "NOT_FOUND", message: "Unit not found" } }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      unit: updated,
      message: "Unit availability status & pricing updated",
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: "VALIDATION_ERROR", message: error.errors?.[0]?.message || error.message } },
      { status: 400 }
    );
  }
}
