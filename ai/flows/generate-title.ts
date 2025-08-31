'use server';
/**
 * @fileOverview A flow for generating a catchy blog title.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateTitleInputSchema = z.object({
  keyword: z.string().describe('The main keyword for the article.'),
});
export type GenerateTitleInput = z.infer<typeof GenerateTitleInputSchema>;

const GenerateTitleOutputSchema = z.object({
  title: z.string().describe('The generated blog title.'),
});
export type GenerateTitleOutput = z.infer<typeof GenerateTitleOutputSchema>;


const prompt = ai.definePrompt({
  name: 'generateTitlePrompt',
  input: { schema: GenerateTitleInputSchema },
  output: { schema: GenerateTitleOutputSchema },
  prompt: `
    You are an expert copywriter specializing in creating viral, SEO-friendly blog titles.
    Your task is to generate one compelling title based on the provided keyword.

    **Keyword:** {{{keyword}}}

    The title should be catchy, clear, and optimized for search engines.
  `,
});

const generateTitleFlow = ai.defineFlow(
  {
    name: 'generateTitleFlow',
    inputSchema: GenerateTitleInputSchema,
    outputSchema: GenerateTitleOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

export async function generateTitle(input: GenerateTitleInput): Promise<GenerateTitleOutput> {
  return generateTitleFlow(input);
}
