import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

// # ALTERAÇÃO SOLICITADA: Força a rota a sempre buscar dados novos no banco (sem cache)
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // # ALTERAÇÃO SOLICITADA: Captura o ID do usuário logado via cookie para evitar que todos vejam os mesmos pedidos
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("user_session");

    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const userId = sessionCookie.value;

    const orders = await prisma.order.findMany({
      where: { userId }, // Filtra apenas pelos pedidos do dono da sessão
      include: {
        items: {
          include: {
            product: true, 
          },
        },
      },
      orderBy: {
        createdAt: "desc", 
      },
    });

    return NextResponse.json(orders);
  } catch (error: any) {
    console.error("Erro ao buscar pedidos:", error);
    return NextResponse.json({ error: "Erro ao buscar pedidos" }, { status: 500 });
  }
}