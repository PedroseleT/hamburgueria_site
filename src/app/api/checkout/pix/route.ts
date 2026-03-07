import { NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { cookies } from "next/headers"; // # ADICIONADO: Para identificar o usuário

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MP_ACCESS_TOKEN || "",
  options: { timeout: 5000 } 
});

const payment = new Payment(client);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, total } = body;

    // # ALTERAÇÃO SOLICITADA: Captura o ID do usuário logado através do cookie
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("user_session");
    
    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.json({ error: "Você precisa estar logado para pedir." }, { status: 401 });
    }

    const userId = sessionCookie.value;

    const transactionAmount = 0.01; 
    const description = `Pedido: ${items.map((i: any) => `${i.quantity}x ${i.name}`).join(', ')}`;

    // Criando a cobrança no Mercado Pago
    const result = await payment.create({
      body: {
        transaction_amount: transactionAmount,
        description: description,
        payment_method_id: "pix",
        // # O SEGREDO ESTÁ AQUI: Enviamos o userId para o MP
        external_reference: userId, 
        payer: {
          email: "cliente_loja@sandbox.mercadopago.com", 
          first_name: "Cliente",
          last_name: "Web"
        },
        // Metadata ajuda a guardar informações extras que o Webhook pode ler
        metadata: {
          user_id: userId
        }
      }
    });

    if (result.status === "pending" || result.status === "created") {
      return NextResponse.json({
        payment_id: result.id,
        qr_code: result.point_of_interaction?.transaction_data?.qr_code,
        qr_code_base64: result.point_of_interaction?.transaction_data?.qr_code_base64,
        status: result.status
      });
    } else {
      return NextResponse.json({ error: "O pagamento não ficou pendente." }, { status: 400 });
    }

  } catch (error: any) {
    console.error("Erro MP (POST):", error);
    return NextResponse.json({ error: "Erro interno no servidor ao gerar o PIX." }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get("id");

    if (!paymentId) {
      return NextResponse.json({ error: "ID do pagamento não fornecido." }, { status: 400 });
    }

    const result = await payment.get({ id: paymentId });

    return NextResponse.json({
      status: result.status,
      payment_id: result.id,
      // # Opcional: retornar o external_reference para confirmar o dono
      external_reference: result.external_reference 
    });

  } catch (error: any) {
    console.error("Erro MP (GET):", error);
    return NextResponse.json({ error: "Erro interno ao buscar status do PIX." }, { status: 500 });
  }
}