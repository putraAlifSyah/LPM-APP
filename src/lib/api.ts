import { NextResponse } from "next/server";
import { getSession, type SessionUser } from "./auth";
import { can, CAN } from "./rbac";

/** Pastikan ada user login; lempar response 401 jika tidak. */
export async function requireUser(): Promise<
  { user: SessionUser } | { error: NextResponse }
> {
  const user = await getSession();
  if (!user) {
    return { error: NextResponse.json({ error: "Belum login" }, { status: 401 }) };
  }
  return { user };
}

/** Pastikan user punya izin tertentu. */
export async function requirePermission(
  aksi: keyof typeof CAN
): Promise<{ user: SessionUser } | { error: NextResponse }> {
  const res = await requireUser();
  if ("error" in res) return res;
  if (!can(res.user.role, aksi)) {
    return {
      error: NextResponse.json(
        { error: "Anda tidak memiliki izin untuk aksi ini" },
        { status: 403 }
      ),
    };
  }
  return res;
}
