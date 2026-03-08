import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import webpush from "web-push";

// # ALTERAÇÃO SOLICITADA: Configuração do Web Push com as chaves do seu .env
webpush.setVapidDetails(
  "mailto:contato@theflamegrill.com", // Pode ser o seu email
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

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

    // # ALTERAÇÃO SOLICITADA: Atualiza o status e já puxa os celulares (pushSubscriptions) logados do cliente
    const updated = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        user: {
          include: { pushSubscriptions: true }
        }
      }
    });

    // Textos premium para cada mudança de status
    const statusMessages: Record<string, string> = {
      PREPARING: "👨‍🍳 Seu pedido foi para a grelha!",
      OUT_FOR_DELIVERY: "🛵 O motoboy está a caminho com seu lanche!",
      DONE: "✅ Pedido entregue. Bom apetite!",
      CANCELLED: "❌ Seu pedido foi cancelado."
    };

    const message = statusMessages[status];

    // Se houver uma mensagem para o status e o cliente tiver ativado notificações, dispara o Push!
    if (message && updated.user.pushSubscriptions.length > 0) {
      const pushPayload = JSON.stringify({
        title: "The Flame Grill 🔥",
        body: message,
        url: "/my-orders"
      });

      // Envia para todos os aparelhos que o cliente autorizou (PC, Celular, etc)
      await Promise.all(updated.user.pushSubscriptions.map(async (sub) => {
        try {
          await webpush.sendNotification({
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth }
          }, pushPayload);
        } catch (err: any) {
          // Se o erro for 404 ou 410, significa que o cliente bloqueou ou trocou de celular. Removemos do banco.
          if (err.statusCode === 404 || err.statusCode === 410) {
            await prisma.pushSubscription.delete({ where: { id: sub.id } });
          }
        }
      }));
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