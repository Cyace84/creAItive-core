import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToOne,
  ObjectIdColumn,
} from "typeorm";
import { IGeneration } from "./interfaces";
import { User } from "./";

@Entity({ name: "generations" })
export class Generation implements IGeneration {
  @ObjectIdColumn()
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  sourceText: string;

  @Column({ nullable: false })
  gptRequest: string;

  @Column({ type: "text", array: true, nullable: false })
  images64: string[];

  @Column({ type: "simple-json", nullable: false })
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

  @Column({ nullable: false })
  modelSdId: number;

  @Column({ type: "simple-json", nullable: false })
  promptParameters: {
    promptContext: string;
    transcriptedVoice: string;
    modelAi: string;
    promptModel: string;
    temperature?: number;
    topP?: number;
  };

  @Column({ nullable: false })
  userId: number;
}
