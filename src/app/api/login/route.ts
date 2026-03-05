import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { generateToken } from "@/lib/jwt";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password)
      return NextResponse.json({ error: "E-mail e senha são obrigatórios" }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user)
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 401 });

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid)
      return NextResponse.json({ error: "Senha incorreta" }, { status: 401 });

    // ✅ Agora o token carrega id e role corretamente
    const token = generateToken({ id: user.id, role: user.role });

    const response = NextResponse.json({
      message: "Login bem-sucedido",
      role: user.role, // útil para o frontend redirecionar
    }, { status: 200 });

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;

  } catch (error) {
    console.error("ERRO NO LOGIN:", error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}