import { verifyAuthJwt } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL ??
  "https://beam-eta-rust.vercel.app";

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  const isPublic =
    pathname === "/" ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico";

  if (!isPublic) {
    const token = req.cookies.get("auth")?.value;

    if (!token) {
      const res = NextResponse.redirect(new URL("/login", baseUrl));
      res.headers.set("x-mw-debug", "no-auth-cookie");
      return res;
    }

    try {
      verifyAuthJwt(token);
      const res = NextResponse.next();
      res.headers.set("x-mw-debug", "jwt-valid");
      return res;
    } catch {
      const res = NextResponse.redirect(new URL("/login", baseUrl));
      res.headers.set("x-mw-debug", "jwt-invalid");
      return res;
    }
  }

  const res = NextResponse.next();
  res.headers.set("x-mw-debug", "public-route");
  return res;
}

export const config = {
  matcher: [
    "/explore/:path*",
    "/profile/:path*",
    "/leaderboard/:path*",
    "/api/:path*",
  ],
};
