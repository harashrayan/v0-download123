'use server';
/**
 * @fileOverview A flow for generating a full article based on extensive user input.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Define a comprehensive Zod schema for all possible article generation inputs
const GenerateArticleInputSchema = z.object({
  title: z.string().describe('The main title of the article.'),
  keywords: z.string().describe('The primary keywords for the article to focus on.'),
  language: z.string().optional().describe('The language the article should be written in (e.g., "en-us", "es").'),
  articleType: z.string().optional().describe('The type of article (e.g., "How-to guide", "Listicle", "Product review").'),
  articleSize: z.string().optional().describe('The desired length of the article (e.g., "Small", "Medium", "Large").'),
  toneOfVoice: z.string().optional().describe('The desired tone of voice (e.g., "Friendly", "Professional", "Witty").'),
  pointOfView: z.string().optional().describe('The narrative point of view (e.g., "First person singular", "Third person").'),
  targetCountry: z.string().optional().describe('The target country for the article to be localized for.'),
  detailsToInclude: z.string().optional().describe('Specific details, facts, or an outline to include in the article.'),
  seoKeywords: z.string().optional().describe('A comma-separated list of secondary SEO keywords to include.'),
  introHook: z.string().optional().describe('A brief for the introductory hook (e.g., "Start with a surprising statistic").'),
  conclusion: z.boolean().optional().describe('Whether to include a conclusion section.'),
  tables: z.boolean().optional().describe('Whether to include tables if relevant.'),
  h3: z.boolean().optional().describe('Whether to use H3 subheadings.'),
  lists: z.boolean().optional().describe('Whether to use bulleted or numbered lists.'),
  italics: z.boolean().optional().describe('Whether to use italics for emphasis.'),
  quotes: z.boolean().optional().describe('Whether to include quotes if relevant.'),
  keyTakeaways: z.boolean().optional().describe('Whether to include a "Key Takeaways" section.'),
  faq: z.string().optional().describe('Whether to include an FAQ section, and in what format (e.g., "Yes", "Yes, with Q: A:").'),
  bold: z.boolean().optional().describe('Whether to use bold text for emphasis.'),
  youtubeVideos: z.boolean().optional().describe('Whether to include placeholders for YouTube videos.'),
  numVideos: z.string().optional().describe('The number of YouTube video placeholders to include.'),
  textReadability: z.string().optional().describe('The target reading level (e.g., "8th & 9th grade").'),
  brandVoice: z.string().optional().describe('The name of a pre-defined brand voice to use.'),
  additionalInstructions: z.string().optional().describe('Any other specific instructions for the AI.'),
  brandName: z.string().optional().describe('The brand name to mention in the article.'),
  layoutOptions: z.string().optional().describe('How to layout images and videos (e.g., "Alternate image and video").'),
  strictPlacement: z.boolean().optional().describe('Whether to place media strictly under headings.'),
  internalLinking: z.string().optional().describe('A website URL for automatic internal linking.'),
  externalLinking: z.string().optional().describe('The type of external linking to perform (e.g., "Automatic").'),
  connectToWeb: z.boolean().optional().describe('Whether to connect to the web for real-time information.'),
  aiImages: z.string().optional().describe('Whether to include AI-generated image placeholders.'),
  numImages: z.string().optional().describe('The number of AI image placeholders to include.'),
  imageStyle: z.string().optional().describe('The style for the AI-generated images (e.g., "Photo", "Cartoon").'),
  imageSize: z.string().optional().describe('The aspect ratio for the AI-generated images (e.g., "16:9").'),
  includeKeyword: z.boolean().optional().describe('Whether to include the main keyword in the first image alt-text.'),
  informativeAltText: z.boolean().optional().describe('Whether to generate informative alt-text for images.'),
});
export type GenerateArticleInput = z.infer<typeof GenerateArticleInputSchema>;

const GenerateArticleOutputSchema = z.object({
  article: z.string().describe('The full generated article content in HTML format.'),
});
export type GenerateArticleOutput = z.infer<typeof GenerateArticleOutputSchema>;

const prompt = ai.definePrompt({
  name: 'generateArticlePrompt',
  input: { schema: GenerateArticleInputSchema },
  output: { schema: GenerateArticleOutputSchema },
  prompt: `
    You are an expert content writer and SEO specialist. Your task is to generate a high-quality, comprehensive, and engaging article based on the following detailed specifications.
    The output must be a single string of well-formatted HTML.

    **Core Details:**
    - **Article Title:** {{{title}}}
    - **Main Keyword(s):** {{{keywords}}}
    {{#if language}}- **Language:** {{{language}}}{{/if}}
    {{#if articleSize}}- **Article Size:** Generate an article of {{articleSize}} length. This should influence the word count and number of sections.{{/if}}
    {{#if articleType}}- **Article Type:** This should be a "{{articleType}}". Structure the content accordingly.{{/if}}
    
    **Content & Style:**
    {{#if toneOfVoice}}- **Tone of Voice:** Adopt a {{{toneOfVoice}}} tone.{{/if}}
    {{#if pointOfView}}- **Point of View:** Write from a {{{pointOfView}}} perspective.{{/if}}
    {{#if targetCountry}}- **Target Country:** Tailor content, examples, and language for {{{targetCountry}}}.{{/if}}
    {{#if textReadability}}- **Text Readability:** Write at a {{{textReadability}}} level.{{/if}}
    {{#if brandName}}- **Brand Mentions:** Naturally integrate the brand name "{{brandName}}".{{/if}}
    {{#if brandVoice}}- **Brand Voice:** Adhere to the "{{brandVoice}}" brand voice guidelines.{{/if}}

    **Structure & Formatting:**
    {{#if introHook}}- **Introduction:** Start with an engaging hook based on this brief: "{{introHook}}".{{/if}}
    - **Headings:** Use H2 for main sections and {{#if h3}}H3 tags for sub-sections.{{else}}do not use H3 tags.{{/if}}
    {{#if detailsToInclude}}- **Details to Include:** You MUST incorporate the following details and outline:
      {{{detailsToInclude}}}
    {{/if}}
    - **Formatting:** 
      - Use **bold** for emphasis as specified: {{#if bold}}Yes{{else}}No{{/if}}.
      - Use *italics* for emphasis as specified: {{#if italics}}Yes{{else}}No{{/if}}.
      - Use blockquotes for quotes as specified: {{#if quotes}}Yes{{else}}No{{/if}}.
      - Use lists (ul/li) as specified: {{#if lists}}Yes{{else}}No{{/if}}.
      - Use tables as specified: {{#if tables}}Yes{{else}}No{{/if}}.
    {{#if keyTakeaways}}- **Key Takeaways:** Include a "Key Takeaways" section.{{/if}}
    {{#if faq}}- **FAQ:** Include a Frequently Asked Questions section. Format it {{#if (eq faq "yes-qa")}}with "Q:" and "A:" prefixes{{/if}}.{{/if}}
    {{#if conclusion}}- **Conclusion:** End with a strong concluding section.{{/if}}

    **SEO & Media:**
    {{#if seoKeywords}}- **SEO Keywords:** Naturally weave these keywords into the text: {{{seoKeywords}}}.{{/if}}
    {{#if connectToWeb}}- **Connect to Web:** Use real-time web search to ensure information is up-to-date and accurate.{{/if}}
    {{#if aiImages}}- **AI Images:** Include {{{numImages}}} placeholder(s) for AI-generated images.
        - Image Style: {{{imageStyle}}}
        - Image Size: {{{imageSize}}}
        - For each image placeholder, use the format: <img src="https://placehold.co/600x400.png" alt="[Generated Alt Text]" data-ai-prompt="[A descriptive prompt based on the surrounding text and main keyword: {{{keywords}}}]" />
        - Alt Text: Generate informative alt text. {{#if includeKeyword}}The first image's alt text must include the main keyword "{{keywords}}".{{/if}} {{#if informativeAltText}}All alt text should be descriptive of the image content.{{/if}}
    {{/if}}
    {{#if youtubeVideos}}- **YouTube Videos:** Include {{{numVideos}}} placeholder(s) for YouTube videos in the format: <div data-youtube-placeholder="true" data-youtube-query="[Search query based on section content and main keyword: {{{keywords}}}]"></div>{{/if}}
    {{#if layoutOptions}}- **Media Layout:** Arrange images and videos according to this rule: {{{layoutOptions}}}.{{/if}}
    {{#if strictPlacement}} - **Media Placement:** All media placeholders must be placed directly under a heading tag.{{/if}}
    {{#if internalLinking}}- **Internal Linking:** Add relevant internal links pointing to pages on {{{internalLinking}}}.{{/if}}
    {{#if externalLinking}}- **External Linking:** Add relevant, authoritative external links.{{/if}}

    {{#if additionalInstructions}}**Additional Instructions:**
    {{{additionalInstructions}}}
    {{/if}}

    Now, generate the complete article in HTML format.
  `,
});

const generateArticleFlow = ai.defineFlow(
  {
    name: 'generateArticleFlow',
    inputSchema: GenerateArticleInputSchema,
    outputSchema: GenerateArticleOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

export async function generateArticle(input: GenerateArticleInput): Promise<GenerateArticleOutput> {
  return generateArticleFlow(input);
}
