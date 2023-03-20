import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ObjectIdColumn,
} from "typeorm";

@Entity()
export class StableDiffusion {
  @ObjectIdColumn()
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  name: string;

  @Column()
  modelKey: string;
}
