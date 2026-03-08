import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt"; // Importando sua função oficial de leitura

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // 1. Lê o cookie oficial de autenticação
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // 2. Descriptografa o token para pegar o ID real do usuário
    let userId: string | null = null;
    try {
      const decoded = await verifyToken(token);
      userId = decoded.id;
    } catch (e) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }

    if (!userId) {
      return NextResponse.json({ error: "ID de usuário não encontrado" }, { status: 401 });
    }

    // 3. Busca no Prisma usando o ID descriptografado e ignorando os pendentes
    const orders = await prisma.order.findMany({
      where: { 
        userId,
        // # ALTERAÇÃO SOLICITADA: Ocultar os pedidos "fantasmas" (que ainda não foram pagos)
        status: {
          not: "PENDING"
        }
      }, 
      include: {
        items: {
          include: {
            product: true, 
          },
        },
      },
      orderBy: {
        createdAt: "desc", 
      },
    });

    return NextResponse.json(orders);
  } catch (error: any) {
    console.error("Erro ao buscar pedidos:", error);
    return NextResponse.json({ error: "Erro ao buscar pedidos" }, { status: 500 });
  }
}