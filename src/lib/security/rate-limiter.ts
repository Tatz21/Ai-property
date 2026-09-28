/**
 * Sliding Window In-Memory Rate Limiter
 * Enforces per-IP and per-user request limits for critical API routes.
 */

interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitStore = new Map<string, RateLimitRecord>();

export interface RateLimitOptions {
  limit: number;
  windowMs: number;
}

export function checkRateLimit(key: string, options: RateLimitOptions = { limit: 60, windowMs: 60000 }) {
  const now = Date.now();
  const windowStart = now - options.windowMs;

  const record = rateLimitStore.get(key) || { timestamps: [] };

  // Filter timestamps within current sliding window
  const validTimestamps = record.timestamps.filter((ts) => ts > windowStart);

  if (validTimestamps.length >= options.limit) {
    const oldestTimestamp = validTimestamps[0];
    const retryAfterSeconds = Math.ceil((oldestTimestamp + options.windowMs - now) / 1000);

    return {
      allowed: false,
      limit: options.limit,
      remaining: 0,
      retryAfterSeconds: Math.max(1, retryAfterSeconds),
    };
  }

  validTimestamps.push(now);
  rateLimitStore.set(key, { timestamps: validTimestamps });

  return {
    allowed: true,
    limit: options.limit,
    remaining: options.limit - validTimestamps.length,
    retryAfterSeconds: 0,
  };
}

export function resetRateLimitStore() {
  rateLimitStore.clear();
}
