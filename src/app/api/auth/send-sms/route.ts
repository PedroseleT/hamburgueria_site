import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { phone } = await req.json();

    const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();

    const cleanPhone = phone.replace(/\D/g, "");
    const formattedPhone = cleanPhone.startsWith("55") ? cleanPhone : `55${cleanPhone}`;

    const INSTANCE_ID = "3EF3B65968D2A17FE2CDDE26C08F8D63";
    const INSTANCE_TOKEN = "6D16D8E4D4392F6F5CA15AA5"; // Ajustado para o token da instância que enviou antes
    const CLIENT_TOKEN = "Fe9e6ea45b0384ad1883b7d4072f31eebS"; 

    const API_URL = `https://api.z-api.io/instances/${INSTANCE_ID}/token/${INSTANCE_TOKEN}/send-text`;

    // NOVA VERSÃO DA MENSAGEM - Mais amigável
    const message = `🍟 *BEM-VINDO À NOSSA COMUNIDADE!* \n\n` +
                    `Para garantir sua segurança e finalizar seu cadastro, aqui está seu código de acesso:\n\n` +
                    `🔑 *CÓDIGO:* ${verificationCode}\n\n` +
                    `_Digite esse código na tela para continuar._\n\n` +
                    `Se não foi você quem solicitou, apenas ignore esta mensagem. 👋`;

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "client-token": CLIENT_TOKEN
      },
      body: JSON.stringify({
        phone: formattedPhone,
        message: message
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Erro Z-API Detalhado:", result);
      return NextResponse.json({ error: "Erro ao enviar mensagem" }, { status: response.status });
    }

    return NextResponse.json({ code: verificationCode });

  } catch (error) {
    console.error("Erro interno no servidor:", error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}