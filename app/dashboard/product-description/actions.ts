'use server';

import { generateProductDescription } from '@/ai/flows/generate-product-description';
import { z } from 'zod';

export interface ProductDescriptionState {
  description?: string;
  error?: string | null;
  timestamp?: number;
}

const productDescriptionSchema = z.object({
  productName: z.string().min(3, { message: 'Please enter a product name with at least 3 characters.' }),
  features: z.string().min(3, { message: 'Please enter features with at least 3 characters.' }),
});

export async function generateProductDescriptionAction(
  prevState: ProductDescriptionState,
  formData: FormData
): Promise<ProductDescriptionState> {

  const validatedFields = productDescriptionSchema.safeParse({
    productName: formData.get('productName'),
    features: formData.get('features'),
  });

  if (!validatedFields.success) {
    const fieldErrors = validatedFields.error.flatten().fieldErrors;
    const errorMessage = fieldErrors.productName?.[0] ?? fieldErrors.features?.[0];
    return {
      error: errorMessage,
    };
  }

  try {
    const result = await generateProductDescription({
      productName: validatedFields.data.productName,
      features: validatedFields.data.features,
    });
    return { description: result.description, error: null, timestamp: Date.now() };
  } catch (e) {
    console.error(e);
    return { error: 'An unexpected error occurred. Please try again.' };
  }
}
