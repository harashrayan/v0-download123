import { genkit } from "genkit"
import { googleAI } from "@genkit-ai/googleai"
import { config } from "dotenv"
import { envValidator } from "@/lib/env"

config()

function initializeAI() {
  try {
    // Validate environment before initializing AI
    const validation = envValidator.validate()
    if (!validation.success) {
      console.error("[v0] AI initialization failed: Environment validation errors:", validation.errors)
      throw new Error(`Environment validation failed: ${validation.errors?.join(", ")}`)
    }

    const apiKey = envValidator.getApiKey("gemini")

    console.log("[v0] Initializing AI with validated configuration...")

    const aiInstance = genkit({
      plugins: [
        googleAI({
          apiKey,
          // Add additional security configurations
          timeout: 30000, // 30 second timeout
        }),
      ],
      model: "googleai/gemini-2.0-flash",
      // Add global error handling
      onError: (error) => {
        console.error("[v0] AI Error:", error)
        // Log security events for suspicious errors
        if (error.message.includes("quota") || error.message.includes("unauthorized")) {
          console.warn("[v0] Potential security issue detected in AI service")
        }
      },
    })

    console.log("[v0] AI initialized successfully")
    return aiInstance
  } catch (error) {
    console.error("[v0] Failed to initialize AI:", error)

    // Return a mock AI instance for development/testing
    if (envValidator.isDevelopment()) {
      console.warn("[v0] Using mock AI instance for development")
      return createMockAI()
    }

    throw error
  }
}

function createMockAI() {
  // Mock AI instance for development when API key is not available
  return {
    defineFlow: (config: any, handler: any) => {
      return async (input: any) => {
        console.warn("[v0] Mock AI: Simulating response for", config.name)

        if (config.name.includes("article") || config.name === "generateArticleFlow") {
          return {
            article:
              "Mock article content generated for development. This is a placeholder article that demonstrates the functionality when API keys are not available.",
          }
        }
        if (config.name.includes("title") || config.name === "generateTitleFlow") {
          return { title: `Mock Title: ${input.keyword || "Sample Topic"}` }
        }
        if (config.name.includes("keyword")) {
          return {
            keywords: [
              {
                keyword: input.keyword || "mock keyword",
                kd: 25,
                volume: "1.2K",
                gv: "2.5K",
                tp: "3.1K",
                cpc: "$1.25",
                parentTopic: "Mock Topic",
                sf: "TF,S",
                updated: "1 day ago",
              },
            ],
            totalVolume: "1.2K",
            totalKeywords: 1,
          }
        }
        if (config.name.includes("image")) {
          return { imageUrl: "/mock-image.png" }
        }

        return { result: "Mock response" }
      }
    },
    definePrompt: (config: any) => {
      return async (input: any) => {
        console.warn("[v0] Mock AI: Simulating prompt response for", config.name)

        // Return mock output based on the expected schema
        if (config.name.includes("title") || config.name === "generateTitlePrompt") {
          return {
            output: {
              title: `Mock Generated Title: ${input.keyword || "Sample Topic"}`,
            },
          }
        }

        return {
          output: {
            result: "Mock prompt response",
          },
        }
      }
    },
  }
}

export const ai = initializeAI()
