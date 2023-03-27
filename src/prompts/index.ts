import { Configuration, OpenAIApi, CreateCompletionRequest } from "openai";

import { DEFAULT_MODEL, reRequest, templateRequest } from "./templates";

type Prompts = { prompt: string; negativePrompt: string };

export class PromptAI {
  api: OpenAIApi;
  errors: number = 0;

  constructor(openAiKey: string) {
    this.api = new OpenAIApi(new Configuration({ apiKey: openAiKey }));
  }

  async generatePrompt(rawText: string, context: string) {
    const gptRequest = `${DEFAULT_MODEL}\n\n${templateRequest(
      rawText,
      context,
    )}`;
    const completionRequest: CreateCompletionRequest = {
      model: "text-davinci-003",
      max_tokens: 500,
      prompt: gptRequest,
    };

    const gptResponse = await this.api.createCompletion(completionRequest);
    const sdPromptResponse = gptResponse.data.choices[0].text;

    let { prompt, negativePrompt }: Prompts =
      this.extractPrompts(sdPromptResponse);
    if (prompt.length == 0) {
      this.errors++;

      if (this.errors > 0) {
        throw new Error(`Too many gpt requests failed.\n\n${sdPromptResponse}`);
      }
      return await this.generatePrompt(rawText, context);
    }
    const data = gptResponse.data;

    return { prompt, negativePrompt, gptRequest, data };
  }

  extractPrompts(text: string): Prompts {
    const promptsRegex = /\[(.*?)\]/g;

    const promptsMatch = text.match(promptsRegex);

    let prompt = "";
    let negativePrompt = "";

    if (promptsMatch && promptsMatch[0]) {
      prompt = promptsMatch[0]
        .split(",")
        .map(p => p.trim())
        .toString()
        .replace(/"/g, "")
        .replace("[", "")
        .replace("]", "");
    }

    if (promptsMatch && promptsMatch[1]) {
      negativePrompt = promptsMatch[1]
        .split(",")
        .map(p => p.trim())
        .toString()
        .replace(/"/g, "")
        .replace("[", "")
        .replace("]", "");
    }

    return { prompt, negativePrompt };
  }
}
