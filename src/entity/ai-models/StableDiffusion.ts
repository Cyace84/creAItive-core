import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class StableDiffusion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  name: string;

  @Column()
  modelKey: string;
}
