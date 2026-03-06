import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";

// ── GET — lista todos os pedidos (admin) ──────────────────────────────────────
export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { name: true, email: true, phone: true },
        },
        items: {
          include: {
            product: {
              select: { name: true },
            },
          },
        },
      },
    });
    return NextResponse.json(orders);
  } catch (error: any) {
    console.error("ERRO AO BUSCAR PEDIDOS:", error);
    return NextResponse.json(
      { error: "Erro ao buscar pedidos", details: error.message },
      { status: 500 }
    );
  }
}

// ── POST — cria um novo pedido ────────────────────────────────────────────────
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, total, restaurantId, paymentMethod, notes } = body;

    // Lê o userId do cookie auth_token
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    let userId: string | null = null;

    if (token) {
      try {
        const decoded = await verifyToken(token);
        userId = decoded.id;
      } catch {
        userId = null;
      }
    }

    // Fallback para testes — remova quando auth estiver 100%
    if (!userId) userId = "cmmclamu60000n1zyss460pap";

    const newOrder = await prisma.order.create({
      data: {
        userId,
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
    return NextResponse.json(
      { error: "Erro interno ao criar pedido", details: error.message },
      { status: 500 }
    );
  }
}