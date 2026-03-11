import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("📦 Webhook recebido:", body);

    // 1. O Mercado Pago envia vários tipos de notificações. Só queremos as de pagamento.
    if (body.type && body.type !== "payment" && body.topic !== "payment") {
      return NextResponse.json({ received: true }, { status: 200 });
    }

    if (!body?.data?.id) {
      return NextResponse.json({ received: true }, { status: 200 });
    }

    const paymentId = body.data.id;

    // 2. Double Check: Busca o pagamento direto na API do Mercado Pago
    const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: {
        Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
      },
    });

    if (!mpResponse.ok) {
      throw new Error("Falha ao consultar pagamento no Mercado Pago");
    }

    const paymentData = await mpResponse.json();

    // 3. Se o status for aprovado, atualizamos nosso banco com BARREIRA ANTI-ZUMBI
    if (paymentData.status === "approved") {
      const orderId = paymentData.external_reference;

      if (orderId) {
        // # ALTERAÇÃO SOLICITADA: Só atualiza se o pedido estiver PENDENTE. Impede ressuscitar pedidos cancelados.
        const result = await prisma.order.updateMany({
          where: { 
            id: orderId,
            status: "PENDING" // <-- Trava de segurança principal
          },
          data: { status: "RECEIVED" },
        });

        if (result.count > 0) {
          console.log(`✅ Pedido ${orderId} aprovado via Webhook.`);
        } else {
          console.log(`⚠️ Webhook ignorado para o pedido ${orderId}. Ele já foi processado ou cancelado.`);
        }
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error: any) {
    console.error("❌ ERRO WEBHOOK MP:", error.message);
    // # ALTERAÇÃO SOLICITADA: Retornar 500 garante que o MP tente enviar novamente caso nosso banco caia.
    return NextResponse.json({ error: "Erro interno transiente" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: "Método não permitido" }, { status: 405 });
}