'use server';
/**
 * @fileOverview A flow for generating an article outline based on SERP analysis for a keyword.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateSerpOutlineInputSchema = z.object({
  keyword: z.string().describe('The target keyword for SERP analysis.'),
  targetCountry: z.string().optional().describe('The target country for the SERP analysis (e.g., "us", "uk").'),
});
export type GenerateSerpOutlineInput = z.infer<typeof GenerateSerpOutlineInputSchema>;

const GenerateSerpOutlineOutputSchema = z.object({
  analysisSummary: z.string().describe('A brief summary of the SERP analysis, including search intent and common themes.'),
  topHeadlines: z.array(z.string()).describe('A list of the top 5-7 competing headlines from the search results.'),
  outline: z.string().describe('A comprehensive, SEO-optimized article outline in HTML format (using h2, h3, ul, li tags).'),
});
export type GenerateSerpOutlineOutput = z.infer<typeof GenerateSerpOutlineOutputSchema>;


const prompt = ai.definePrompt({
  name: 'generateSerpOutlinePrompt',
  input: { schema: GenerateSerpOutlineInputSchema },
  output: { schema: GenerateSerpOutlineOutputSchema },
  prompt: `
    You are a world-class SEO strategist and content architect. Your goal is to analyze the Search Engine Results Page (SERP) for a given keyword and create a comprehensive article outline designed to outrank the competition.

    **Keyword:** {{{keyword}}}
    {{#if targetCountry}}**Target Country:** {{{targetCountry}}}{{/if}}

    **Instructions:**
    1.  **Analyze Search Intent:** Based on the keyword, determine the primary search intent (e.g., informational, commercial, navigational, transactional).
    2.  **Simulate SERP Analysis:** Imagine you are analyzing the top 10 search results for this keyword. Identify common themes, heading structures, "People Also Ask" questions, and content formats (e.g., listicles, how-to guides).
    3.  **Generate Analysis Summary:** Write a concise summary of your findings. What does the user want? What are the top articles about?
    4.  **Extract Top Headlines:** List 5-7 of the most representative and effective headlines from your simulated SERP analysis.
    5.  **Create a Winning Outline:** Construct a detailed, SEO-optimized article outline in HTML format.
        - The outline should have a logical flow.
        - It must include H2s for main topics and H3s for sub-topics.
        - Incorporate related questions and long-tail keywords as headings.
        - The goal is to create a structure for an article that is more comprehensive and valuable than the current top-ranking content.
        - The output for the outline must be a single string of well-formatted HTML.
  `,
});

const generateSerpOutlineFlow = ai.defineFlow(
  {
    name: 'generateSerpOutlineFlow',
    inputSchema: GenerateSerpOutlineInputSchema,
    outputSchema: GenerateSerpOutlineOutputSchema,
  },
  async (input) => {
    // In a real application, this is where you would use a tool to fetch actual SERP data.
    // For this simulation, the LLM will generate the analysis based on its knowledge.
    const { output } = await prompt(input);
    return output!;
  }
);

export async function generateSerpOutline(input: GenerateSerpOutlineInput): Promise<GenerateSerpOutlineOutput> {
  return generateSerpOutlineFlow(input);
}
