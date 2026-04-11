import { NextRequest, NextResponse } from "next/server";
import { getShopById, updateShop, deleteShop } from "@/lib/queries";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const shop = await getShopById(id);
  if (!shop) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(shop);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const shop = await updateShop(id, body);
  return NextResponse.json(shop);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await deleteShop(id);
  return NextResponse.json({ ok: true });
}
