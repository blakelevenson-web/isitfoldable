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
    const raw = await req.json();

    // Only allow known visit columns - strip joined fields like shopName
    const allowed = ["shopId","date","sliceType","scoreOverall","scoreDough","scoreSauce","scoreCheese","scoreFoldability","comments","photoUrl"];
    const data: Record<string, any> = {};
    for (const k of allowed) {
      if (raw[k] !== undefined) data[k] = raw[k];
    }

    // Convert score strings to numbers and validate
    for (const k of ["scoreOverall","scoreDough","scoreSauce","scoreCheese","scoreFoldability"]) {
      if (data[k] !== undefined) {
        data[k] = Number(data[k]);
        if (isNaN(data[k])) {
          return NextResponse.json({ error: `${k} must be a valid number` }, { status: 400 });
        }
      }
    }

    const visit = await updateVisit(id, data);
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
