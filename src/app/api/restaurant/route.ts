import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const token = req.headers.get("authorization")?.split(" ")[1];

  if (!token) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const decoded = verifyToken(token);

  if (decoded.role !== "ADMIN") {
    return NextResponse.json({ error: "Apenas ADMIN pode criar restaurante" }, { status: 403 });
  }

  const { name, description, phone } = await req.json();

  const existingRestaurant = await prisma.restaurant.findUnique({
    where: { ownerId: decoded.id },
  });

  if (existingRestaurant) {
    return NextResponse.json({ error: "Você já possui restaurante" }, { status: 400 });
  }

  const restaurant = await prisma.restaurant.create({
    data: {
      name,
      description,
      phone,
      ownerId: decoded.id,
    },
  });

  return NextResponse.json(restaurant);
}