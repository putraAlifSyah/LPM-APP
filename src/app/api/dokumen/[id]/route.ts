import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/db";
import { requireUser, requirePermission } from "@/lib/api";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

type Ctx = { params: Promise<{ id: string }> };

// GET detail + riwayat versi
export async function GET(_req: Request, { params }: Ctx) {
  const auth = await requireUser();
  if ("error" in auth) return auth.error;
  const { id } = await params;

  const dokumen = await prisma.dokumen.findFirst({
    where: { id, deleted: false },
    include: {
      uploadedBy: { select: { nama: true, email: true } },
      riwayat: { orderBy: { versi: "desc" } },
    },
  });

  if (!dokumen) {
    return NextResponse.json(
      { error: "Dokumen tidak ditemukan" },
      { status: 404 }
    );
  }
  return NextResponse.json({ data: dokumen });
}

// PATCH: edit metadata, atau upload versi baru (jika ada file)
export async function PATCH(req: Request, { params }: Ctx) {
  const auth = await requirePermission("uploadDokumen");
  if ("error" in auth) return auth.error;
  const { id } = await params;

  const existing = await prisma.dokumen.findUnique({ where: { id } });
  if (!existing || existing.deleted) {
    return NextResponse.json(
      { error: "Dokumen tidak ditemukan" },
      { status: 404 }
    );
  }

  const form = await req.formData();
  const file = form.get("file") as File | null;

  const updateData: Record<string, unknown> = {
    judul: ((form.get("judul") as string) || existing.judul).trim(),
    deskripsi: (form.get("deskripsi") as string) ?? existing.deskripsi,
    kategori: (form.get("kategori") as string) || existing.kategori,
    standar: (form.get("standar") as string) ?? existing.standar,
    tags: (form.get("tags") as string) ?? existing.tags,
    prodi: (form.get("prodi") as string) ?? existing.prodi,
  };

  // Jika ada file baru → simpan versi lama ke riwayat, naikkan versi
  if (file && file.size > 0) {
    await prisma.riwayatDokumen.create({
      data: {
        dokumenId: existing.id,
        versi: existing.versi,
        pathFile: existing.pathFile,
        namaFile: existing.namaFile,
        catatan: (form.get("catatan") as string) || `Versi ${existing.versi}`,
      },
    });

    await mkdir(UPLOAD_DIR, { recursive: true });
    const bytes = Buffer.from(await file.arrayBuffer());
    const ext = path.extname(file.name) || "";
    const safeBase = file.name
      .replace(ext, "")
      .replace(/[^a-zA-Z0-9-_]/g, "_")
      .slice(0, 40);
    const namaSimpan = `${safeBase}_${Date.now()}${ext}`;
    await writeFile(path.join(UPLOAD_DIR, namaSimpan), bytes);

    updateData.namaFile = file.name;
    updateData.pathFile = `/uploads/${namaSimpan}`;
    updateData.ukuranFile = bytes.length;
    updateData.tipeFile = file.type || "application/octet-stream";
    updateData.versi = existing.versi + 1;
  }

  const dokumen = await prisma.dokumen.update({
    where: { id },
    data: updateData,
  });
  return NextResponse.json({ data: dokumen });
}

// DELETE: soft delete (ADMIN only)
export async function DELETE(_req: Request, { params }: Ctx) {
  const auth = await requirePermission("hapusDokumen");
  if ("error" in auth) return auth.error;
  const { id } = await params;

  await prisma.dokumen.update({
    where: { id },
    data: { deleted: true },
  });
  return NextResponse.json({ ok: true });
}
