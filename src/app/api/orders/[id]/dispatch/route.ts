import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(
  request: Request,
  { params }: { params: { id: string } } // MUDOU AQUI de orderId para id
) {
  try {
    const { id } = params; // MUDOU AQUI
    const body = await request.json();
    const { courierName } = body;

    const deliveryToken = crypto.randomBytes(16).toString("hex");

    const updatedOrder = await prisma.order.update({
      where: { id: id }, // MUDOU AQUI
      data: {
        status: "OUT_FOR_DELIVERY",
        deliveryToken: deliveryToken,
        courierName: courierName || "Externo",
        dispatchedAt: new Date(),
      },
    });

    return NextResponse.json({
      message: "Pedido despachado com sucesso",
      token: deliveryToken,
      order: updatedOrder
    });

  } catch (error) {
    console.error("ERRO AO DESPACHAR:", error);
    return NextResponse.json(
      { error: "Erro ao processar o despacho." },
      { status: 500 }
    );
  }
}