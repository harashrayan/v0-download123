interface RateLimitEntry {
  count: number
  resetTime: number
}

class RateLimiter {
  private requests = new Map<string, RateLimitEntry>()
  private readonly maxRequests: number
  private readonly windowMs: number

  constructor(maxRequests = 100, windowMs: number = 15 * 60 * 1000) {
    this.maxRequests = maxRequests
    this.windowMs = windowMs

    // Clean up expired entries every 5 minutes
    setInterval(() => this.cleanup(), 5 * 60 * 1000)
  }

  check(identifier: string): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now()
    const entry = this.requests.get(identifier)

    if (!entry || now > entry.resetTime) {
      // First request or window expired
      const resetTime = now + this.windowMs
      this.requests.set(identifier, { count: 1, resetTime })

      return {
        allowed: true,
        remaining: this.maxRequests - 1,
        resetTime,
      }
    }

    if (entry.count >= this.maxRequests) {
      // Rate limit exceeded
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime,
      }
    }

    // Increment count
    entry.count++
    this.requests.set(identifier, entry)

    return {
      allowed: true,
      remaining: this.maxRequests - entry.count,
      resetTime: entry.resetTime,
    }
  }

  private cleanup() {
    const now = Date.now()
    for (const [key, entry] of this.requests.entries()) {
      if (now > entry.resetTime) {
        this.requests.delete(key)
      }
    }
    console.log(`[v0] Rate limiter cleanup: ${this.requests.size} active entries`)
  }

  reset(identifier: string) {
    this.requests.delete(identifier)
  }

  getStats() {
    return {
      activeEntries: this.requests.size,
      maxRequests: this.maxRequests,
      windowMs: this.windowMs,
    }
  }
}

// Create global rate limiter instance
export const rateLimiter = new RateLimiter()

// Helper function to get client identifier
export function getClientIdentifier(request?: Request): string {
  if (typeof window !== "undefined") {
    // Client-side: use a combination of user agent and timestamp
    return `client-${navigator.userAgent.slice(0, 50)}-${Math.floor(Date.now() / (60 * 1000))}`
  }

  if (request) {
    // Server-side: use IP address or user agent
    const forwarded = request.headers.get("x-forwarded-for")
    const ip = forwarded ? forwarded.split(",")[0] : "unknown"
    return `server-${ip}`
  }

  return "unknown"
}
