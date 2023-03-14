import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class PromptModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  name: string;

  @Column({ type: "text", nullable: false })
  promptText: string;
}
