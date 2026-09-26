import { NextResponse } from "next/server";
import { matchingEngine } from "@/lib/matching/engine";
import { MatchingWeightsSchema } from "@/lib/matching/types";
import { getServerSession } from "@/lib/auth/session";

export async function GET() {
  const session = await getServerSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json(
      { error: { code: "FORBIDDEN", message: "Admin privileges required" } },
      { status: 403 }
    );
  }

  const weights = matchingEngine.getWeights();
  return NextResponse.json({ weights }, { status: 200 });
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json(
        { error: { code: "FORBIDDEN", message: "Admin privileges required" } },
        { status: 403 }
      );
    }

    const body = await req.json();
    const validated = MatchingWeightsSchema.parse(body);

    const updated = matchingEngine.setWeights(validated);

    return NextResponse.json({
      success: true,
      weights: updated,
      message: "Matching algorithm weights updated across platform",
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: "VALIDATION_ERROR", message: error.errors?.[0]?.message || error.message } },
      { status: 400 }
    );
  }
}
