import { NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";

// Inicializa o Mercado Pago (garanta que a variável está no seu .env)
const client = new MercadoPagoConfig({ 
  accessToken: process.env.MP_ACCESS_TOKEN || "",
  options: { timeout: 5000 } 
});

const payment = new Payment(client);

// ROTA PARA CRIAR A COBRANÇA PIX
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, total } = body;

    // ALTERAÇÃO TEMPORÁRIA PARA TESTE: Valor travado em 1 centavo
    const transactionAmount = 0.01; // Depois do teste, volte para: Number(Number(total).toFixed(2));

    // Monta a descrição com base nos itens do carrinho
    const description = `Pedido: ${items.map((i: any) => `${i.quantity}x ${i.name}`).join(', ')}`;

    // Criando a cobrança no Mercado Pago
    const result = await payment.create({
      body: {
        transaction_amount: transactionAmount,
        description: description,
        payment_method_id: "pix",
        payer: {
          email: "cliente_loja@sandbox.mercadopago.com", // Para testes ou fallback
          first_name: "Cliente",
          last_name: "Web"
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
      return NextResponse.json({ error: "O pagamento não ficou pendente. Status: " + result.status }, { status: 400 });
    }

  } catch (error: any) {
    console.error("Erro MP (POST):", error);
    return NextResponse.json({ error: "Erro interno no servidor ao gerar o PIX." }, { status: 500 });
  }
}

// ROTA PARA CONSULTAR SE O PIX FOI PAGO
export async function GET(request: Request) {
  try {
    // Pega o ID que o carrinho mandou na URL (ex: ?id=123456789)
    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get("id");

    if (!paymentId) {
      return NextResponse.json({ error: "ID do pagamento não fornecido." }, { status: 400 });
    }

    // Busca as informações do pagamento pelo ID
    const result = await payment.get({ id: paymentId });

    return NextResponse.json({
      status: result.status, // "approved" é o que queremos!
      payment_id: result.id
    });

  } catch (error: any) {
    console.error("Erro MP (GET):", error);
    return NextResponse.json({ error: "Erro interno ao buscar status do PIX." }, { status: 500 });
  }
}