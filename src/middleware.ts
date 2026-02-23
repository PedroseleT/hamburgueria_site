import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

export function middleware(req: any) {
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
  matcher: ["/api/restaurant/:path*", "/api/menu/:path*", "/api/order/:path*"],
};