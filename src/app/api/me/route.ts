import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";

export async function GET() {
  try {
    const token = (await cookies()).get("auth_token")?.value;

    if (!token)
      return NextResponse.json({ error: "Não logado" }, { status: 401 });

    const decoded = verifyToken(token);
    return NextResponse.json({ id: decoded.id, role: decoded.role });

  } catch {
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  }
}