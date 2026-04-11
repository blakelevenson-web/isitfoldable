import { NextRequest, NextResponse } from "next/server";
import { searchVisits } from "@/lib/queries";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") || "";
  if (!q.trim()) return NextResponse.json([]);
  const results = await searchVisits(q);
  return NextResponse.json(results);
}
