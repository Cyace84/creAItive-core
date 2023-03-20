import express, { NextFunction, Response, Request } from "express";
import session from "express-session";
import bodyParser from "body-parser";
import cors from "cors";
import multer from "multer";
import cron from "node-cron";

import { AppDataSource } from "./data-source";
import config from "./config";

import { PromptAI } from "./src/prompts";
import { Cache } from "./src/cache";

import {
  User,
  Generation,
  StableDiffusion,
  PromptModel,
  OpenAIModel,
  Role,
  Limit,
  IGeneration,
} from "./src/entity";

import { authRouter } from "./src/api/auth";
import {
  authMiddleware,
  checkTextToImageDataMiddleware,
} from "./src/api/middleware";
import { APITypes } from "./src/api/types";

import { checkLimitsMiddleware } from "./src/api/middleware/checks";
import { updateDatabase } from "./src/task";
import { getUser } from "./src/api/v1/handlers/get";
import { getRouterV1, txt2imgRouterV1 } from "./src/api/v1/routers";
import { authFront, transcriptVoice } from "./src/api/v1/handlers";

export const cache = Cache.getInstance(config.REDIS_OPTIONS);
const db = AppDataSource;

export const promptAI = new PromptAI(config.OPENAI_API_KEY);

declare module "express" {
  interface Request {
    user?: User;
    txt2ImgRequest?: APITypes.TextToImageRequest;
    callbackUrl?: string;
  }
  interface Response {
    txt2ImgResponse?: IGeneration;
  }
}

const app = express();
const port = 3000;

app.use(
  session({
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use("/auth", authRouter);

app.use("/frontend/auth", authFront);
app.get("/user", authMiddleware.authenticateToken, getUser);

app.use(
  "/api/v1/gen/",
  authMiddleware.authenticateToken,
  upload.single("file"),
  checkTextToImageDataMiddleware,
  // checkLimitsMiddleware,
  txt2imgRouterV1,
);

app.use("/api/v1/get/", authMiddleware.authenticateToken, getRouterV1);

app.use("/api/voice-to-text", upload.single("file"), transcriptVoice);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send(`Internal Server Error: ${err.message}`);
});

if (require.main === module) {
  AppDataSource.initialize()
    .then(async () => {
      console.log("Loading users from the database...");
      const users = await AppDataSource.manager.find(User);
      console.log("Loaded users: ", Object.keys(users).length);

      await cache.set("users", JSON.stringify(users));

      const roles = await AppDataSource.manager.find(Role);
      console.log("Loaded roles: ", JSON.stringify(roles));
      await cache.set("roles", JSON.stringify(roles));

      const limits = await AppDataSource.manager.find(Limit);
      console.log("Loaded limits: ", limits[0].role);
      await cache.set("limits", JSON.stringify(limits));

      const generations = await AppDataSource.manager.find(Generation);

      console.log("Loaded generations: ", Object.keys(generations).length);
      await cache.set("generations", JSON.stringify(generations));

      const openAImodels = await AppDataSource.manager.find(OpenAIModel);
      console.log("Loaded openAI models: ", Object.keys(openAImodels).length);
      await cache.set("openAImodels", JSON.stringify(openAImodels));

      const promptModels = await AppDataSource.manager.find(PromptModel);
      console.log("Loaded prompt models: ", Object.keys(promptModels).length);
      await cache.set("promptModels", JSON.stringify(promptModels));

      const stableDiffusionModels = await AppDataSource.manager.find(
        StableDiffusion,
      );
      console.log(
        "Loaded stable diffusions: ",
        Object.keys(stableDiffusionModels).length,
      );
      await cache.set(
        "stableDiffusionModels",
        JSON.stringify(stableDiffusionModels),
      );

      const defaults = require("./src/defaults.json");
      await cache.set("defaults", JSON.stringify(defaults));

      console.log("Cache is ready.");

      app.listen(port, () => {
        console.log(`Server is listening on port ${port}.`);
      });
    })
    .catch(error => console.log(error));
}
