"use server"
/**
 * @fileOverview A flow for generating an image URL based on a prompt.
 * Enhanced to provide more realistic placeholder images with query-based generation.
 */

import { ai } from "@/ai/genkit"
import { z } from "genkit"

const GenerateImageInputSchema = z.object({
  prompt: z.string().describe("The text prompt to generate an image from."),
})
export type GenerateImageInput = z.infer<typeof GenerateImageInputSchema>

const GenerateImageOutputSchema = z.object({
  imageUrl: z.string().url().describe("The URL of the generated image."),
})
export type GenerateImageOutput = z.infer<typeof GenerateImageOutputSchema>

// This flow is a placeholder. It returns a static placeholder image URL.
// In a real application, you would replace this with a call to an image generation model.
const generateImageFlow = ai.defineFlow(
  {
    name: "generateImageFlow",
    inputSchema: GenerateImageInputSchema,
    outputSchema: GenerateImageOutputSchema,
  },
  async (input) => {
    // This creates a query-based placeholder that will generate appropriate images
    const encodedPrompt = encodeURIComponent(input.prompt)
    const placeholderUrl = `/placeholder.svg?height=630&width=1200&query=${encodedPrompt}`

    console.log("[v0] Generated image placeholder for prompt:", input.prompt)

    return {
      imageUrl: placeholderUrl,
    }
  },
)

export async function generateImage(input: GenerateImageInput): Promise<GenerateImageOutput> {
  return generateImageFlow(input)
}
