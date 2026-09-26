import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import { usersDb } from "@/lib/db/users";
import { UpdateProfileSchema } from "@/lib/auth/types";

export async function GET() {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Authentication required" } },
      { status: 401 }
    );
  }

  const user = await usersDb.findById(session.userId);
  let profile = null;

  if (session.role === "customer") {
    profile = await usersDb.getBuyerProfile(session.userId);
  } else if (session.role === "agent") {
    profile = await usersDb.getAgentProfile(session.userId);
  }

  return NextResponse.json({
    user,
    profile,
  }, { status: 200 });
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Authentication required" } },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validated = UpdateProfileSchema.parse(body);

    if (validated.name || validated.phone) {
      await usersDb.update(session.userId, {
        ...(validated.name ? { name: validated.name } : {}),
        ...(validated.phone ? { phone: validated.phone } : {}),
      });
    }

    if (session.role === "customer") {
      await usersDb.updateBuyerProfile(session.userId, {
        ...(validated.budgetMin !== undefined ? { budgetMin: validated.budgetMin } : {}),
        ...(validated.budgetMax !== undefined ? { budgetMax: validated.budgetMax } : {}),
        ...(validated.preferredLocalities ? { preferredLocalities: validated.preferredLocalities } : {}),
        ...(validated.preferredBhk ? { preferredBhk: validated.preferredBhk } : {}),
        ...(validated.purpose ? { purpose: validated.purpose } : {}),
        ...(validated.financingStatus ? { financingStatus: validated.financingStatus } : {}),
      });
    } else if (session.role === "agent") {
      await usersDb.updateAgentProfile(session.userId, {
        ...(validated.serviceAreas ? { serviceAreas: validated.serviceAreas } : {}),
        ...(validated.specialties ? { specialties: validated.specialties } : {}),
        ...(validated.reraLicenseNumber ? { reraLicenseNumber: validated.reraLicenseNumber } : {}),
      });
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: "VALIDATION_ERROR", message: error.errors?.[0]?.message || error.message } },
      { status: 400 }
    );
  }
}
