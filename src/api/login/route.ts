import { prisma } from "@/lib/prisma";
import { comparePassword } from "@/lib/hash";
import { generateToken } from "@/lib/jwt";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return NextResponse.json({ error: "Usuário não encontrado" }, { status: 400 });
  }

  const valid = await comparePassword(password, user.password);

  if (!valid) {
    return NextResponse.json({ error: "Senha inválida" }, { status: 400 });
  }

  const token = generateToken({
    id: user.id,
    role: user.role,
  });

  return NextResponse.json({ token });
}