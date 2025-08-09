// This file uses server-side code, and must have the `'use server'` directive.
'use server';

/**
 * @fileOverview Analyzes a smile in an image and returns a happiness score.
 *
 * - analyzeSmile - A function that handles the smile analysis process.
 * - AnalyzeSmileInput - The input type for the analyzeSmile function.
 * - AnalyzeSmileOutput - The return type for the analyzeSmile function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeSmileInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a smile, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeSmileInput = z.infer<typeof AnalyzeSmileInputSchema>;

const AnalyzeSmileOutputSchema = z.object({
  happinessScore: z.number().describe('A score from 0 to 5 indicating the level of happiness in the smile.'),
  funnySmileName: z.string().describe('A funny, lighthearted name for the smile based on the score.'),
});
export type AnalyzeSmileOutput = z.infer<typeof AnalyzeSmileOutputSchema>;

export async function analyzeSmile(input: AnalyzeSmileInput): Promise<AnalyzeSmileOutput> {
  return analyzeSmileFlow(input);
}

const analyzeSmilePrompt = ai.definePrompt({
  name: 'analyzeSmilePrompt',
  input: {schema: AnalyzeSmileInputSchema},
  output: {schema: AnalyzeSmileOutputSchema},
  prompt: `You are a smile analyzer. You will analyze the smile in the provided image and provide a happiness score from 0 to 5.

  Photo: {{media url=photoDataUri}}
  Return a happinessScore which is a number between 0 and 5.
  Return a funnySmileName, which is a funny name for the smile, based on the score.`,
});

const analyzeSmileFlow = ai.defineFlow(
  {
    name: 'analyzeSmileFlow',
    inputSchema: AnalyzeSmileInputSchema,
    outputSchema: AnalyzeSmileOutputSchema,
  },
  async input => {
    const {output} = await analyzeSmilePrompt(input);
    return output!;
  }
);
