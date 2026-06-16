import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/api";

type Ctx = { params: Promise<{ id: string }> };

export async function DELETE(_req: Request, { params }: Ctx) {
  const auth = await requirePermission("kelolaUser");
  if ("error" in auth) return auth.error;
  const { id } = await params;

  if (id === auth.user.id) {
    return NextResponse.json(
      { error: "Tidak dapat menghapus akun sendiri" },
      { status: 400 }
    );
  }

  // Cegah hapus user yang masih punya relasi (dokumen/berita/audit)
  const refs = await prisma.user.findUnique({
    where: { id },
    select: {
      _count: { select: { dokumen: true, berita: true, auditSesi: true } },
    },
  });
  if (
    refs &&
    (refs._count.dokumen > 0 ||
      refs._count.berita > 0 ||
      refs._count.auditSesi > 0)
  ) {
    return NextResponse.json(
      { error: "User masih memiliki data terkait dan tidak dapat dihapus" },
      { status: 400 }
    );
  }

  await prisma.user.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
