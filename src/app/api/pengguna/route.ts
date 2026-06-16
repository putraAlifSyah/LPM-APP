import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/api";
import { hashPassword } from "@/lib/auth";

export async function GET() {
  const auth = await requirePermission("kelolaUser");
  if ("error" in auth) return auth.error;

  const data = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      nama: true,
      email: true,
      role: true,
      prodi: true,
      createdAt: true,
    },
  });
  return NextResponse.json({ data });
}

export async function POST(req: Request) {
  const auth = await requirePermission("kelolaUser");
  if ("error" in auth) return auth.error;

  const b = await req.json();
  const nama = b.nama?.trim();
  const email = b.email?.trim().toLowerCase();
  const password = b.password;
  const role = b.role || "DOSEN";

  if (!nama || !email || !password) {
    return NextResponse.json(
      { error: "Nama, email, dan password wajib diisi" },
      { status: 400 }
    );
  }
  if (password.length < 6) {
    return NextResponse.json(
      { error: "Password minimal 6 karakter" },
      { status: 400 }
    );
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "Email sudah terdaftar" },
      { status: 409 }
    );
  }

  const user = await prisma.user.create({
    data: {
      nama,
      email,
      password: await hashPassword(password),
      role,
      prodi: b.prodi || null,
    },
    select: { id: true, nama: true, email: true, role: true },
  });
  return NextResponse.json({ data: user }, { status: 201 });
}
