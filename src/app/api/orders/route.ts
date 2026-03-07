import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true, phone: true } },
        items: { include: { product: { select: { name: true } } } },
      },
    });
    return NextResponse.json(orders);
  } catch (error: any) {
    return NextResponse.json({ error: "Erro ao buscar pedidos" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // # ALTERAÇÃO: Agora aceitamos o userId que vier no body (do Mercado Pago)
    const { items, total, restaurantId, paymentMethod, notes, userId: bodyUserId } = body;

    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    let userId: string | null = null;

    if (token) {
      try {
        const decoded = await verifyToken(token);
        userId = decoded.id;
      } catch { userId = null; }
    }

    // # PRIORIDADE DE ID: 1. Token real | 2. ID enviado pelo Checkout | 3. Erro (Segurança)
    const finalUserId = userId || bodyUserId;

    if (!finalUserId) {
      return NextResponse.json({ error: "Usuário não identificado" }, { status: 401 });
    }

    const newOrder = await prisma.order.create({
      data: {
        userId: finalUserId,
        restaurantId,
        total: Number(total),
        paymentMethod: paymentMethod ?? "PIX",
        notes: notes ?? null,
        status: "RECEIVED",
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: Number(item.quantity),
            unitPrice: Number(item.unitPrice),
          })),
        },
      },
      include: { items: true },
    });

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error: any) {
    console.error("ERRO AO CRIAR PEDIDO:", error);
    return NextResponse.json({ error: "Erro interno ao criar pedido" }, { status: 500 });
  }
}