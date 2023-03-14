import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Role } from "./Role";

@Entity()
export class Limit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  steps: number;

  @Column()
  batch_size: number;

  @Column()
  width: number;

  @Column()
  height: number;

  @Column()
  tiling: boolean;

  @ManyToOne(() => Role, { eager: true })
  @JoinColumn()
  role: Role;
}
