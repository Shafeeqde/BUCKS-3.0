
'use server';
/**
 * @fileOverview A Genkit flow to answer general user queries using an LLM.
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

const GeneralQueryOutputSchema = z.object({
  answer: z.string().describe('The AI-generated answer to the query.'),
});
export type GeneralQueryOutput = z.infer<typeof GeneralQueryOutputSchema>;

export async function answerGeneralQuery(input: GeneralQueryInput): Promise<GeneralQueryOutput> {
  return answerGeneralQueryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerGeneralQueryPrompt',
  input: {schema: GeneralQueryInputSchema},
  output: {schema: GeneralQueryOutputSchema},
  prompt: `You are Locality Hub's intelligent assistant. Provide a concise and helpful answer to the following user query:
  
Query: {{{query}}}

Answer:`,
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

