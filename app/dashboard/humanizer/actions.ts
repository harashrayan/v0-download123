'use server';

import { humanizeText } from '@/ai/flows/humanize-text';
import { z } from 'zod';

export interface HumanizerState {
  humanizedText?: string;
  error?: string | null;
  timestamp?: number;
}

const humanizerSchema = z.object({
  inputText: z.string().min(10, { message: 'Please enter at least 10 characters to humanize.' }),
  readability: z.string().optional(),
  language: z.string().optional(),
  removeAiWords: z.string().optional(),
});

export async function humanizeTextAction(
  prevState: HumanizerState,
  formData: FormData
): Promise<HumanizerState> {

  const validatedFields = humanizerSchema.safeParse({
    inputText: formData.get('inputText'),
    readability: formData.get('readability'),
    language: formData.get('language'),
    removeAiWords: formData.get('removeAiWords'),
  });

  if (!validatedFields.success) {
    const fieldErrors = validatedFields.error.flatten().fieldErrors;
    return {
      error: fieldErrors.inputText?.[0] ?? 'Invalid input.',
    };
  }

  try {
    const result = await humanizeText({
        text: validatedFields.data.inputText,
        readability: validatedFields.data.readability,
        language: validatedFields.data.language,
        removeAiWords: validatedFields.data.removeAiWords,
    });
    return { humanizedText: result.humanizedText, error: null, timestamp: Date.now() };
  } catch (e) {
    console.error(e);
    if (e instanceof Error) {
        return { error: e.message };
    }
    return { error: 'An unexpected error occurred. Please try again.' };
  }
}
