import { NextRequest, NextResponse } from "next/server";
import { getVisitById, updateVisit, deleteVisit } from "@/lib/queries";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const visit = await getVisitById(id);
  if (!visit) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(visit);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await req.json();

    // Convert score strings to numbers and validate
    const scoreFields = ["scoreOverall", "scoreDough", "scoreSauce", "scoreCheese", "scoreFoldability"] as const;
    for (const field of scoreFields) {
      if (body[field] !== undefined) {
        body[field] = Number(body[field]);
        if (isNaN(body[field])) {
          return NextResponse.json({ error: `${field} must be a valid number` }, { status: 400 });
        }
        if (body[field] < 0 || body[field] > 10) {
          return NextResponse.json({ error: `${field} must be between 0 and 10` }, { status: 400 });
        }
      }
    }

    const visit = await updateVisit(id, body);
    return NextResponse.json(visit);
  } catch (err: any) {
    console.error("Update visit failed:", err);
    return NextResponse.json({ error: err?.message || "Update failed" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await deleteVisit(id);
  return NextResponse.json({ ok: true });
}
