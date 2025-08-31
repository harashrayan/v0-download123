'use server';
/**
 * @fileOverview A flow for "humanizing" text, making it sound less like AI.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const HumanizeTextInputSchema = z.object({
  text: z.string().describe('The input text to be humanized.'),
  readability: z.string().optional().describe('The target reading level (e.g., "8th & 9th grade").'),
  language: z.string().optional().describe('The language of the text.'),
  removeAiWords: z.string().optional().describe('The aggressiveness of removing common AI-sounding words (e.g., "Standard", "Aggressive").'),
});
export type HumanizeTextInput = z.infer<typeof HumanizeTextInputSchema>;

const HumanizeTextOutputSchema = z.object({
  humanizedText: z.string().describe('The rewritten, humanized text.'),
});
export type HumanizeTextOutput = z.infer<typeof HumanizeTextOutputSchema>;


const prompt = ai.definePrompt({
  name: 'humanizeTextPrompt',
  input: { schema: HumanizeTextInputSchema },
  output: { schema: HumanizeTextOutputSchema },
  prompt: `
    You are an expert editor who specializes in making AI-generated text sound more human and natural.
    Your task is to rewrite the following text.

    **Rewrite Guidelines:**
    - Vary sentence structure and length.
    - Use simpler, more common vocabulary.
    - Inject a more personal or conversational tone where appropriate.
    - Break up long paragraphs.
    - Remove clichés and overly formal phrases often used by AI (e.g., "In conclusion", "Moreover", "It is important to note").
    {{#if readability}}- **Target Readability:** Aim for a {{{readability}}} level.{{/if}}
    {{#if removeAiWords}}- **AI Word Removal:** Be {{{removeAiWords}}} in removing typical AI phrases.{{/if}}
    {{#if language}}- **Language:** The text is in {{{language}}}. Ensure the output is also in this language.{{/if}}

    **Original Text:**
    ---
    {{{text}}}
    ---

    Now, provide the rewritten, humanized version of the text.
  `,
});

const humanizeTextFlow = ai.defineFlow(
  {
    name: 'humanizeTextFlow',
    inputSchema: HumanizeTextInputSchema,
    outputSchema: HumanizeTextOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

export async function humanizeText(input: HumanizeTextInput): Promise<HumanizeTextOutput> {
  return humanizeTextFlow(input);
}
