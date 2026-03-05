import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/jwt";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ✅ NOVO: Proteção de páginas admin (somente ADMIN ou ATTENDANT)
  const isAdminPage = pathname.startsWith("/admin");
  if (isAdminPage) {
    const cookieToken = req.cookies.get("auth_token")?.value;
    if (!cookieToken) return NextResponse.redirect(new URL("/login", req.url));
    try {
      const decoded = verifyToken(cookieToken);
      if (decoded.role === "CLIENT") return NextResponse.redirect(new URL("/", req.url));
    } catch {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }

  // ✅ ORIGINAL: Proteção das rotas de API via header Authorization
  const token = req.headers.get("authorization")?.split(" ")[1];

  if (!token) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    verifyToken(token);
    return NextResponse.next();
  } catch {
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  }
}

export const config = {
  matcher: [
    // ✅ ORIGINAL
    "/api/restaurant/:path*",
    "/api/menu/:path*",
    "/api/order/:path*",
    // ✅ NOVO (removido /perfil pois já tem proteção própria na página)
    "/api/admin/:path*",
    "/admin/:path*",
  ],
};