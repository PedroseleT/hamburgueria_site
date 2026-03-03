import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "E-mail é obrigatório" }, { status: 400 });

    const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    const mailOptions = {
      from: `"The Flame Grill" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🔑 Seu código de acesso - The Flame Grill",
      html: `
        <!DOCTYPE html>
        <html lang="pt-br" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta name="color-scheme" content="dark only">
          <meta name="supported-color-schemes" content="dark only">
          <style>
            /* Remove espaços extras aplicados por alguns clientes de e-mail */
            body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
            table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
            img { -ms-interpolation-mode: bicubic; }

            /* Hack para Gmail não inverter as cores no Modo Escuro do Celular */
            u + .body .gmail-blend-screen { background: #000000; mix-blend-mode: screen; }
            u + .body .gmail-blend-difference { background: #000000; mix-blend-mode: difference; }
          </style>
        </head>
        <body class="body" style="margin: 0 !important; padding: 0 !important; background-color: #000000 !important;">
          <center style="width: 100%; background-color: #000000 !important;">
            <div style="background-color: #000000 !important; padding: 0px;">
              
              <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 500px; background-color: #0a0a0a !important; border: 2px solid #b91c1c !important; border-radius: 20px; margin-top: 40px; margin-bottom: 40px;">
                <tr>
                  <td align="center" style="padding: 50px 20px; background-color: #0a0a0a !important; border-radius: 20px;">
                    
                    <div style="font-size: 50px; margin-bottom: 10px;">🔥</div>
                    
                    <h1 style="color: #ffffff !important; font-family: Arial, sans-serif; font-size: 28px; margin: 0; font-weight: 900; text-transform: uppercase;">
                      THE FLAME GRILL
                    </h1>
                    
                    <p style="color: #b91c1c !important; font-family: Arial, sans-serif; font-size: 12px; font-weight: bold; letter-spacing: 3px; margin: 10px 0 30px 0;">
                      O SABOR DO FOGO NA SUA TELA
                    </p>

                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #000000 !important; border: 1px solid #1a1a1a; border-radius: 12px;">
                      <tr>
                        <td align="center" style="padding: 30px; background-color: #000000 !important; border-radius: 10px;">
                          <p style="color: #888888 !important; font-size: 11px; margin-bottom: 15px; text-transform: uppercase;">SEU CÓDIGO:</p>
                          <span style="color: #b91c1c !important; font-family: monospace; font-size: 48px; font-weight: bold; letter-spacing: 10px;">
                            ${verificationCode}
                          </span>
                        </td>
                      </tr>
                    </table>

                    <p style="color: #ffffff !important; font-family: Arial, sans-serif; font-size: 14px; margin-top: 35px; line-height: 1.5;">
                      Copie o código acima para confirmar sua identidade no <br>
                      <strong style="color: #b91c1c !important;">The Flame Grill</strong>.
                    </p>

                    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #1a1a1a;">
                      <p style="color: #444444 !important; font-size: 10px; text-transform: uppercase;">
                        © 2026 THE FLAME GRILL • PREMIUM EXPERIENCE
                      </p>
                    </div>

                  </td>
                </tr>
              </table>

            </div>
          </center>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    return NextResponse.json({ code: verificationCode });
  } catch (error) {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}