import { NextResponse } from "next/server";
import { shortlistsDb } from "@/lib/db/shortlists";
import { SavedSearchSchema } from "@/lib/matching/types";
import { getServerSession } from "@/lib/auth/session";

export async function GET() {
  const session = await getServerSession();
  const customerId = session?.userId || "usr-cust-01";

  const savedSearches = await shortlistsDb.getSavedSearches(customerId);

  return NextResponse.json({ savedSearches }, { status: 200 });
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    const customerId = session?.userId || "usr-cust-01";

    const body = await req.json();
    const validated = SavedSearchSchema.parse(body);

    const newSaved = await shortlistsDb.createSavedSearch(customerId, validated);

    return NextResponse.json({
      success: true,
      savedSearch: newSaved,
      message: "Search alert saved successfully",
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: "VALIDATION_ERROR", message: error.errors?.[0]?.message || error.message } },
      { status: 400 }
    );
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession();
  const customerId = session?.userId || "usr-cust-01";

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: { code: "BAD_REQUEST", message: "Saved search id is required" } },
      { status: 400 }
    );
  }

  await shortlistsDb.deleteSavedSearch(customerId, id);

  return NextResponse.json({ success: true, message: "Saved search removed" }, { status: 200 });
}
