import { LRUCache } from 'lru-cache';

// Configuração: Máximo de 500 IPs na memória, cada um expira em 1 minuto
const tokenCache = new LRUCache<string, number>({
  max: 500,
  ttl: 60 * 1000, 
});

export async function rateLimit(ip: string, limit: number = 5) {
  const currentUsage = tokenCache.get(ip) || 0;
  
  if (currentUsage >= limit) {
    return { success: false };
  }

  tokenCache.set(ip, currentUsage + 1);
  return { success: true };
}