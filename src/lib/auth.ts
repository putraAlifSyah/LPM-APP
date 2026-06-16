import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "./db";

const SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || "dev-secret-change-me"
);
const COOKIE_NAME = "lpm_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 hari

export type Role = "ADMIN" | "AUDITOR" | "DOSEN" | "PIMPINAN";

export type SessionUser = {
  id: string;
  nama: string;
  email: string;
  role: Role;
  prodi: string | null;
};

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSession(user: SessionUser): Promise<string> {
  return new SignJWT({ ...user })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(SECRET);
}

export async function verifyToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return {
      id: payload.id as string,
      nama: payload.nama as string,
      email: payload.email as string,
      role: payload.role as Role,
      prodi: (payload.prodi as string) ?? null,
    };
  } catch {
    return null;
  }
}

export async function setSessionCookie(token: string) {
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

/** Ambil user dari cookie session (server component / route handler). */
export async function getSession(): Promise<SessionUser | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

/** Login: cek email & password, return token jika valid. */
export async function login(
  email: string,
  password: string
): Promise<{ token: string; user: SessionUser } | null> {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;
  const ok = await verifyPassword(password, user.password);
  if (!ok) return null;
  const sessionUser: SessionUser = {
    id: user.id,
    nama: user.nama,
    email: user.email,
    role: user.role as Role,
    prodi: user.prodi,
  };
  const token = await createSession(sessionUser);
  return { token, user: sessionUser };
}

export const COOKIE = COOKIE_NAME;
