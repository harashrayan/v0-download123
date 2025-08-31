import { z } from "zod"

// Input sanitization schemas
export const sanitizedStringSchema = z
  .string()
  .trim()
  .transform((str) => str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ""))
  .transform((str) => str.replace(/javascript:/gi, ""))
  .transform((str) => str.replace(/on\w+\s*=/gi, ""))

export const sanitizedTextSchema = z
  .string()
  .trim()
  .max(10000, "Text content too long")
  .transform((str) => str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ""))

// Content validation schemas
export const articleTitleSchema = z
  .string()
  .min(3, "Title must be at least 3 characters")
  .max(200, "Title must be less than 200 characters")
  .pipe(sanitizedStringSchema)

export const keywordSchema = z
  .string()
  .min(1, "Keyword cannot be empty")
  .max(100, "Keyword too long")
  .pipe(sanitizedStringSchema)

export const contentSchema = z.string().max(50000, "Content too long").pipe(sanitizedTextSchema)

// Security utilities
export class SecurityUtils {
  // Validate and sanitize user input
  static validateInput<T>(schema: z.ZodSchema<T>, input: unknown): { success: boolean; data?: T; error?: string } {
    try {
      const result = schema.safeParse(input)
      if (!result.success) {
        const errors = result.error.errors.map((err) => err.message).join(", ")
        return { success: false, error: errors }
      }
      return { success: true, data: result.data }
    } catch (error) {
      return { success: false, error: "Validation failed" }
    }
  }

  // Check for suspicious patterns
  static detectSuspiciousContent(content: string): { suspicious: boolean; reasons: string[] } {
    const reasons: string[] = []

    // Check for script tags
    if (/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(content)) {
      reasons.push("Contains script tags")
    }

    // Check for javascript: URLs
    if (/javascript:/gi.test(content)) {
      reasons.push("Contains javascript: URLs")
    }

    // Check for event handlers
    if (/on\w+\s*=/gi.test(content)) {
      reasons.push("Contains event handlers")
    }

    // Check for excessive length
    if (content.length > 100000) {
      reasons.push("Content too long")
    }

    // Check for repeated patterns (potential spam)
    const words = content.toLowerCase().split(/\s+/)
    const wordCount = new Map<string, number>()
    for (const word of words) {
      wordCount.set(word, (wordCount.get(word) || 0) + 1)
    }

    for (const [word, count] of wordCount.entries()) {
      if (word.length > 3 && count > words.length * 0.1) {
        reasons.push("Excessive word repetition detected")
        break
      }
    }

    return {
      suspicious: reasons.length > 0,
      reasons,
    }
  }

  // Generate secure random strings
  static generateSecureId(length = 16): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    let result = ""

    if (typeof window !== "undefined" && window.crypto) {
      // Browser environment
      const array = new Uint8Array(length)
      window.crypto.getRandomValues(array)
      for (let i = 0; i < length; i++) {
        result += chars[array[i] % chars.length]
      }
    } else {
      // Node.js environment
      const crypto = require("crypto")
      const bytes = crypto.randomBytes(length)
      for (let i = 0; i < length; i++) {
        result += chars[bytes[i] % chars.length]
      }
    }

    return result
  }

  // Validate API responses
  static validateApiResponse(response: unknown): { valid: boolean; error?: string } {
    if (!response || typeof response !== "object") {
      return { valid: false, error: "Invalid response format" }
    }

    const obj = response as Record<string, unknown>

    // Check for common error indicators
    if (obj.error) {
      return { valid: false, error: String(obj.error) }
    }

    // Check for required fields based on response type
    if ("article" in obj && typeof obj.article !== "string") {
      return { valid: false, error: "Invalid article content" }
    }

    if ("keywords" in obj && !Array.isArray(obj.keywords)) {
      return { valid: false, error: "Invalid keywords format" }
    }

    return { valid: true }
  }

  // Log security events
  static logSecurityEvent(event: string, details: Record<string, unknown>) {
    const timestamp = new Date().toISOString()
    const logEntry = {
      timestamp,
      event,
      details,
      userAgent: typeof window !== "undefined" ? navigator.userAgent : "server",
    }

    console.warn("[v0] Security Event:", logEntry)

    // In production, you might want to send this to a security monitoring service
    if (process.env.NODE_ENV === "production") {
      // TODO: Send to security monitoring service
    }
  }
}
