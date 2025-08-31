"use server"

import { generateArticle, type GenerateArticleInput } from "@/ai/flows/generate-article"
import { generateImage } from "@/ai/flows/generate-image"
import { generateTitle } from "@/ai/flows/generate-title"
import { z } from "zod"
import { storage } from "@/lib/storage"

export interface ArticleState {
  title?: string
  article?: string
  imageUrl?: string
  error?: string | null
  timestamp?: number
  isLoading?: boolean
}

const articleSchema = z.object({
  title: z.string().min(3, { message: "Please enter a title with at least 3 characters." }),
  keywords: z.string().min(3, { message: "Please enter keywords with at least 3 characters." }),
  language: z.string().optional(),
  articleType: z.string().optional(),
  articleSize: z.string().optional(),
  toneOfVoice: z.string().optional(),
  pointOfView: z.string().optional(),
  targetCountry: z.string().optional(),
  detailsToInclude: z.string().optional(),
  seoKeywords: z.string().optional(),
  introHook: z.string().optional(),
  conclusion: z.boolean().optional(),
  tables: z.boolean().optional(),
  h3: z.boolean().optional(),
  lists: z.boolean().optional(),
  italics: z.boolean().optional(),
  quotes: z.boolean().optional(),
  keyTakeaways: z.boolean().optional(),
  faq: z.string().optional(),
  bold: z.boolean().optional(),
  youtubeVideos: z.boolean().optional(),
  numVideos: z.string().optional(),
  textReadability: z.string().optional(),
  brandVoice: z.string().optional(),
  additionalInstructions: z.string().optional(),
  brandName: z.string().optional(),
  layoutOptions: z.string().optional(),
  strictPlacement: z.boolean().optional(),
  internalLinking: z.string().optional(),
  externalLinking: z.string().optional(),
  connectToWeb: z.boolean().optional(),
  aiImages: z.string().optional(),
  numImages: z.string().optional(),
  imageStyle: z.string().optional(),
  imageSize: z.string().optional(),
  includeKeyword: z.boolean().optional(),
  informativeAltText: z.boolean().optional(),
})

export async function generateArticleAction(prevState: ArticleState, formData: FormData): Promise<ArticleState> {
  // Helper to convert form values to boolean
  const toBoolean = (value: FormDataEntryValue | null) => value === "yes"

  const rawData = {
    title: formData.get("title"),
    keywords: formData.get("keywords"),
    language: formData.get("language"),
    articleType: formData.get("articleType"),
    articleSize: formData.get("articleSize"),
    toneOfVoice: formData.get("toneOfVoice"),
    pointOfView: formData.get("pointOfView"),
    targetCountry: formData.get("targetCountry"),
    detailsToInclude: formData.get("details-to-include"),
    seoKeywords: formData.get("seo-keywords"),
    introHook: formData.get("intro-hook"),
    conclusion: toBoolean(formData.get("conclusion")),
    tables: toBoolean(formData.get("tables")),
    h3: toBoolean(formData.get("h3")),
    lists: toBoolean(formData.get("lists")),
    italics: toBoolean(formData.get("italics")),
    quotes: toBoolean(formData.get("quotes")),
    keyTakeaways: toBoolean(formData.get("keyTakeaways")),
    faq: formData.get("faq"),
    bold: toBoolean(formData.get("bold")),
    youtubeVideos: toBoolean(formData.get("youtubeVideos")),
    numVideos: formData.get("numVideos"),
    textReadability: formData.get("textReadability"),
    brandVoice: formData.get("brandVoice"),
    additionalInstructions: formData.get("additional-instructions"),
    brandName: formData.get("brand-name"),
    layoutOptions: formData.get("layoutOptions"),
    strictPlacement: formData.get("strict-placement") === "on",
    internalLinking: formData.get("internalLinkingWebsite"),
    externalLinking: formData.get("externalLinkingType"),
    connectToWeb: toBoolean(formData.get("connectToWeb")),
    aiImages: formData.get("aiImages"),
    numImages: formData.get("numImages"),
    imageStyle: formData.get("imageStyle"),
    imageSize: formData.get("imageSize"),
    includeKeyword: formData.get("include-keyword") === "on",
    informativeAltText: formData.get("informative-alt-text") === "on",
  }

  const validatedFields = articleSchema.safeParse(rawData)

  if (!validatedFields.success) {
    const fieldErrors = validatedFields.error.flatten().fieldErrors
    const errorMessage = fieldErrors.title?.[0] ?? fieldErrors.keywords?.[0] ?? "Please check the form for errors."
    return {
      error: errorMessage,
      isLoading: false,
    }
  }

  try {
    console.log("[v0] Starting article generation for:", validatedFields.data.title)

    // The header image is generated separately, but the main article text and placeholders are done in one go.
    const [articleResult, imageResult] = await Promise.all([
      generateArticle(validatedFields.data as GenerateArticleInput),
      generateImage({ prompt: validatedFields.data.title }),
    ])

    console.log("[v0] Article generation completed successfully")

    const articleState = {
      title: validatedFields.data.title,
      article: articleResult.article,
      imageUrl: imageResult.imageUrl,
      error: null,
      timestamp: Date.now(),
      isLoading: false,
    }

    const saved = storage.saveArticle(articleState)
    if (!saved) {
      console.warn("[v0] Failed to save article to storage")
    }

    return articleState
  } catch (e) {
    console.error("[v0] Article generation failed:", e)

    if (e instanceof Error) {
      if (e.message.includes("timeout")) {
        return {
          error: "The request timed out. Please try again with a shorter article or simpler requirements.",
          isLoading: false,
        }
      }
      if (e.message.includes("quota") || e.message.includes("limit")) {
        return {
          error: "API quota exceeded. Please try again later or upgrade your plan.",
          isLoading: false,
        }
      }
      if (e.message.includes("network") || e.message.includes("connection")) {
        return {
          error: "Network error. Please check your connection and try again.",
          isLoading: false,
        }
      }
      return {
        error: `Generation failed: ${e.message}`,
        isLoading: false,
      }
    }
    return {
      error: "An unexpected error occurred during generation. Please try again.",
      isLoading: false,
    }
  }
}

const titleSchema = z.object({
  keyword: z.string().min(3, { message: "Keyword must be at least 3 characters." }),
})

interface TitleState {
  title?: string
  error?: string
  isLoading?: boolean
}

export async function generateTitleAction(keyword: string): Promise<TitleState> {
  const validatedFields = titleSchema.safeParse({ keyword })

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors.keyword?.[0],
      isLoading: false,
    }
  }

  try {
    console.log("[v0] Generating title for keyword:", keyword)
    const result = await generateTitle({ keyword: validatedFields.data.keyword })
    console.log("[v0] Title generated successfully:", result.title)
    return {
      title: result.title,
      isLoading: false,
    }
  } catch (e) {
    console.error("[v0] Title generation failed:", e)

    if (e instanceof Error) {
      if (e.message.includes("timeout")) {
        return {
          error: "Title generation timed out. Please try again.",
          isLoading: false,
        }
      }
      return {
        error: `Failed to generate title: ${e.message}`,
        isLoading: false,
      }
    }
    return {
      error: "Failed to generate title. Please try again.",
      isLoading: false,
    }
  }
}
