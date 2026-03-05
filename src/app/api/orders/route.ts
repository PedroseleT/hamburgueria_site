import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, total, restaurantId, paymentMethod, notes } = body;

    // Usando o seu ID de usuário real para o teste
    const userId = "cmmclamu60000n1zyss460pap";

    console.log("DEBUG - Dados recebidos para gravação:", {
      userId,
      restaurantId,
      total,
      itemsCount: items?.length
    });

    // Criar pedido no Prisma ignorando a validação de JWT por enquanto
    const newOrder = await prisma.order.create({
      data: {
        userId: userId,
        restaurantId: restaurantId,
        total: Number(total),
        status: "RECEIVED",
        // Mapeamento garantido para evitar 'undefined' no unitPrice e productId
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: Number(item.quantity),
            unitPrice: Number(item.unitPrice),
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error: any) {
    console.error("ERRO NO SERVIDOR AO CRIAR PEDIDO:", error);
    return NextResponse.json(
      { error: "Erro interno ao criar pedido", details: error.message },
      { status: 500 }
    );
  }
}