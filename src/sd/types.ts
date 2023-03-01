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
  tiling: number;
};

export type TextToImageRequest = {
  endpoint: "txt2img";
  params: TextToImageParams;
};

export interface TextToImageResponse {
  images: string[];
  parameters: TextToImageRequest;
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
    hr_upscaler: unknown; // You could specify this further based on the expected type of the hr_upscaler property
    hr_second_pass_steps: number;
    hr_resize_x: number;
    hr_resize_y: number;
    prompt: string;
    styles: unknown; // You could specify this further based on the expected type of the styles property
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
    eta: unknown; // You could specify this further based on the expected type of the eta property
    s_churn: number;
    s_tmax: unknown; // You could specify this further based on the expected type of the s_tmax property
    s_tmin: number;
    s_noise: number;
    override_settings: unknown; // You could specify this further based on the expected type of the override_settings property
    override_settings_restore_afterwards: boolean;
    script_args: unknown[]; // You could specify this further based on the expected type of the script_args array elements
    sampler_index: string;
    script_name: unknown; // You could specify this further based on the expected type of the script_name property
  };
  info: string;
}

export interface ImageToImageRequest {
  id: string;
  message: string;
  created: number;
  apiVersion: string;
  modelOutputs: ModelOutput[];
}
export interface ImageToImageResponse {
  image: string;
  parameters: ImageToImageRequest;
  info: object;
}
