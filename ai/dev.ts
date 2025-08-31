"use server"
import { config } from "dotenv"
import { envValidator } from "@/lib/env"

config()

try {
  // Validate environment before loading flows
  const validation = envValidator.validate()
  if (!validation.success) {
    console.error("[v0] Development setup failed: Environment validation errors:", validation.errors)
    console.error("[v0] Please check your .env file and ensure all required variables are set")

    if (!envValidator.isDevelopment()) {
      throw new Error("Environment validation failed in production")
    }

    console.warn("[v0] Continuing in development mode with limited functionality")
  } else {
    console.log("[v0] Development environment validated successfully")
  }

  // Restore all necessary flow imports
  import("@/ai/flows/generate-article.ts")
  import("@/ai/flows/generate-image.ts")
  import("@/ai/flows/generate-title.ts")
  import("@/ai/flows/humanize-text.ts")
  import("@/ai/flows/generate-keyword-ideas.ts")
  import("@/ai/flows/generate-product-description.ts")
  import("@/ai/flows/generate-serp-outline.ts")

  console.log("[v0] AI flows loaded successfully")
} catch (error) {
  console.error("[v0] Failed to initialize development environment:", error)

  if (process.env.NODE_ENV === "production") {
    throw error // Fail fast in production
  }
}
