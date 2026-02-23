import { NextResponse } from 'next/server';

export async function GET() {
  const databaseUrl = process.env.DATABASE_URL;
  const jwtSecret = process.env.JWT_SECRET;

  return NextResponse.json({
    hasDatabaseUrl: !!databaseUrl,
    databaseUrlPrefix: databaseUrl ? databaseUrl.split(':')[0] : "não encontrado",
    hasJwtSecret: !!jwtSecret,
    nodeEnv: process.env.NODE_ENV
  });
}