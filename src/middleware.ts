import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || "dev-secret-change-me"
);
const COOKIE_NAME = "lpm_session";

// Route yang tidak butuh login
const PUBLIC_PATHS = ["/login", "/api/auth/login"];

async function isAuthed(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return false;
  try {
    await jwtVerify(token, SECRET);
    return true;
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isPublic = PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );

  const authed = await isAuthed(req);

  // Sudah login tapi buka /login → arahkan ke dashboard
  if (authed && pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Belum login & bukan halaman publik → arahkan ke login
  if (!authed && !isPublic) {
    const url = new URL("/login", req.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Semua route kecuali static files & _next
    "/((?!_next/static|_next/image|favicon.ico|uploads|.*\\.(?:png|jpg|jpeg|svg|ico)).*)",
  ],
};
