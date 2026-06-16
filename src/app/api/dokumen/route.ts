import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/db";
import { requireUser, requirePermission } from "@/lib/api";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

// GET /api/dokumen?search=&kategori=&standar=&prodi=
export async function GET(req: Request) {
  const auth = await requireUser();
  if ("error" in auth) return auth.error;

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search")?.trim() || "";
  const kategori = searchParams.get("kategori") || "";
  const standar = searchParams.get("standar") || "";
  const prodi = searchParams.get("prodi") || "";

  const where: Record<string, unknown> = { deleted: false };
  if (kategori) where.kategori = kategori;
  if (prodi) where.prodi = prodi;
  if (standar) where.standar = { contains: standar };
  if (search) {
    where.OR = [
      { judul: { contains: search } },
      { deskripsi: { contains: search } },
      { tags: { contains: search } },
      { kategori: { contains: search } },
      { standar: { contains: search } },
    ];
  }

  const data = await prisma.dokumen.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { uploadedBy: { select: { nama: true } } },
  });

  return NextResponse.json({ data, total: data.length });
}

// POST /api/dokumen  (multipart: file + metadata)
export async function POST(req: Request) {
  const auth = await requirePermission("uploadDokumen");
  if ("error" in auth) return auth.error;

  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    const judul = (form.get("judul") as string)?.trim();
    const kategori = (form.get("kategori") as string)?.trim();

    if (!file || !judul || !kategori) {
      return NextResponse.json(
        { error: "Judul, kategori, dan file wajib diisi" },
        { status: 400 }
      );
    }

    // Simpan file ke public/uploads
    await mkdir(UPLOAD_DIR, { recursive: true });
    const bytes = Buffer.from(await file.arrayBuffer());
    const ext = path.extname(file.name) || "";
    const safeBase = file.name
      .replace(ext, "")
      .replace(/[^a-zA-Z0-9-_]/g, "_")
      .slice(0, 40);
    const stamp = `${Date.now()}_${Math.round(bytes.length)}`;
    const namaSimpan = `${safeBase}_${stamp}${ext}`;
    await writeFile(path.join(UPLOAD_DIR, namaSimpan), bytes);

    const dokumen = await prisma.dokumen.create({
      data: {
        judul,
        deskripsi: (form.get("deskripsi") as string) || null,
        kategori,
        standar: (form.get("standar") as string) || null,
        tags: (form.get("tags") as string) || null,
        prodi: (form.get("prodi") as string) || null,
        namaFile: file.name,
        pathFile: `/uploads/${namaSimpan}`,
        ukuranFile: bytes.length,
        tipeFile: file.type || "application/octet-stream",
        userId: auth.user.id,
      },
    });

    return NextResponse.json({ data: dokumen }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Gagal mengunggah dokumen" },
      { status: 500 }
    );
  }
}
