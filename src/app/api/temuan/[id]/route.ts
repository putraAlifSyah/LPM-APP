import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/api";
import { can } from "@/lib/rbac";

type Ctx = { params: Promise<{ id: string }> };

// PATCH: isi tindak lanjut (semua user) & ubah status (auditor/admin)
export async function PATCH(req: Request, { params }: Ctx) {
  const auth = await requireUser();
  if ("error" in auth) return auth.error;
  const { id } = await params;

  const b = await req.json();
  const data: Record<string, unknown> = {};

  if (typeof b.tindakLanjut === "string") {
    data.tindakLanjut = b.tindakLanjut;
  }

  if (b.statusTemuan) {
    // Hanya auditor/admin yang boleh ubah status verifikasi
    if (!can(auth.user.role, "inputTemuan")) {
      return NextResponse.json(
        { error: "Hanya auditor/admin yang dapat mengubah status temuan" },
        { status: 403 }
      );
    }
    const valid = ["OPEN", "PROSES", "CLOSED"];
    if (!valid.includes(b.statusTemuan)) {
      return NextResponse.json({ error: "Status tidak valid" }, { status: 400 });
    }
    data.statusTemuan = b.statusTemuan;
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "Tidak ada perubahan" }, { status: 400 });
  }

  const temuan = await prisma.temuan.update({ where: { id }, data });
  return NextResponse.json({ data: temuan });
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const auth = await requireUser();
  if ("error" in auth) return auth.error;
  if (!can(auth.user.role, "inputTemuan")) {
    return NextResponse.json({ error: "Tidak diizinkan" }, { status: 403 });
  }
  const { id } = await params;
  await prisma.temuan.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
