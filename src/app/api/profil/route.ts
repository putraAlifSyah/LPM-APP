import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/api";
import {
  hashPassword,
  verifyPassword,
  createSession,
  setSessionCookie,
} from "@/lib/auth";

export async function PATCH(req: Request) {
  const auth = await requireUser();
  if ("error" in auth) return auth.error;

  const b = await req.json();
  const data: Record<string, unknown> = {};

  if (b.nama?.trim()) data.nama = b.nama.trim();
  if ("prodi" in b) data.prodi = b.prodi || null;

  // Ganti password (butuh password lama)
  if (b.passwordBaru) {
    if (b.passwordBaru.length < 6) {
      return NextResponse.json(
        { error: "Password baru minimal 6 karakter" },
        { status: 400 }
      );
    }
    const user = await prisma.user.findUnique({ where: { id: auth.user.id } });
    if (!user || !(await verifyPassword(b.passwordLama || "", user.password))) {
      return NextResponse.json(
        { error: "Password lama salah" },
        { status: 400 }
      );
    }
    data.password = await hashPassword(b.passwordBaru);
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "Tidak ada perubahan" }, { status: 400 });
  }

  const updated = await prisma.user.update({
    where: { id: auth.user.id },
    data,
  });

  // Refresh cookie session jika nama/prodi berubah
  const token = await createSession({
    id: updated.id,
    nama: updated.nama,
    email: updated.email,
    role: updated.role as never,
    prodi: updated.prodi,
  });
  await setSessionCookie(token);

  return NextResponse.json({ ok: true });
}
