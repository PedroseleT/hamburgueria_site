import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // 1. Verificar se os campos foram preenchidos
    if (!email || !password) {
      return NextResponse.json(
        { error: "Preencha todos os campos" },
        { status: 400 }
      );
    }

    // 2. Buscar o usuário pelo email no banco Neon
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // 3. Se o usuário não existir
    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 401 }
      );
    }

    // 4. Verificar se a senha está correta
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Senha incorreta" },
        { status: 401 }
      );
    }

    // 5. Configurar a Resposta de Sucesso
    const response = NextResponse.json({
      message: "Login realizado com sucesso",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

        // 6. CRIAR O COOKIE DE SESSÃO
    response.cookies.set("user_session", JSON.stringify({
      id: user.id,
      role: user.role,
      name: user.name,
      email: user.email,  // ADICIONADO
      phone: user.phone   // ADICIONADO
    }), {
      path: "/",
      maxAge: 60 * 60 * 24 * 7, 
      httpOnly: false, 
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return response;

  } catch (error) {
    console.error("ERRO NO LOGIN:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor" },
      { status: 500 }
    );
  }
}