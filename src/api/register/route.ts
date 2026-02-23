import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/hash";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { name, email, password } = await req.json();

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return NextResponse.json({ error: "Email já existe" }, { status: 400 });
  }

  const hashed = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashed,
    },
  });

  return NextResponse.json(user);
}