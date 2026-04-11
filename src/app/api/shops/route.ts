import { NextRequest, NextResponse } from "next/server";
import { createShop, checkDuplicateShop, getAllShops, getVisitsForShop } from "@/lib/queries";

export async function GET() {
  const shops = await getAllShops();
  const shopsWithStats = await Promise.all(shops.map(async (shop) => {
    const shopVisits = await getVisitsForShop(shop.id);
    const avg = shopVisits.length > 0
      ? shopVisits.reduce((sum, v) => sum + v.scoreOverall, 0) / shopVisits.length
      : 0;
    const latestVisitDate = shopVisits.length > 0 ? shopVisits[0].date : null;
    return { ...shop, visitCount: shopVisits.length, avg: Math.round(avg * 10) / 10, latestVisitDate };
  }));
  return NextResponse.json(shopsWithStats);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, address, zipCode, photoUrl } = body;

  if (!name || !address || !zipCode) {
    return NextResponse.json({ error: "Name, address, and zip code are required." }, { status: 400 });
  }

  const duplicate = await checkDuplicateShop(name, address);
  if (duplicate) {
    return NextResponse.json({ error: "A shop with this name and address already exists." }, { status: 409 });
  }

  const shop = await createShop({ name, address, zipCode, photoUrl });
  return NextResponse.json(shop, { status: 201 });
}
