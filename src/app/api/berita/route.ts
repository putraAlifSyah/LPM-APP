import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser, requirePermission } from "@/lib/api";

export async function GET() {
  const auth = await requireUser();
  if ("error" in auth) return auth.error;

  const data = await prisma.berita.findMany({
    orderBy: { createdAt: "desc" },
    include: { penulis: { select: { nama: true } } },
  });
  return NextResponse.json({ data });
}

export async function POST(req: Request) {
  const auth = await requirePermission("buatBerita");
  if ("error" in auth) return auth.error;

  const body = await req.json();
  const judul = body.judul?.trim();
  const isi = body.isi?.trim();
  const kategori = body.kategori || "Berita";

  if (!judul || !isi) {
    return NextResponse.json(
      { error: "Judul dan isi wajib diisi" },
      { status: 400 }
    );
  }

  const berita = await prisma.berita.create({
    data: { judul, isi, kategori, userId: auth.user.id },
  });
  return NextResponse.json({ data: berita }, { status: 201 });
}
