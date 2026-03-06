import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status } = body;

    const validStatuses = ["RECEIVED", "PREPARING", "OUT_FOR_DELIVERY", "DONE", "CANCELLED"];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Status inválido" },
        { status: 400 }
      );
    }

    const updated = await prisma.order.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("ERRO AO ATUALIZAR PEDIDO:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar pedido", details: error.message },
      { status: 500 }
    );
  }
}