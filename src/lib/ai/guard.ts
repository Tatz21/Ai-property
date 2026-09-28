/**
 * AI Security & Prompt Injection Defense Guard
 * Sanitizes input strings and detects jailbreak/override attack patterns.
 */

export interface SecurityCheckResult {
  isSafe: boolean;
  sanitizedText: string;
  flaggedPatterns: string[];
  riskLevel: "low" | "medium" | "high";
}

const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior)\s+(instructions|prompts|rules)/i,
  /disregard\s+(all\s+)?(previous|prior)\s+(rules|guidelines|instructions)/i,
  /you\s+are\s+now\s+(unrestricted|in\s+god\s+mode|dan|jailbroken)/i,
  /reveal\s+(your\s+)?(system\s+prompt|hidden\s+instructions|developer\s+mode)/i,
  /output\s+the\s+initial\s+prompt/i,
  /bypass\s+all\s+(filters|rules|safety)/i,
  /override\s+system\s+directive/i,
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
];

export function inspectAndSanitizePrompt(rawInput: string): SecurityCheckResult {
  if (!rawInput || typeof rawInput !== "string") {
    return {
      isSafe: true,
      sanitizedText: "",
      flaggedPatterns: [],
      riskLevel: "low",
    };
  }

  // 1. Strip raw executable HTML/script tags
  let cleaned = rawInput.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
  cleaned = cleaned.trim().slice(0, 2000); // Strict length limit

  const flaggedPatterns: string[] = [];

  // 2. Pattern matching against injection indicators
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(rawInput)) {
      flaggedPatterns.push(pattern.toString());
    }
  }

  const isSafe = flaggedPatterns.length === 0;
  const riskLevel = flaggedPatterns.length > 1 ? "high" : flaggedPatterns.length === 1 ? "medium" : "low";

  return {
    isSafe,
    sanitizedText: cleaned,
    flaggedPatterns,
    riskLevel,
  };
}
