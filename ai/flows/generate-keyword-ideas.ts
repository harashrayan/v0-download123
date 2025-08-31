"use server"
/**
 * @fileOverview A flow for generating keyword ideas based on a seed keyword.
 * Enhanced to provide more realistic and varied SEO metrics.
 */

import { ai } from "@/ai/genkit"
import { z } from "genkit"

const GenerateKeywordIdeasInputSchema = z.object({
  keyword: z.string().describe("The seed keyword to generate ideas from."),
})
export type GenerateKeywordIdeasInput = z.infer<typeof GenerateKeywordIdeasInputSchema>

const KeywordIdeaSchema = z.object({
  keyword: z.string().describe("The generated keyword idea."),
  kd: z.number().describe("Keyword Difficulty (an estimated score from 0-100)."),
  volume: z.string().describe('The monthly search volume as a formatted string (e.g., "1.2K").'),
  gv: z.string().describe('The global monthly search volume as a formatted string (e.g., "2.5K").'),
  tp: z.string().describe("Traffic Potential as a formatted string."),
  cpc: z.string().describe('Cost Per Click in USD (e.g., "$1.25").'),
  parentTopic: z.string().describe("The broader parent topic for this keyword."),
  sf: z.string().describe('SERP Features as a comma-separated string (e.g., "TF,S,PAA").'),
  updated: z.string().describe('When the data was last updated (e.g., "1 day ago").'),
})
export type KeywordIdea = z.infer<typeof KeywordIdeaSchema>

const GenerateKeywordIdeasOutputSchema = z.object({
  keywords: z.array(KeywordIdeaSchema).describe("A list of generated keyword ideas with their metrics."),
  totalVolume: z.string().describe("The total search volume for all keywords."),
  totalKeywords: z.number().describe("The total number of keywords generated."),
})
export type GenerateKeywordIdeasOutput = z.infer<typeof GenerateKeywordIdeasOutputSchema>

const prompt = ai.definePrompt({
  name: "generateKeywordIdeasPrompt",
  input: { schema: GenerateKeywordIdeasInputSchema },
  output: { schema: GenerateKeywordIdeasOutputSchema },
  prompt: `
    You are an expert SEO analyst. Your task is to generate a list of 50 related keyword ideas for the given seed keyword: {{{keyword}}}.
    
    For each keyword, provide realistic SEO metrics based on these guidelines:
    
    - **Keyword Difficulty (kd):** 
      * Long-tail keywords: 15-45
      * Medium competition: 46-70
      * High competition: 71-95
      * Brand terms: 5-25
    
    - **Volume (volume, gv):** Monthly search volume based on keyword type:
      * Long-tail: 100-2.5K
      * Medium tail: 2.5K-15K  
      * Short tail: 15K-100K+
      * Use realistic formatting: "1.2K", "15K", "150K", "1.2M"
    
    - **Traffic Potential (tp):** Usually 1.5-3x the search volume
    - **CPC (cpc):** Vary by industry - tech/finance: $2-15, general: $0.50-3.00
    - **Parent Topic (parentTopic):** Broader category that makes sense
    - **SERP Features (sf):** Mix of: TF (Top Stories), S (Sitelinks), PAA (People Also Ask), IS (Image Search), V (Videos), SC (Shopping Carousel)
    - **Updated (updated):** Vary between "1 day ago" to "7 days ago"
    
    Generate keywords with natural variation in metrics - not all should be easy or hard.
    Include a mix of informational, commercial, and navigational intent keywords.
    Calculate realistic total volume and ensure exactly 50 keywords.
  `,
})

const generateKeywordIdeasFlow = ai.defineFlow(
  {
    name: "generateKeywordIdeasFlow",
    inputSchema: GenerateKeywordIdeasInputSchema,
    outputSchema: GenerateKeywordIdeasOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input)
    return output!
  },
)

export async function generateKeywordIdeas(input: GenerateKeywordIdeasInput): Promise<GenerateKeywordIdeasOutput> {
  return generateKeywordIdeasFlow(input)
}
