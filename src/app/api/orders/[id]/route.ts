import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import webpush from "web-push";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; 
    const body = await request.json();
    const { status } = body;

    const validStatuses = ["RECEIVED", "PREPARING", "OUT_FOR_DELIVERY", "DONE", "CANCELLED"];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json({ error: "Status inválido" }, { status: 400 });
    }

    const updated = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        user: {
          include: { pushSubscriptions: true }
        }
      }
    });

    // # ALTERAÇÃO SOLICITADA: Adicionado a mensagem de push para o status RECEIVED
    const statusMessages: Record<string, string> = {
      RECEIVED: "🔥 Recebemos seu pedido e ele já está na fila!",
      PREPARING: "👨‍🍳 Seu pedido foi para a grelha!",
      OUT_FOR_DELIVERY: "🛵 O motoboy está a caminho com seu lanche!",
      DONE: "✅ Pedido entregue. Bom apetite!",
      CANCELLED: "❌ Seu pedido foi cancelado."
    };

    const message = statusMessages[status];

    if (message && updated.user.pushSubscriptions.length > 0) {
      const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      const privateKey = process.env.VAPID_PRIVATE_KEY;

      if (publicKey && privateKey) {
        webpush.setVapidDetails(
          "mailto:contato@theflamegrill.com", 
          publicKey,
          privateKey
        );

        const pushPayload = JSON.stringify({
          title: "The Flame Grill 🔥",
          body: message,
          url: "/my-orders"
        });

        await Promise.all(updated.user.pushSubscriptions.map(async (sub) => {
          try {
            await webpush.sendNotification({
              endpoint: sub.endpoint,
              keys: { p256dh: sub.p256dh, auth: sub.auth }
            }, pushPayload);
          } catch (err: any) {
            if (err.statusCode === 404 || err.statusCode === 410) {
              await prisma.pushSubscription.delete({ where: { id: sub.id } });
            }
          }
        }));
      } else {
        console.error("Faltam as chaves VAPID no ambiente.");
      }
    }

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("ERRO AO ATUALIZAR PEDIDO:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar pedido", details: error.message },
      { status: 500 }
    );
  }
}