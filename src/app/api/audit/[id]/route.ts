import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/api";

type Ctx = { params: Promise<{ id: string }> };

// PATCH: ubah status sesi audit (RENCANA/BERLANGSUNG/SELESAI)
export async function PATCH(req: Request, { params }: Ctx) {
  const auth = await requirePermission("buatAudit");
  if ("error" in auth) return auth.error;
  const { id } = await params;

  const b = await req.json();
  const valid = ["RENCANA", "BERLANGSUNG", "SELESAI"];
  if (!valid.includes(b.status)) {
    return NextResponse.json({ error: "Status tidak valid" }, { status: 400 });
  }

  // Cegah set SELESAI jika masih ada temuan belum CLOSED
  if (b.status === "SELESAI") {
    const open = await prisma.temuan.count({
      where: { sesiId: id, statusTemuan: { not: "CLOSED" } },
    });
    if (open > 0) {
      return NextResponse.json(
        { error: `Masih ada ${open} temuan yang belum CLOSED` },
        { status: 400 }
      );
    }
  }

  const sesi = await prisma.auditSesi.update({
    where: { id },
    data: { status: b.status },
  });
  return NextResponse.json({ data: sesi });
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const auth = await requirePermission("buatAudit");
  if ("error" in auth) return auth.error;
  const { id } = await params;
  await prisma.auditSesi.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
