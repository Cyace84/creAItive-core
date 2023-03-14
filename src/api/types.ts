export namespace APITypes {
  export interface TextToImageRequest {
    file?: Express.Multer.File;
    text?: string;
    params?: TextToImageParams;
    prompt_params?: PromptParams;
  }
  /**
   * @param model_ai The model to use for the AI.
   * @param prompt_model The model to use for the prompt request to the AI.
   * @param temperature What sampling temperature to use, between 0 and 2.
   *  Higher values like 0.8 will make the output more random, while lower values
   *  like 0.2 will make it more focused and deterministic.
   *  We generally recommend altering this or top_p but not both.
   * @param top_p An alternative to sampling with temperature, called nucleus sampling,
   *  where the model considers the results of the tokens with top_p probability mass.
   *  So 0.1 means only the tokens comprising the top 10% probability mass are considered.
   *
   * We generally recommend altering this or `temperature` but not both.
   */
  export type PromptParams = {
    model_ai?: string;
    prompt_model?: string;
    temperature?: number;
    top_p?: number;
  };

  export type TextToImageParams = {
    model_id: number;
    steps?: number;
    sampler_name?: string;
    cfg_scale?: number;
    seed?: number;
    batch_size?: number;
    n_iter?: number;
    width?: number;
    height?: number;
    tiling?: boolean;
  };

  export interface TextToImageResponse {
    id: string;
    images64: string[];
    prompt_parameters: {
      prompt_context: string;
      transcripted_voice: string;
      model_ai: string;
      prompt_model: string;
      temperature?: number;
      top_p?: number;
    };
    info: string;
  }
}

export type PromptParams = {
  steps: number;
  batch_size: number;
  width: number;
  height: number;
  tiling: boolean;
  sd_model: string;
  prompt_model: string;
};
