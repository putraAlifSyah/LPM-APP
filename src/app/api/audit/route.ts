import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser, requirePermission } from "@/lib/api";

export async function GET() {
  const auth = await requireUser();
  if ("error" in auth) return auth.error;

  const data = await prisma.auditSesi.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      auditor: { select: { nama: true } },
      _count: { select: { temuan: true } },
    },
  });
  return NextResponse.json({ data });
}

export async function POST(req: Request) {
  const auth = await requirePermission("buatAudit");
  if ("error" in auth) return auth.error;

  const b = await req.json();
  if (!b.nama || !b.unitAudit || !b.tanggalMulai || !b.tanggalSelesai) {
    return NextResponse.json({ error: "Lengkapi semua field" }, { status: 400 });
  }

  const sesi = await prisma.auditSesi.create({
    data: {
      nama: b.nama,
      unitAudit: b.unitAudit,
      tanggalMulai: new Date(b.tanggalMulai),
      tanggalSelesai: new Date(b.tanggalSelesai),
      auditorId: b.auditorId || auth.user.id,
      status: "RENCANA",
    },
  });
  return NextResponse.json({ data: sesi }, { status: 201 });
}
