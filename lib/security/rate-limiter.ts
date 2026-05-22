const requests = new Map<string, { count: number; resetAt: number }>();

/**
 * In-process rate limiter for the scrape API route.
 * NOTE: Resets on cold start — sufficient for a portfolio demo.
 * Production deployments should use Redis or Vercel KV.
 */
export function checkRateLimit(ip: string, limit = 20, windowMs = 60_000): boolean {
  const now = Date.now();
  const current = requests.get(ip);

  if (!current || current.resetAt < now) {
    requests.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (current.count >= limit) return false;

  current.count += 1;
  return true;
}
