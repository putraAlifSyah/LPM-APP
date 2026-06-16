import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/api";

// POST /api/monev/capaian → input capaian untuk indikator
export async function POST(req: Request) {
  const auth = await requirePermission("inputMonev");
  if ("error" in auth) return auth.error;

  const b = await req.json();
  if (!b.indikatorId || b.nilaiCapaian == null) {
    return NextResponse.json(
      { error: "Indikator dan nilai capaian wajib diisi" },
      { status: 400 }
    );
  }

  const indikator = await prisma.indikatorMonev.findUnique({
    where: { id: b.indikatorId },
  });
  if (!indikator) {
    return NextResponse.json(
      { error: "Indikator tidak ditemukan" },
      { status: 404 }
    );
  }

  const capaian = await prisma.capaianMonev.create({
    data: {
      indikatorId: b.indikatorId,
      nilaiCapaian: parseFloat(b.nilaiCapaian),
      keterangan: b.keterangan || null,
      unit: b.unit || null,
      periode: b.periode || indikator.periode,
    },
  });
  return NextResponse.json({ data: capaian }, { status: 201 });
}
