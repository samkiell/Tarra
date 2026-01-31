import { LRUCache } from "lru-cache";

/**
 * Rate Limiter for API Routes
 * 
 * Logic:
 * Uses an in-memory LRU cache to track request counts per IP.
 * Default: 5 attempts per 1 hour.
 */

const options = {
  max: 500, // Max users/IPs to track
  ttl: 1000 * 60 * 60, // 1 hour TTL
};

const tokenCache = new LRUCache(options);

export async function rateLimit(ip: string, limit: number = 50) {
  const currentUsage = (tokenCache.get(ip) as number) || 0;
  
  if (currentUsage >= limit) {
    return { isLimited: true, usage: currentUsage };
  }
  
  tokenCache.set(ip, currentUsage + 1);
  return { isLimited: false, usage: currentUsage + 1 };
}
