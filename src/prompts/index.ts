import { AxiosResponse } from "axios";
import {
  Configuration,
  OpenAIApi,
  CreateAnswerRequest,
  CreateCompletionRequest,
  CreateCompletionResponse,
} from "openai";
import { DEFAULT_REQUEST, JSONDatabase, Request, Requests } from "../database";
import { DEFAULT_MODEL, reRequest, templateRequest } from "./templates";
import { newConversationId } from "./utils";

type Prompts = { prompts: string; negativePrompts: string };

export class PromptGPT {
  api: OpenAIApi;
  errors: number = 0;

  constructor(openAiKey: string) {
    console.log(openAiKey);
    this.api = new OpenAIApi(new Configuration({ apiKey: openAiKey }));
  }

  async generatePrompt(rawText: string, conversationId?: string) {
    const db = new JSONDatabase("./src/database/db.json");
    const requests = await db.read();
    const gpt_request = `${DEFAULT_MODEL}\n\n${templateRequest(rawText)}`;
    const completionRequest: CreateCompletionRequest = {
      model: "text-davinci-003",
      max_tokens: 500,
      prompt: gpt_request,
    };

    const request: Request = DEFAULT_REQUEST;

    const gptResponse = await this.api.createCompletion(completionRequest);
    const sdPromptResponse = gptResponse.data.choices[0].text;

    let { prompts, negativePrompts }: Prompts =
      this.extractPrompts(sdPromptResponse);
    if (prompts.length == 0) {
      this.errors++;
      console.log(gptResponse.data.choices);
      if (this.errors > 0) {
        throw new Error(`Too many gpt requests failed.\n\n${sdPromptResponse}`);
      }
      return await this.generatePrompt(rawText);
    }
    const data = gptResponse.data;
    request.prompts = prompts;
    request.negative_prompts = negativePrompts;
    request.source_text = rawText;
    request.gpt_request = templateRequest(rawText);
    request.gpt_prompt = DEFAULT_MODEL;

    await db.add(request);

    return { prompts, negativePrompts, data };
  }

  extractPrompts(text: string): Prompts {
    const promptsRegex = /\[(.*?)\]/g;

    const promptsMatch = text.match(promptsRegex);

    let prompts = "";
    let negativePrompts = "";

    if (promptsMatch && promptsMatch[0]) {
      prompts = promptsMatch[0]
        .split(",")
        .map(p => p.trim())
        .toString()
        .replace(/"/g, "")
        .replace("[", "")
        .replace("]", "");
    }

    if (promptsMatch && promptsMatch[1]) {
      negativePrompts = promptsMatch[1]
        .split(",")
        .map(p => p.trim())
        .toString()
        .replace(/"/g, "")
        .replace("[", "")
        .replace("]", "");
    }

    return { prompts, negativePrompts };
  }
}
