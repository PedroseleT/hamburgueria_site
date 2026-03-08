import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// # ALTERAÇÃO SOLICITADA: Exportação explícita do método POST para evitar Erro 405
export async function POST(request: Request) {
  try {
    // 1. Tenta ler o corpo da requisição
    const body = await request.json();
    console.log("📦 Webhook recebido:", body);

    // 2. O Mercado Pago às vezes envia testes sem ID. Respondemos 200 para validar a rota.
    if (!body?.data?.id) {
      return NextResponse.json({ received: true }, { status: 200 });
    }

    const paymentId = body.data.id;

    // 3. Double Check: Busca o pagamento direto na API do Mercado Pago
    // Isso é a segurança máxima: não acreditamos no que o Webhook diz, nós perguntamos pro MP.
    const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: {
        Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
      },
    });

    if (!mpResponse.ok) {
      throw new Error("Falha ao consultar pagamento no Mercado Pago");
    }

    const paymentData = await mpResponse.json();

    // 4. Se o status for aprovado, atualizamos nosso banco
    if (paymentData.status === "approved") {
      const orderId = paymentData.external_reference;

      if (orderId) {
        await prisma.order.update({
          where: { id: orderId },
          data: { status: "RECEIVED" },
        });
        console.log(`✅ Pedido ${orderId} aprovado via Webhook.`);
      }
    }

    // O Mercado Pago EXIGE um status 200 ou 201 como resposta, senão ele fica enviando de novo.
    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error: any) {
    console.error("❌ ERRO WEBHOOK MP:", error.message);
    // Retornamos 200 mesmo no erro para evitar loop de retentativas do MP que travam o servidor
    return NextResponse.json({ error: "Erro processado" }, { status: 200 });
  }
}

// # ALTERAÇÃO SOLICITADA: Bloqueia outros métodos para aumentar a segurança
export async function GET() {
  return NextResponse.json({ error: "Método não permitido" }, { status: 405 });
}