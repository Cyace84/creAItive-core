import dotenv from "dotenv";

export interface Config {
  STAGE: "local" | "dev" | "prod";
  SELF_URL: string;
  SESSION_SECRET: string;
  JWT_SECRET: string;
  BANANA_API_KEY: string;
  OPENAI_API_KEY: string;
  SD_MODEL_KEY_1: string;
  SD_MODEL_KEY_2: string;
  SD_MODEL_KEY_3: string;
  DB_NAME: string;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_HOST: string;
  DB_PORT: number;
  DB_DIALECT: string;
  DB_PRIVATE_KEY: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  REDIS_HOST: string;
  REDIS_PORT: number;
  REDIS_OPTIONS: {
    host: string;
    port?: number;
    tls?: { rejectUnauthorized: boolean };
  } | null;
}

export function getConfig(): Config {
  dotenv.config();
  let envFilePath: string;

  switch (process.env.NODE_ENV) {
    case "dev":
      envFilePath = "./stages/dev/.env";
      break;
    case "prod":
      envFilePath = "./stages/prod/.env";
      break;
    default:
      envFilePath = "./stages/local/.env";
      break;
  }

  dotenv.config({ path: envFilePath });

  const redisConfig =
    process.env.NODE_ENV === "local"
      ? null
      : {
          host: process.env.REDIS_HOST!,
          port: parseInt(process.env.REDIS_PORT!),
          tls: { rejectUnauthorized: false },
        };

  return {
    STAGE: (process.env.NODE_ENV as "local" | "dev" | "prod") || "local",
    SELF_URL: process.env.SELF_URL!,
    SESSION_SECRET: process.env.SESSION_SECRET!,
    JWT_SECRET: process.env.JWT_SECRET!,
    DB_PRIVATE_KEY: process.env.DB_PRIVATE_KEY!,

    BANANA_API_KEY: process.env.BANANA_API_KEY!,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY!,

    SD_MODEL_KEY_1: process.env.SD_MODEL_KEY_1!,
    SD_MODEL_KEY_2: process.env.SD_MODEL_KEY_2!,
    SD_MODEL_KEY_3: process.env.SD_MODEL_KEY_3!,

    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET!,

    DB_NAME: process.env.DB_NAME!,
    DB_USER: process.env.DB_USER!,
    DB_PASSWORD: process.env.DB_PASSWORD!,
    DB_HOST: process.env.DB_HOST!,
    DB_PORT: parseInt(process.env.DB_PORT!),
    DB_DIALECT: process.env.DB_DIALECT!,
    REDIS_HOST: process.env.REDIS_HOST!,
    REDIS_PORT: parseInt(process.env.REDIS_PORT!),
    REDIS_OPTIONS: redisConfig,
  };
}
const config = getConfig();

export default config;
