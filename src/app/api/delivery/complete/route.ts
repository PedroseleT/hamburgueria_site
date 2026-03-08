import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json({ error: "Token inválido" }, { status: 400 });
    }

    // Procura o pedido pelo token secreto
    const order = await prisma.order.findUnique({
      where: { deliveryToken: token }
    });

    if (!order) {
      return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 });
    }

    // Atualiza para concluído e limpa o token (opcional, para o link expirar após o uso)
    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: "DONE",
        completedAt: new Date(),
        // deliveryToken: null // Descomente se quiser que o link pare de funcionar após a entrega
      },
    });

    return NextResponse.json({ message: "Entrega finalizada com sucesso!" });

  } catch (error) {
    return NextResponse.json({ error: "Erro ao finalizar entrega" }, { status: 500 });
  }
}