import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { generateToken } from "@/lib/jwt"; 
import { z } from "zod";
// # ALTERAÇÃO SOLICITADA: Importação do segurança
import { rateLimit } from "@/lib/rate-limit";

const loginSchema = z.object({
  email: z.string().email("Formato de e-mail inválido").max(100),
  password: z.string().min(6).max(100),
});

export async function POST(request: Request) {
  try {
    // # ALTERAÇÃO SOLICITADA: Pega o IP do usuário e verifica se ele não está tentando logar demais
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    const isAllowed = await rateLimit(ip, 5); // Limite de 5 tentativas por minuto
    
    if (!isAllowed.success) {
      return NextResponse.json(
        { error: "Muitas tentativas. Tente novamente em 1 minuto." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const validation = loginSchema.safeParse(body);
    
    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message || "Dados inválidos";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { email, password } = validation.data;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Senha incorreta" }, { status: 401 });
    }

    const response = NextResponse.json({
      message: "Login realizado com sucesso",
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });

    response.cookies.set("user_session", JSON.stringify({
      id: user.id, role: user.role, name: user.name, email: user.email, phone: user.phone
    }), {
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: false, 
      secure: true, 
      sameSite: "strict", 
    });

    const token = await generateToken({ id: user.id, role: user.role }); 
    response.cookies.set("auth_token", token, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    response.headers.set("Cache-Control", "no-store, max-age=0");
    return response;

  } catch (error) {
    console.error("ERRO NO LOGIN:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}