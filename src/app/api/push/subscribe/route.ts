import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";

export async function POST(req: Request) {
  try {
    const subscription = await req.json();
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const decoded = await verifyToken(token);
    if (!decoded.id) return NextResponse.json({ error: "ID inválido" }, { status: 401 });

    // Salva o telemóvel do cliente (ou atualiza se já existir)
    await prisma.pushSubscription.upsert({
      where: { endpoint: subscription.endpoint },
      create: {
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
        userId: decoded.id,
      },
      update: {
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
        userId: decoded.id,
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro no Push Subscription:", error);
    return NextResponse.json({ error: "Erro ao salvar subscrição" }, { status: 500 });
  }
}