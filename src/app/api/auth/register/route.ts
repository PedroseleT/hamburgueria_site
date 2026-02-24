import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Adicionado o campo 'phone' vindo do corpo da requisição
    const { name, email, password, phone } = body;

    // 1. Criptografar a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // 2. Criar o usuário no banco (Incluindo o campo phone)
    const user = await prisma.user.create({
      data: { 
        name, 
        email, 
        password: hashedPassword, 
        phone: phone || null, // Salva o telefone no banco
        role: "CLIENT" 
      },
    });

    // 3. Preparar a resposta
    const response = NextResponse.json(
      { message: "Usuário criado com sucesso", userId: user.id },
      { status: 201 }
    );
    
    // 4. CRIAR A SESSÃO (Incluindo o phone para o perfil ler automaticamente)
    response.cookies.set("user_session", JSON.stringify({
      id: user.id,
      role: user.role,
      name: user.name,
      email: user.email,
      phone: user.phone // Essencial para aparecer preenchido no perfil
    }), {
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: false, // Permitir leitura no front-end para preencher os inputs
      sameSite: "lax",
    });

    return response;

  } catch (error) {
    console.error("ERRO NO REGISTER:", error);
    return NextResponse.json(
      { error: "Erro ao cadastrar. Verifique se o e-mail já existe ou se o banco está conectado." },
      { status: 500 }
    );
  }
}