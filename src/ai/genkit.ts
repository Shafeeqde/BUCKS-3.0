
import {genkit} from 'genkit';
import {googleAI, gemini20Flash} from '@genkit-ai/googleai';

const pluginsList: any[] = []; // GenkitPlugin type not exported, using any[]
export let defaultGenkitModel: any = undefined; // ModelReference type not exported, using any

if (process.env.GOOGLE_GENAI_API_KEY) {
  pluginsList.push(googleAI());
  defaultGenkitModel = gemini20Flash;
  console.log('Google AI plugin for Genkit initialized with API key.');
} else {
  console.warn(
    'WARNING: GOOGLE_GENAI_API_KEY is not set. Genkit will be initialized without the Google AI plugin. AI features requiring this plugin will not work.'
  );
}

export const ai = genkit({
  plugins: pluginsList,
  ...(defaultGenkitModel ? { model: defaultGenkitModel } : {}),
});
