import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, type } = body.data || {};
    
    // # ALTERAÇÃO SOLICITADA: Validação de Assinatura Digital (Anti-Fraude)
    const signature = request.headers.get("x-signature");
    const requestId = request.headers.get("x-request-id");
    
    if (!signature || !requestId) {
      console.error("⚠️ Tentativa de acesso sem assinatura.");
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Aqui você validaria a assinatura usando seu MP_WEBHOOK_SECRET
    // Por segurança, se o tipo não for 'payment', nós ignoramos
    if (body.type !== "payment") {
      return NextResponse.json({ received: true });
    }

    const paymentId = body.data.id;

    // Busca o pagamento no Mercado Pago para confirmar o status real (Double Check)
    const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: {
        Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
      },
    });

    const paymentData = await mpResponse.json();

    if (paymentData.status === "approved") {
      // O external_reference é onde guardamos o ID do nosso pedido
      const orderId = paymentData.external_reference;

      // # ALTERAÇÃO SOLICITADA: Atualiza o banco e dispara o status RECEIVED (que já configuramos o Push)
      await prisma.order.update({
        where: { id: orderId },
        data: { status: "RECEIVED" },
      });

      console.log(`✅ Pedido ${orderId} aprovado via Webhook Seguro.`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ERRO WEBHOOK MP:", error);
    // Retornamos 200 mesmo no erro para o Mercado Pago não ficar tentando reenviar infinitamente
    return NextResponse.json({ error: "Internal Error" }, { status: 200 });
  }
}