import { NextResponse } from "next/server";
import { projectsDb } from "@/lib/db/projects";
import { CreateProjectSchema } from "@/lib/developer/types";
import { getServerSession } from "@/lib/auth/session";

export async function GET(req: Request) {
  const session = await getServerSession();
  const developerId = session?.userId || "usr-dev-01";

  const projects = await projectsDb.findProjects(developerId);

  return NextResponse.json({
    projects,
    count: projects.length,
  }, { status: 200 });
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    const developerId = session?.userId || "usr-dev-01";

    const body = await req.json();
    const validated = CreateProjectSchema.parse(body);

    const newProject = await projectsDb.createProject({
      ...validated,
      developerId,
    });

    return NextResponse.json({
      success: true,
      project: newProject,
      message: "New residential/commercial project registered",
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: "VALIDATION_ERROR", message: error.errors?.[0]?.message || error.message } },
      { status: 400 }
    );
  }
}
