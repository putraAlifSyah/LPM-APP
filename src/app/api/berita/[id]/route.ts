import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/api";

type Ctx = { params: Promise<{ id: string }> };

export async function DELETE(_req: Request, { params }: Ctx) {
  const auth = await requirePermission("buatBerita");
  if ("error" in auth) return auth.error;
  const { id } = await params;
  await prisma.berita.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
