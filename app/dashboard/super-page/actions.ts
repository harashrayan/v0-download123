'use server';

import { generateSerpOutline, type GenerateSerpOutlineInput, type GenerateSerpOutlineOutput } from '@/ai/flows/generate-serp-outline';
import { z } from 'zod';

export interface SuperPageState extends GenerateSerpOutlineOutput {
  error?: string | null;
  timestamp?: number;
}

const superPageSchema = z.object({
  keyword: z.string().min(3, { message: 'Please enter a keyword with at least 3 characters.' }),
  targetCountry: z.string().optional(),
});

export async function generateOutlineAction(
  prevState: SuperPageState,
  formData: FormData
): Promise<SuperPageState> {

  const validatedFields = superPageSchema.safeParse({
    keyword: formData.get('keyword'),
    targetCountry: formData.get('targetCountry'),
  });

  if (!validatedFields.success) {
    const fieldErrors = validatedFields.error.flatten().fieldErrors;
    return {
      analysisSummary: '',
      topHeadlines: [],
      outline: '',
      error: fieldErrors.keyword?.[0] ?? 'Invalid input.',
    };
  }

  try {
    const result = await generateSerpOutline(validatedFields.data as GenerateSerpOutlineInput);
    return { ...result, error: null, timestamp: Date.now() };
  } catch (e) {
    console.error(e);
    if (e instanceof Error) {
        return { 
            analysisSummary: '',
            topHeadlines: [],
            outline: '',
            error: e.message 
        };
    }
    return { 
        analysisSummary: '',
        topHeadlines: [],
        outline: '',
        error: 'An unexpected error occurred during analysis. Please try again.' 
    };
  }
}
