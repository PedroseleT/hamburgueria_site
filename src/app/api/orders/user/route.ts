import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Usando o seu ID de usuário fixo para buscar os pedidos
    const userId = "cmmclamu60000n1zyss460pap";

    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: true, // Para pegarmos o nome e imagem do produto
          },
        },
      },
      orderBy: {
        createdAt: "desc", // Pedidos mais recentes primeiro
      },
    });

    return NextResponse.json(orders);
  } catch (error: any) {
    return NextResponse.json({ error: "Erro ao buscar pedidos" }, { status: 500 });
  }
}