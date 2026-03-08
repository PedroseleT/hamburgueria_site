import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// # ALTERAÇÃO SOLICITADA: API de consulta pública via Token para o Entregador
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ error: "Token não fornecido" }, { status: 400 });
    }

    // Procura o pedido pelo token e traz os dados do cliente e itens
    const order = await prisma.order.findUnique({
      where: { deliveryToken: token },
      include: {
        user: {
          select: {
            name: true,
            phone: true,
          }
        },
        items: {
          include: {
            product: true
          }
        }
      }
    });

    if (!order) {
      return NextResponse.json({ error: "Link de entrega inválido ou expirado" }, { status: 404 });
    }

    // Se o pedido já foi finalizado, não mostramos os dados por privacidade
    if (order.status === "DONE" || order.status === "CANCELLED") {
      return NextResponse.json({ error: "Este pedido já foi concluído" }, { status: 410 });
    }

    return NextResponse.json(order);

  } catch (error) {
    console.error("ERRO AO BUSCAR INFO DE ENTREGA:", error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}