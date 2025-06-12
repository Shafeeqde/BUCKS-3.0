
'use server';
/**
 * @fileOverview A Genkit flow to answer general user queries using an LLM,
 * potentially identifying and returning location-based results.
 *
 * - answerGeneralQuery - A function that takes a user's query and returns an AI-generated answer.
 * - GeneralQueryInput - The input type for the answerGeneralQuery function.
 * - GeneralQueryOutput - The return type for the answerGeneralQuery function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneralQueryInputSchema = z.object({
  query: z.string().describe('The user query to be answered.'),
});
export type GeneralQueryInput = z.infer<typeof GeneralQueryInputSchema>;

const LocationResultSchema = z.object({
  name: z.string().describe('Name of the place.'),
  address: z.string().describe('Address of the place.'),
  // Future enhancements could include latitude, longitude, type
});
export type LocationResult = z.infer<typeof LocationResultSchema>;

const GeneralQueryOutputSchema = z.object({
  answer: z.string().describe('The AI-generated textual answer or summary for the query.'),
  locations: z.array(LocationResultSchema).optional().describe('A list of relevant mock locations if the query is location-based (e.g., "petrol bunks near me"). Provide 2-3 sample locations in Bangalore for demonstration. If not a location query, this should be undefined.'),
  queryType: z.enum(['general', 'location_search']).describe('Indicates if the query was primarily treated as a general question or a location search. If the query asks for places like "petrol bunks", "restaurants", etc., set this to "location_search". Otherwise, set to "general".'),
});
export type GeneralQueryOutput = z.infer<typeof GeneralQueryOutputSchema>;

export async function answerGeneralQuery(input: GeneralQueryInput): Promise<GeneralQueryOutput> {
  return answerGeneralQueryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerGeneralQueryPrompt',
  input: {schema: GeneralQueryInputSchema},
  output: {schema: GeneralQueryOutputSchema},
  prompt: `You are Locality Hub's intelligent assistant.
Analyze the user's query: "{{{query}}}"

First, determine if the query is primarily asking to find places or locations (e.g., "petrol bunks", "restaurants near me", "atm").
- If it is a location-based query:
  - Set 'queryType' to 'location_search'.
  - Provide a brief textual 'answer' like "Okay, I found some [type of place] for you:".
  - Populate the 'locations' array with 2-3 fictional but realistic mock examples of such places in Bangalore, India, including a 'name' and 'address' for each. For example, if the query is "petrol bunks", provide a few petrol bunk names and addresses.
- If it is a general question or statement not primarily about finding places:
  - Set 'queryType' to 'general'.
  - Provide a concise and helpful textual 'answer' to the query.
  - Leave the 'locations' array undefined.

User Query: {{{query}}}
`,
});

const answerGeneralQueryFlow = ai.defineFlow(
  {
    name: 'answerGeneralQueryFlow',
    inputSchema: GeneralQueryInputSchema,
    outputSchema: GeneralQueryOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("Failed to get a response from the AI model.");
    }
    return output;
  }
);

