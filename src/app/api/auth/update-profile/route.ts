import { prisma } from "@/lib/prisma"; // Use a instância global
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, phone, password, originalEmail } = await req.json();

    const updateData: any = { name, email, phone };
    
    if (password && password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await prisma.user.update({
      where: { email: originalEmail },
      data: updateData,
    });

    const sessionData = JSON.stringify({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      role: updatedUser.role // Adicionado para manter a consistência
    });

    const cookieStore = await cookies();
    cookieStore.set("user_session", sessionData, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: false, // Importante para o front-end ler
    });

    return NextResponse.json({ message: "Sucesso" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao atualizar" }, { status: 500 });
  }
}