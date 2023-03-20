import "reflect-metadata";
import { DataSource } from "typeorm";
import {
  Generation,
  User,
  PromptModel,
  OpenAIModel,
  StableDiffusion,
  Role,
  Limit,
} from "./src/entity";
import { getConfig } from "./config";
const config = getConfig();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: config.DB_HOST || "localhost",
  port: Number(config.DB_PORT) || 5432,
  username: config.DB_USER || "postgres",
  password: config.DB_PASSWORD || "root",
  database: config.DB_NAME || "test",
  synchronize: true,
  logging: false,
  entities: [
    User,
    Generation,
    PromptModel,
    OpenAIModel,
    StableDiffusion,
    Role,
    Limit,
  ],
  migrations: ["migrations/*.js"],
  subscribers: [],
});
