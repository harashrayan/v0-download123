import { z } from "zod"

const envSchema = z.object({
  // AI Configuration
  GEMINI_API_KEY: z.string().min(1, "GEMINI_API_KEY is required for AI functionality"),

  // Next.js Environment
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),

  // Optional environment variables
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  NEXT_PUBLIC_VERCEL_URL: z.string().optional(),

  // Rate limiting (optional)
  RATE_LIMIT_MAX: z.string().transform(Number).pipe(z.number().positive()).default("100"),
  RATE_LIMIT_WINDOW: z.string().transform(Number).pipe(z.number().positive()).default("900000"), // 15 minutes
})

export type Env = z.infer<typeof envSchema>

class EnvironmentValidator {
  private static instance: EnvironmentValidator
  private _env: Env | null = null
  private _validationErrors: string[] = []

  private constructor() {}

  static getInstance(): EnvironmentValidator {
    if (!EnvironmentValidator.instance) {
      EnvironmentValidator.instance = new EnvironmentValidator()
    }
    return EnvironmentValidator.instance
  }

  validate(): { success: boolean; env?: Env; errors?: string[] } {
    try {
      console.log("[v0] Validating environment variables...")

      const result = envSchema.safeParse(process.env)

      if (!result.success) {
        this._validationErrors = result.error.errors.map((err) => `${err.path.join(".")}: ${err.message}`)

        console.error("[v0] Environment validation failed:", this._validationErrors)
        return { success: false, errors: this._validationErrors }
      }

      this._env = result.data
      console.log("[v0] Environment validation successful")

      // Log non-sensitive environment info
      console.log("[v0] Environment:", {
        NODE_ENV: this._env.NODE_ENV,
        hasGeminiKey: !!this._env.GEMINI_API_KEY,
        rateLimit: {
          max: this._env.RATE_LIMIT_MAX,
          window: this._env.RATE_LIMIT_WINDOW,
        },
      })

      return { success: true, env: this._env }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown validation error"
      this._validationErrors = [errorMessage]
      console.error("[v0] Environment validation error:", error)
      return { success: false, errors: this._validationErrors }
    }
  }

  get env(): Env {
    if (!this._env) {
      const result = this.validate()
      if (!result.success) {
        throw new Error(`Environment validation failed: ${result.errors?.join(", ")}`)
      }
      this._env = result.env!
    }
    return this._env
  }

  get errors(): string[] {
    return [...this._validationErrors]
  }

  isValid(): boolean {
    return this._env !== null && this._validationErrors.length === 0
  }

  // Security helpers
  isDevelopment(): boolean {
    return this.env.NODE_ENV === "development"
  }

  isProduction(): boolean {
    return this.env.NODE_ENV === "production"
  }

  getApiKey(service: "gemini"): string {
    switch (service) {
      case "gemini":
        const key = this.env.GEMINI_API_KEY
        if (!key) {
          throw new Error("GEMINI_API_KEY is not configured")
        }
        return key
      default:
        throw new Error(`Unknown service: ${service}`)
    }
  }

  // Rate limiting configuration
  getRateLimitConfig() {
    return {
      max: this.env.RATE_LIMIT_MAX,
      windowMs: this.env.RATE_LIMIT_WINDOW,
    }
  }
}

export const envValidator = EnvironmentValidator.getInstance()

// Validate environment on module load
const validation = envValidator.validate()
if (!validation.success) {
  console.error("[v0] Critical: Environment validation failed on startup")
  if (typeof window === "undefined") {
    // Server-side: log errors but don't crash immediately
    console.error("[v0] Environment errors:", validation.errors)
  }
}

export const env = envValidator.env
