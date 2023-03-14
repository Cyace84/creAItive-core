import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToOne,
} from "typeorm";
import { IGeneration } from "./interfaces";
import { User } from "./";

@Entity({ name: "generations" })
export class Generation implements IGeneration {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  sourceText: string;

  @Column({ nullable: false })
  gptRequest: string;

  @Column({ type: "text", array: true, nullable: false })
  images64: string[];

  @Column({ nullable: false })
  info: string;

  @Column({ nullable: false })
  modelSdId: number;

  @Column({ type: "json", nullable: false })
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
