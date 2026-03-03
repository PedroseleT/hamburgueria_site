import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();

    // CONFIGURAÇÃO DO TRANSPORTE (Exemplo com Gmail/Outlook)
    // Para produção, use variáveis de ambiente (.env)
    const transporter = nodemailer.createTransport({
      service: "gmail", 
      auth: {
        user: process.env.EMAIL_USER, // Seu e-mail (ex: contato@hamburgueria.com)
        pass: process.env.EMAIL_PASS, // Sua senha de app
      },
    });

    const mailOptions = {
      from: '"Burguer Art" <seu-email@gmail.com>',
      to: email,
      subject: "🔑 Seu código de acesso - Burguer Art",
      html: `
        <div style="font-family: sans-serif; background-color: #000; color: #fff; padding: 40px; border-radius: 10px; text-align: center;">
          <h1 style="color: #b91c1c; font-size: 30px;">BEM-VINDO!</h1>
          <p style="font-size: 16px; color: #ccc;">Use o código abaixo para validar seu e-mail e finalizar o cadastro:</p>
          <div style="background: #111; padding: 20px; border: 2px dashed #b91c1c; display: inline-block; margin: 20px 0;">
            <span style="font-size: 40px; font-weight: bold; letter-spacing: 10px; color: #fff;">${verificationCode}</span>
          </div>
          <p style="font-size: 12px; color: #666;">Se não foi você quem solicitou, ignore este e-mail.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ code: verificationCode });
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error);
    return NextResponse.json({ error: "Erro ao enviar e-mail de verificação" }, { status: 500 });
  }
}