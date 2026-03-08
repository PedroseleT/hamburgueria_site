import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/jwt";

// # ALTERAÇÃO SOLICITADA: Definição de rotas públicas que o segurança ignora
const PUBLIC_API_ROUTES = ["/api/webhooks/mercadopago"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // # 1. EXCEÇÃO DE SEGURANÇA: Permite que o Mercado Pago envie o Webhook sem Token
  if (PUBLIC_API_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // # 2. PROTEÇÃO DE PÁGINAS E APIS DE ADMIN
  const isAdminPath = pathname.startsWith("/admin") || pathname.startsWith("/api/admin");
  
  if (isAdminPath) {
    const cookieToken = req.cookies.get("auth_token")?.value;
    
    // Se não tem token, bloqueia
    if (!cookieToken) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Acesso negado: Token ausente" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
      const decoded = await verifyToken(cookieToken);
      
      // Se for CLIENT tentando acessar ADMIN, expulsa para a Home
      if (decoded.role !== "ADMIN" && decoded.role !== "ATTENDANT") {
        if (pathname.startsWith("/api/")) {
          return NextResponse.json({ error: "Acesso negado: Permissão insuficiente" }, { status: 403 });
        }
        return NextResponse.redirect(new URL("/", req.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    
    return NextResponse.next();
  }

  // # 3. PROTEÇÃO GERAL DE OUTRAS APIS (Obrigatório Token)
  const isProtectedApi = pathname.startsWith("/api/order") || pathname.startsWith("/api/menu");
  
  if (isProtectedApi) {
    // Tenta pegar o token do Cookie primeiro (usado pelo Front) ou do Header (usado por bots/mobile)
    const token = req.cookies.get("auth_token")?.value || req.headers.get("authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ error: "Sessão expirada ou não autorizado" }, { status: 401 });
    }

    try {
      await verifyToken(token);
      return NextResponse.next();
    } catch {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

// # ALTERAÇÃO SOLICITADA: Matcher atualizado para cobrir todas as áreas críticas
export const config = {
  matcher: [
    "/api/restaurant/:path*",
    "/api/menu/:path*",
    "/api/order/:path*",
    "/api/admin/:path*",
    "/admin/:path*",
    "/api/webhooks/:path*" // Monitoramos para aplicar a exceção
  ],
};