"use server"

import {
  generateKeywordIdeas,
  type GenerateKeywordIdeasInput,
  type GenerateKeywordIdeasOutput,
} from "@/ai/flows/generate-keyword-ideas"
import { z } from "zod"

export interface KeywordResearcherState extends GenerateKeywordIdeasOutput {
  error?: string | null
  timestamp?: number
  isLoading?: boolean
}

const keywordResearcherSchema = z.object({
  keyword: z.string().min(1, { message: "Please enter a keyword." }),
})

export async function generateKeywordIdeasAction(
  prevState: KeywordResearcherState,
  formData: FormData,
): Promise<KeywordResearcherState> {
  const validatedFields = keywordResearcherSchema.safeParse({
    keyword: formData.get("keyword"),
  })

  if (!validatedFields.success) {
    const fieldErrors = validatedFields.error.flatten().fieldErrors
    return {
      keywords: [],
      totalVolume: "0",
      totalKeywords: 0,
      error: fieldErrors.keyword?.[0] ?? "Invalid input.",
      isLoading: false,
    }
  }

  try {
    console.log("[v0] Starting keyword research for:", validatedFields.data.keyword)
    const result = await generateKeywordIdeas(validatedFields.data as GenerateKeywordIdeasInput)
    console.log("[v0] Keyword research completed, found", result.totalKeywords, "keywords")

    return {
      ...result,
      error: null,
      timestamp: Date.now(),
      isLoading: false,
    }
  } catch (e) {
    console.error("[v0] Keyword research failed:", e)
    const emptyState = {
      keywords: [],
      totalVolume: "0",
      totalKeywords: 0,
      isLoading: false,
    }

    if (e instanceof Error) {
      if (e.message.includes("timeout")) {
        return {
          ...emptyState,
          error: "Keyword research timed out. Please try again with a simpler keyword.",
        }
      }
      if (e.message.includes("quota") || e.message.includes("limit")) {
        return {
          ...emptyState,
          error: "API quota exceeded. Please try again later or upgrade your plan.",
        }
      }
      return {
        ...emptyState,
        error: `Keyword research failed: ${e.message}`,
      }
    }
    return {
      ...emptyState,
      error: "An unexpected error occurred during keyword research. Please try again.",
    }
  }
}
