import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MP_ACCESS_TOKEN || "",
  options: { timeout: 5000 } 
});

const payment = new Payment(client);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, total, address, notes, paymentMethod } = body;

    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("user_session");
    
    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.json({ error: "Você precisa estar logado para pedir." }, { status: 401 });
    }

    const userData = JSON.parse(sessionCookie.value);
    const userId = userData.id;
    
    // 1. CRIA O PEDIDO COMO "PENDENTE"
    const order = await prisma.order.create({
      data: {
        userId: userId,
        restaurantId: "cmmcpmk4q000087yw0dvvdonb", 
        total: total,
        address: address || "Retirada no Local", 
        notes: notes || "",
        paymentMethod: paymentMethod || "PIX",
        status: "PENDING",
        items: {
          create: items.map((item: any) => ({
            productId: item.productId || item.id,
            quantity: item.quantity,
            unitPrice: item.unitPrice || item.price,
            observations: item.customization
              ? [
                  item.customization.extras?.length ? `Extras: ${item.customization.extras.join(", ")}` : null,
                  item.customization.obs ? `Obs: ${item.customization.obs}` : null
                ].filter(Boolean).join(" | ") || null
              : null,
          })),
        },
      },
    });

    const transactionAmount = total; 
    const description = `Pedido #${order.id.slice(-6)} - The Flame Grill`;
    const expirationDate = new Date(Date.now() + 3 * 60 * 1000).toISOString();

    const result = await payment.create({
      body: {
        transaction_amount: transactionAmount,
        description: description,
        payment_method_id: "pix",
        external_reference: order.id, 
        notification_url: "https://theflamegrill.vercel.app/api/webhooks/mercadopago", 
        date_of_expiration: expirationDate,
        payer: {
          // ALTERAÇÃO SOLICITADA: E-mail genérico para evitar auto-bloqueio
          email: "cliente_desconhecido_teste_99@gmail.com", 
          first_name: userData.name?.split(' ')[0] || "Cliente",
          last_name: userData.name?.split(' ').slice(1).join(' ') || "The Flame Grill"
        }
      }
    });

    // # ALTERAÇÃO SOLICITADA: DEBUG LOG PARA VER NO PAINEL DA VERCEL
    console.log("DEBUG MERCADO PAGO:", {
      status: result.status,
      status_detail: result.status_detail, 
      id: result.id,
      amount: transactionAmount
    });

    if (result.status === "pending" || result.status === "created") {
      return NextResponse.json({
        order_id: order.id,
        payment_id: result.id,
        qr_code: result.point_of_interaction?.transaction_data?.qr_code,
        qr_code_base64: result.point_of_interaction?.transaction_data?.qr_code_base64,
        status: result.status
      });
    } else {
      // # ALTERAÇÃO: Retorna o status_detail no erro para ajudar no debug via tela se precisar
      return NextResponse.json({ 
        error: "Erro ao gerar PIX.", 
        detail: result.status_detail 
      }, { status: 400 });
    }

  } catch (error: any) {
    console.error("Erro Checkout:", error);
    return NextResponse.json({ error: "Erro interno no servidor." }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get("id");
    if (!paymentId) return NextResponse.json({ error: "ID ausente" }, { status: 400 });
    
    const result = await payment.get({ id: paymentId });
    
    // Mantido intacto: Se o PIX foi pago, atualiza o pedido para RECEIVED para apitar na cozinha!
    if (result.status === "approved" && result.external_reference) {
      await prisma.order.updateMany({
        where: { id: result.external_reference, status: "PENDING" },
        data: { status: "RECEIVED" }
      });
    }

    return NextResponse.json({ status: result.status, payment_id: result.id, external_reference: result.external_reference });
  } catch (error: any) {
    return NextResponse.json({ error: "Erro ao buscar PIX" }, { status: 500 });
  }
}

// # ALTERAÇÃO SOLICITADA: Nova rota DELETE para excluir o pedido pendente do banco de dados após 3 minutos ou cancelamento
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("orderId");
    
    if (!orderId) return NextResponse.json({ error: "ID do pedido ausente" }, { status: 400 });
    
    // Trava de segurança: Só exclui se o pedido ainda for PENDING (nunca vai excluir um pedido que o cliente já pagou)
    await prisma.order.deleteMany({
      where: { 
        id: orderId,
        status: "PENDING"
      }
    });

    return NextResponse.json({ success: true, message: "Pedido pendente removido." });
  } catch (error: any) {
    console.error("Erro ao deletar pedido expirado:", error);
    return NextResponse.json({ error: "Erro ao apagar pedido" }, { status: 500 });
  }
}