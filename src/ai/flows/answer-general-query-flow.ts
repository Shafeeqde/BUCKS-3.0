
'use server';
/**
 * @fileOverview A Genkit flow to answer general user queries using an LLM,
 * potentially identifying and returning location-based results.
 *
 * - answerGeneralQuery - A function that takes a user's query and returns an AI-generated answer.
 * - GeneralQueryInput - The input type for the answerGeneralQuery function.
 * - GeneralQueryOutput - The return type for the answerGeneralQuery function.
 */

import {ai, defaultGenkitModel} from '@/ai/genkit';
import {z} from 'genkit';

const GeneralQueryInputSchema = z.object({
  query: z.string().describe('The user query to be answered.'),
});
export type GeneralQueryInput = z.infer<typeof GeneralQueryInputSchema>;

const LocationResultSchema = z.object({
  name: z.string().describe('Name of the place.'),
  address: z.string().describe('Address of the place.'),
});
export type LocationResult = z.infer<typeof LocationResultSchema>;

const SuggestedActionSchema = z.object({
    label: z.string().describe("A short, actionable label for a button, e.g., 'Explore Food Services'."),
    targetTab: z.string().describe("The specific tab name in the app to navigate to, e.g., 'food-restaurants'. Must be a valid TabName from the app's types."),
}).optional();

const GeneralQueryOutputSchema = z.object({
  answer: z.string().describe("The AI-generated conversational answer or summary for the query. Be helpful and proactive."),
  locations: z.array(LocationResultSchema).optional().describe('A list of relevant mock locations if the query is location-based (e.g., "petrol bunks near me"). Provide 2-3 sample locations in Bangalore for demonstration. If not a location query, this should be undefined.'),
  queryType: z.enum(['general', 'location_search']).describe('Indicates if the query was primarily treated as a general question or a location search. If the query asks for places like "petrol bunks", "restaurants", etc., set this to "location_search". Otherwise, set to "general".'),
  suggestedAction: SuggestedActionSchema,
});
export type GeneralQueryOutput = z.infer<typeof GeneralQueryOutputSchema>;

export async function answerGeneralQuery(input: GeneralQueryInput): Promise<GeneralQueryOutput> {
  if (!defaultGenkitModel) {
    console.warn('answerGeneralQueryFlow: AI model not configured. Returning default message.');
    return {
      answer: "The AI assistant is not configured. Please set the GOOGLE_GENAI_API_KEY environment variable to enable this feature.",
      queryType: "general",
    };
  }
  return answerGeneralQueryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerGeneralQueryPrompt',
  input: {schema: GeneralQueryInputSchema},
  output: {schema: GeneralQueryOutputSchema},
  prompt: `You are bucks's intelligent assistant. Your goal is to be helpful, conversational, and guide the user within the app.
The app has the following features accessible via tabs: 'home', 'feeds', 'menu', 'recommended', 'account', 'job-board', 'food-restaurants', 'shopping-categories'.

Analyze the user's query: "{{{query}}}"

1.  **Determine User Intent**: First, determine if the query is a general question, a command, or a search for places/services available in the app.

2.  **Formulate a Conversational Answer**:
    - If it's a general question (e.g., "what is the capital of France?"), provide a direct and concise answer.
    - If it's a search for something available in the app (e.g., "good pizza", "find a plumber", "I want to buy headphones"), provide a helpful lead-in like "I can help with that! Here's what I found..."

3.  **Identify Query Type & Provide Data**:
    - If it is a **location-based query** (e.g., "petrol bunks", "restaurants near me", "atm"):
      - Set 'queryType' to 'location_search'.
      - Provide a brief textual 'answer' like "Okay, I found some places for you:".
      - Populate the 'locations' array with 2-3 fictional but realistic mock examples of such places in Bangalore, India, including a 'name' and 'address'.
      - If the query matches an app feature (like "restaurants"), add a 'suggestedAction'. For "restaurants", suggest: \`{ "label": "Explore Food Services", "targetTab": "food-restaurants" }\`.
    - If it is a **general question** not primarily about finding places:
      - Set 'queryType' to 'general'.
      - Provide a concise and helpful textual 'answer' to the query.
      - Leave the 'locations' array undefined.
      - If the query hints at an app feature (e.g., "I need a job" or "I want to buy clothes"), add a 'suggestedAction'. For "I need a job", suggest: \`{ "label": "Search Job Board", "targetTab": "job-board" }\`. For "buy clothes", suggest: \`{ "label": "Browse Shopping", "targetTab": "shopping-categories" }\`.
    - If no specific action is relevant, leave 'suggestedAction' undefined.

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
    try {
      const { output } = await prompt(input);
      if (!output) {
        console.error('answerGeneralQueryFlow: AI model did not return output.');
        return {
          answer: "Sorry, I encountered an issue processing your query. The AI model did not return a response.",
          queryType: "general",
        };
      }
      return output;
    } catch (e: any) {
      console.error('Error in answerGeneralQueryFlow calling prompt:', e);
      return {
        answer: `Sorry, I couldn't process your request due to an error: ${e.message || 'Unknown error'}. Please try again.`,
        queryType: "general",
      };
    }
  }
);
