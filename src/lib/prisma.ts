import { PrismaClient } from '@prisma/client'

// 1. Tipagem para o objeto global não dar erro de "property prisma does not exist"
interface CustomGlobal extends Global {
  prisma: PrismaClient
}

declare const global: CustomGlobal

// 2. Criar a instância de forma segura
export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ['error'],
  })

// 3. Em desenvolvimento, salva no global para não estourar o limite de conexões do Neon
if (process.env.NODE_ENV !== 'production') global.prisma = prisma