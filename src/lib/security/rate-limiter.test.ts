import { describe, it, expect, beforeEach } from "vitest";
import { checkRateLimit, resetRateLimitStore } from "./rate-limiter";

describe("Rate Limiter Security Unit Tests", () => {
  beforeEach(() => {
    resetRateLimitStore();
  });

  it("should allow requests under the limit and track remaining quota", () => {
    const ip = "192.168.1.100";
    const options = { limit: 5, windowMs: 10000 };

    const res1 = checkRateLimit(ip, options);
    expect(res1.allowed).toBe(true);
    expect(res1.remaining).toBe(4);

    const res2 = checkRateLimit(ip, options);
    expect(res2.allowed).toBe(true);
    expect(res2.remaining).toBe(3);
  });

  it("should block requests when rate limit is exceeded", () => {
    const ip = "192.168.1.200";
    const options = { limit: 3, windowMs: 10000 };

    checkRateLimit(ip, options);
    checkRateLimit(ip, options);
    checkRateLimit(ip, options);

    const blocked = checkRateLimit(ip, options);
    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
  });

  it("should isolate limits between different IP keys", () => {
    const ipA = "10.0.0.1";
    const ipB = "10.0.0.2";
    const options = { limit: 2, windowMs: 10000 };

    checkRateLimit(ipA, options);
    checkRateLimit(ipA, options);

    expect(checkRateLimit(ipA, options).allowed).toBe(false);
    expect(checkRateLimit(ipB, options).allowed).toBe(true);
  });
});
