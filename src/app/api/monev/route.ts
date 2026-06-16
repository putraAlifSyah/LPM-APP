import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser, requirePermission } from "@/lib/api";

// GET /api/monev?periode=  → indikator + capaian terbaru per periode
export async function GET(req: Request) {
  const auth = await requireUser();
  if ("error" in auth) return auth.error;

  const { searchParams } = new URL(req.url);
  const periode = searchParams.get("periode") || "";

  const indikator = await prisma.indikatorMonev.findMany({
    where: periode ? { periode } : undefined,
    orderBy: { createdAt: "asc" },
    include: { capaian: { orderBy: { createdAt: "desc" } } },
  });

  return NextResponse.json({ data: indikator });
}

// POST /api/monev → buat indikator baru (ADMIN/DOSEN)
export async function POST(req: Request) {
  const auth = await requirePermission("inputMonev");
  if ("error" in auth) return auth.error;

  const b = await req.json();
  if (!b.nama || !b.standar || !b.satuan || b.targetNilai == null || !b.periode) {
    return NextResponse.json({ error: "Lengkapi semua field" }, { status: 400 });
  }

  const indikator = await prisma.indikatorMonev.create({
    data: {
      nama: b.nama,
      standar: b.standar,
      satuan: b.satuan,
      targetNilai: parseFloat(b.targetNilai),
      periode: b.periode,
    },
  });
  return NextResponse.json({ data: indikator }, { status: 201 });
}
