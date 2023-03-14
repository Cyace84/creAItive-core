export type SDe = {
  voice_file: string;
  steps: number;
  sampler_name: string;
  cfg_scale: number;
  seed: number;
  batch_size: number;
  n_iter: number;
  width: number;
  height: number;
  tiling: number;
};

export namespace SDTypes {
  export type TextToImageRequest = {
    endpoint: string;
    params: TextToImageParams;
  };
  export type TextToImageParams = {
    prompt: string;
    negative_prompt: string;
    steps: number;
    sampler_name: string;
    cfg_scale: number;
    seed: number;
    batch_size: number;
    n_iter: number;
    width: number;
    height: number;
    tiling: boolean;
  };

  export interface TextToImageResponse {
    images: string[];
    parameters: TextToImageParams;
    info: object;
  }

  export interface ModelOutput {
    images: string[];
    parameters: {
      enable_hr: boolean;
      denoising_strength: number;
      firstphase_width: number;
      firstphase_height: number;
      hr_scale: number;
      hr_upscaler?: string;
      hr_second_pass_steps: number;
      hr_resize_x: number;
      hr_resize_y: number;
      prompt: string;
      styles?: string;
      seed: number;
      subseed: number;
      subseed_strength: number;
      seed_resize_from_h: number;
      seed_resize_from_w: number;
      sampler_name: string;
      batch_size: number;
      n_iter: number;
      steps: number;
      cfg_scale: number;
      width: number;
      height: number;
      restore_faces: boolean;
      tiling: boolean;
      negative_prompt: string;
      eta?: unknown;
      s_churn: number;
      s_tmax?: number;
      s_tmin: number;
      s_noise: number;
      override_settings?: unknown;
      override_settings_restore_afterwards: boolean;
      script_args?: unknown[];
      sampler_index: string;
      script_name?: unknown;
    };
    info: string;
  }
}
