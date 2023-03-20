import { Role } from "./access-control/Role";

export interface IGeneration {
  id?: number;
  sourceText: string;
  gptRequest: string;
  images64: string[];
  info: {
    prompt: string;
    all_prompts: string[];
    negative_prompt: string;
    all_negative_prompts: string[];
    seed: number;
    all_seeds: number[];
    subseed: number;
    all_subseeds: number[];
    subseed_strength: number;
    width: number;
    height: number;
    sampler_name: string;
    cfg_scale: number;
    steps: number;
    batch_size: number;
    restore_faces: boolean;
    face_restoration_model: null | boolean;
    sd_model_hash: string;
    seed_resize_from_w: number;
    seed_resize_from_h: number;
    denoising_strength: number;
    extra_generation_params: object;
    index_of_first_image: number;
    infotexts: string[];
    styles: string[];
    job_timestamp: string;
    clip_skip: number;
    is_using_inpainting_conditioning: boolean;
  };
  modelSdId: number;
  promptParameters: {
    promptContext: string;
    modelAi: string;
    promptModel: string;
    temperature?: number;
    topP?: number;
  };
  userId: number;
}

export interface IUser {
  id: number;
  username: string;
  email?: string;
  password?: string;
  name?: string;
  picture?: string;
  role: Role;
}
