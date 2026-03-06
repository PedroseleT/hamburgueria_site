export const runtime = "nodejs";

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAdminPage = pathname.startsWith("/admin");
  if (isAdminPage) {
    const cookieToken = req.cookies.get("auth_token")?.value;
    if (!cookieToken) return NextResponse.redirect(new URL("/login", req.url));
    try {
      const decoded = await verifyToken(cookieToken);  // ← await
      if (decoded.role === "CLIENT") return NextResponse.redirect(new URL("/", req.url));
    } catch {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }

  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  try {
    await verifyToken(token);  // ← await
    return NextResponse.next();
  } catch {
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  }
}

export const config = {
  matcher: [
    "/api/restaurant/:path*",
    "/api/menu/:path*",
    "/api/order/:path*",
    "/api/admin/:path*",
    "/admin",
    "/admin/:path*",
  ],
};