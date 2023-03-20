import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ObjectIdColumn,
} from "typeorm";

@Entity()
export class PromptModel {
  @ObjectIdColumn()
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  name: string;

  @Column({ type: "text", nullable: false })
  promptText: string;
}
