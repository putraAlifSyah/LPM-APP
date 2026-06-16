import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/api";

type Ctx = { params: Promise<{ id: string }> };

// POST: tambah temuan pada sesi audit
export async function POST(req: Request, { params }: Ctx) {
  const auth = await requirePermission("inputTemuan");
  if ("error" in auth) return auth.error;
  const { id } = await params;

  const b = await req.json();
  if (!b.deskripsi || !b.kategori) {
    return NextResponse.json(
      { error: "Deskripsi dan kategori wajib diisi" },
      { status: 400 }
    );
  }

  const temuan = await prisma.temuan.create({
    data: {
      sesiId: id,
      deskripsi: b.deskripsi,
      kategori: b.kategori,
      standar: b.standar || null,
      deadline: b.deadline ? new Date(b.deadline) : null,
    },
  });
  return NextResponse.json({ data: temuan }, { status: 201 });
}
