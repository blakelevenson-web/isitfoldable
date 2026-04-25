import { NextRequest, NextResponse } from "next/server";
import { createVisit } from "@/lib/queries";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    shopId, date, sliceType,
    scoreOverall, scoreDough, scoreSauce, scoreCheese, scoreFoldability,
    comments, photoUrl,
  } = body;

  if (!shopId || !date || !sliceType) {
    return NextResponse.json({ error: "Shop, date, and slice type are required." }, { status: 400 });
  }

  for (const [name, val] of Object.entries({ scoreDough, scoreSauce, scoreCheese, scoreFoldability })) {
    if (typeof val !== "number" || val < 1 || val > 5) {
      return NextResponse.json({ error: `${name} must be a number between 1 and 5.` }, { status: 400 });
    }
  }

  // Auto-calculate overall as average of dough + sauce + cheese, rounded to tenths
  const calculatedOverall = Math.round(((scoreDough + scoreSauce + scoreCheese) / 3) * 10) / 10;

  const visit = await createVisit({
    shopId, date, sliceType,
    scoreOverall: calculatedOverall, scoreDough, scoreSauce, scoreCheese, scoreFoldability,
    comments: comments || undefined,
    photoUrl: photoUrl || undefined,
  });

  return NextResponse.json(visit, { status: 201 });
}
