'use server';

import { generateArticle, type GenerateArticleInput } from '@/ai/flows/generate-article';
import { generateImage } from '@/ai/flows/generate-image';
import { z } from 'zod';

export interface BulkArticleState {
  articles?: {
    title: string;
    article: string;
    imageUrl: string;
    timestamp: number;
  }[];
  error?: string | null;
  timestamp?: number;
}

const articleRowSchema = z.object({
  id: z.number(),
  mainKeyword: z.string(), // This is the 'keywords' field in GenerateArticleInput
  title: z.string().min(1, 'Title is required for all rows.'),
  keywords: z.string(), // This will be appended to global seoKeywords
  outline: z.string(), // This is part of 'detailsToInclude'
});

const bulkArticleSchema = z.object({
    rowsData: z.string().transform((val, ctx) => {
        try {
            const parsed = JSON.parse(val);
            const rows = z.array(articleRowSchema).min(1, 'At least one article row is required.');
            return rows.parse(parsed);
        } catch (e) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Invalid rows data format",
            });
            return z.NEVER;
        }
    }),
    language: z.string().optional(),
    articleType: z.string().optional(),
    articleSize: z.string().optional(),
    toneOfVoice: z.string().optional(),
    pointOfView: z.string().optional(),
    targetCountry: z.string().optional(),
    textReadability: z.string().optional(),
    brandVoice: z.string().optional(),
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
    layoutOptions: z.string().optional(),
    strictPlacement: z.boolean().optional(),
    internalLinking: z.string().optional(),
    externalLinking: z.string().optional(),
    connectToWeb: z.boolean().optional(),
    additionalInstructions: z.string().optional(),
    brandName: z.string().optional(),
    aiImages: z.string().optional(),
    numImages: z.string().optional(),
    imageStyle: z.string().optional(),
    imageSize: z.string().optional(),
    includeKeyword: z.boolean().optional(),
    informativeAltText: z.boolean().optional(),
    seoKeywords: z.string().optional(), // Global SEO keywords
});

export async function bulkGenerateArticlesAction(
  prevState: BulkArticleState,
  formData: FormData
): Promise<BulkArticleState> {
  
  // Helper to convert form values to boolean
  const toBoolean = (value: FormDataEntryValue | null) => value === 'yes';

  const rawData = {
    rowsData: formData.get('rowsData'),
    language: formData.get('language'),
    articleType: formData.get('articleType'),
    articleSize: formData.get('articleSize'),
    toneOfVoice: formData.get('toneOfVoice'),
    pointOfView: formData.get('pointOfView'),
    targetCountry: formData.get('targetCountry'),
    textReadability: formData.get('textReadability'),
    brandVoice: formData.get('brandVoice'),
    introHook: formData.get('intro-hook'),
    conclusion: toBoolean(formData.get('conclusion')),
    tables: toBoolean(formData.get('tables')),
    h3: toBoolean(formData.get('h3')),
    lists: toBoolean(formData.get('lists')),
    italics: toBoolean(formData.get('italics')),
    quotes: toBoolean(formData.get('quotes')),
    keyTakeaways: toBoolean(formData.get('keyTakeaways')),
    faq: formData.get('faq'),
    bold: toBoolean(formData.get('bold')),
    youtubeVideos: toBoolean(formData.get('youtubeVideos')),
    numVideos: formData.get('numVideos'),
    layoutOptions: formData.get('layoutOptions'),
    strictPlacement: formData.get('strict-placement') === 'on',
    internalLinking: formData.get('internalLinkingWebsite'),
    externalLinking: formData.get('externalLinkingType'),
    connectToWeb: toBoolean(formData.get('connectToWeb')),
    additionalInstructions: formData.get('additional-instructions'),
    brandName: formData.get('brand-name'),
    aiImages: formData.get('aiImages'),
    numImages: formData.get('numImages'),
    imageStyle: formData.get('imageStyle'),
    imageSize: formData.get('imageSize'),
    includeKeyword: formData.get('include-keyword') === 'on',
    informativeAltText: formData.get('informative-alt-text') === 'on',
    seoKeywords: formData.get('seo-keywords'),
  };
  
  const validatedFields = bulkArticleSchema.safeParse(rawData);

  if (!validatedFields.success) {
    const fieldErrors = validatedFields.error.flatten().fieldErrors;
    const errorMessage = (fieldErrors.rowsData?.[0] as string | undefined) ?? 'Please fill out all required fields for each row.';
    return {
      error: errorMessage,
    };
  }

  try {
    const { rowsData: articleRows, seoKeywords: globalSeoKeywords, ...commonSettings } = validatedFields.data;
    const generatedArticles = [];

    // Use a for...of loop to process articles sequentially
    for (const row of articleRows) {
      const allSeoKeywords = [globalSeoKeywords, row.keywords].filter(Boolean).join(', ');
      
      const detailsToInclude = [
        commonSettings.introHook,
        row.outline
      ].filter(Boolean).join('\n\n');


      const articleInput: GenerateArticleInput = {
        ...commonSettings,
        title: row.title,
        keywords: row.mainKeyword, 
        seoKeywords: allSeoKeywords,
        detailsToInclude: detailsToInclude,
      };

      // For each article, generate the text and image in parallel
      const [articleResult, imageResult] = await Promise.all([
        generateArticle(articleInput),
        generateImage({ prompt: articleInput.title }),
      ]);
      
      generatedArticles.push({
          title: row.title,
          article: articleResult.article,
          imageUrl: imageResult.imageUrl,
          timestamp: Date.now(),
      });
    }

    return {
      articles: generatedArticles,
      error: null,
      timestamp: Date.now(),
    };
  } catch (e) {
    console.error(e);
    if (e instanceof Error) {
        return { error: e.message };
    }
    return { error: 'An unexpected error occurred during bulk generation. Please try again.' };
  }
}
