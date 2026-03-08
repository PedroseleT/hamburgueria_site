import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
// # ALTERAÇÃO SOLICITADA: Importação do segurança de requisições
import { rateLimit } from "@/lib/rate-limit";

// # ALTERAÇÃO SOLICITADA: Schema de validação rigorosa para o Registro
const registerSchema = z.object({
  name: z.string().min(3, "O nome deve ter no mínimo 3 caracteres").max(50, "Nome muito longo"),
  email: z.string().email("Formato de e-mail inválido").max(100),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres").max(100),
  phone: z.string().min(10, "Telefone inválido").max(15, "Telefone muito longo").optional().nullable(),
});

export async function POST(request: Request) {
  try {
    // # ALTERAÇÃO SOLICITADA: Rate Limit para evitar spam de criação de contas
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    const isAllowed = await rateLimit(ip, 3); // Apenas 3 registros por minuto por IP

    if (!isAllowed.success) {
      return NextResponse.json(
        { error: "Muitas tentativas de registro. Tente novamente em 1 minuto." },
        { status: 429 }
      );
    }

    const body = await request.json();

    // # ALTERAÇÃO SOLICITADA: Validação Zod
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message || "Dados inválidos";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { name, email, password, phone } = validation.data;

    // ── Verifica e e-mail duplicado ─────────────────────────────────────────────
    const emailExists = await prisma.user.findUnique({ where: { email } });
    if (emailExists) {
      return NextResponse.json({ error: "Este e-mail já está cadastrado." }, { status: 409 });
    }

    // ── Verifica telefone duplicado ───────────────────────────────────────────
    if (phone) {
      const phoneExists = await prisma.user.findFirst({ where: { phone } });
      if (phoneExists) {
        return NextResponse.json({ error: "Este número de telefone já está cadastrado." }, { status: 409 });
      }
    }

    // ── Cria o usuário ────────────────────────────────────────────────────────
    const hashedPassword = await bcrypt.hash(password, 12); // Aumentado o salt para 12 (mais lento/seguro)

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

    // # ALTERAÇÃO SOLICITADA: Cookies com segurança máxima
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
      secure: true,
      sameSite: "strict",
    });

    // Impede que o navegador guarde dados sensíveis
    response.headers.set("Cache-Control", "no-store, max-age=0");

    return response;

  } catch (error) {
    console.error("ERRO NO REGISTER:", error);
    return NextResponse.json(
      { error: "Erro interno ao cadastrar. Tente novamente." },
      { status: 500 }
    );
  }
}