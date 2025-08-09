'use server';

import { analyzeSmile, type AnalyzeSmileOutput } from '@/ai/flows/analyze-smile';

const funnyNames: Record<number, string> = {
  0: "The Mona Lisa Enigma",
  1: "Slightly Amused Stone",
  2: "Polite Grimace",
  3: "Solid Grin",
  4: "Beaming with Joy",
  5: "Supernova Smile",
};

/**
 * Rates a smile from an image data URI.
 * Calls the AI flow and provides a fallback to a random score if the AI fails.
 * @param photoDataUri The image data URI.
 * @returns A promise that resolves to the analysis result.
 */
export async function rateSmile(photoDataUri: string): Promise<AnalyzeSmileOutput> {
  try {
    // Basic validation for the data URI
    if (!photoDataUri.startsWith('data:image/')) {
      throw new Error("Invalid image data URI format.");
    }

    const result = await analyzeSmile({ photoDataUri });
    // Ensure score is within bounds
    result.happinessScore = Math.max(0, Math.min(5, Math.round(result.happinessScore)));
    return result;

  } catch (error) {
    console.error("AI smile analysis failed, using fallback.", error);
    
    // Fallback to a random score
    const randomScore = Math.floor(Math.random() * 6); // 0 to 5
    return {
      happinessScore: randomScore,
      funnySmileName: funnyNames[randomScore] || "Mysterious Mirth",
    };
  }
}
