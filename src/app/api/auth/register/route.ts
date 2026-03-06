import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, phone } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Nome, e-mail e senha são obrigatórios." },
        { status: 400 }
      );
    }

    // ── Verifica e-mail duplicado ─────────────────────────────────────────────
    const emailExists = await prisma.user.findUnique({ where: { email } });
    if (emailExists) {
      return NextResponse.json(
        { error: "Este e-mail já está cadastrado." },
        { status: 409 }
      );
    }

    // ── Verifica telefone duplicado ───────────────────────────────────────────
    if (phone) {
      const phoneExists = await prisma.user.findFirst({ where: { phone } });
      if (phoneExists) {
        return NextResponse.json(
          { error: "Este número de telefone já está cadastrado." },
          { status: 409 }
        );
      }
    }

    // ── Cria o usuário ────────────────────────────────────────────────────────
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone: phone || null,
        role: "CLIENT",
      },
    });

    const response = NextResponse.json(
      { message: "Usuário criado com sucesso", userId: user.id },
      { status: 201 }
    );

    response.cookies.set("user_session", JSON.stringify({
      id: user.id,
      role: user.role,
      name: user.name,
      email: user.email,
      phone: user.phone,
    }), {
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: false,
      sameSite: "lax",
    });

    return response;

  } catch (error) {
    console.error("ERRO NO REGISTER:", error);
    return NextResponse.json(
      { error: "Erro interno ao cadastrar. Tente novamente." },
      { status: 500 }
    );
  }
}