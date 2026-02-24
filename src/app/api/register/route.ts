import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs"; // Você precisará instalar: npm install bcryptjs

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    // 1. Validação simples
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Dados insuficientes" },
        { status: 400 }
      );
    }

    // 2. Verificar se o e-mail já existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Este e-mail já está cadastrado" },
        { status: 400 }
      );
    }

    // 3. Criptografar a senha (Segurança profissional)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Salvar no banco como CLIENT (conforme seu schema)
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "CLIENT", // Garante que não seja ADMIN por padrão
      },
    });

    return NextResponse.json(
      { message: "Usuário criado com sucesso", userId: user.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro no registro:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor" },
      { status: 500 }
    );
  }
}