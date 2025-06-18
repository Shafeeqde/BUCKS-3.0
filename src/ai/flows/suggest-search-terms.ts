
'use server';

/**
 * @fileOverview Suggests relevant search terms based on the current map view and recent searches.
 *
 * - suggestSearchTerms - A function that handles the suggestion of search terms.
 * - SuggestSearchTermsInput - The input type for the suggestSearchTerms function.
 * - SuggestSearchTermsOutput - The return type for the suggestSearchTerms function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestSearchTermsInputSchema = z.object({
  mapViewDescription: z
    .string()
    .describe('A description of the current map view, including prominent landmarks and categories of businesses.'),
  recentSearches: z.array(z.string()).describe('A list of recent search queries made by the user.'),
});
export type SuggestSearchTermsInput = z.infer<typeof SuggestSearchTermsInputSchema>;

const SuggestSearchTermsOutputSchema = z.object({
  suggestedTerms: z.array(z.string()).describe('A list of suggested search terms relevant to the map view and recent searches.'),
});
export type SuggestSearchTermsOutput = z.infer<typeof SuggestSearchTermsOutputSchema>;

export async function suggestSearchTerms(input: SuggestSearchTermsInput): Promise<SuggestSearchTermsOutput> {
  return suggestSearchTermsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestSearchTermsPrompt',
  input: {schema: SuggestSearchTermsInputSchema},
  output: {schema: SuggestSearchTermsOutputSchema},
  prompt: `You are a search term suggestion service for a map application.

  Given the current map view and the user's recent searches, suggest search terms that the user might find relevant.
  The search terms should be specific and actionable.

  Current Map View Description: {{{mapViewDescription}}}
  Recent Searches: {{#each recentSearches}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

  Suggest search terms:
  `,
});

const suggestSearchTermsFlow = ai.defineFlow(
  {
    name: 'suggestSearchTermsFlow',
    inputSchema: SuggestSearchTermsInputSchema,
    outputSchema: SuggestSearchTermsOutputSchema,
  },
  async input => {
    try {
      const { output } = await prompt(input);
      if (!output) {
        console.error('suggestSearchTermsFlow: AI model did not return output.');
        // Return a default or error-indicating structure that matches SuggestSearchTermsOutputSchema
        return { suggestedTerms: [] }; // Default to empty suggestions
      }
      return output;
    } catch (e: any) {
      console.error('Error in suggestSearchTermsFlow calling prompt:', e);
      // Return a default or error-indicating structure
      return { suggestedTerms: [] }; // Default to empty suggestions on error
    }
  }
);
