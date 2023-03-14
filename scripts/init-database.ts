import {
  Role,
  Limit,
  PromptModel,
  OpenAIModel,
  StableDiffusion,
} from "../src/entity";
import { AppDataSource } from "./../data-source";
import { DEFAULT_MODEL } from "../src/prompts/templates";
import { encryptModelKey } from "../src/utils";
import { getConfig } from "../config";

const config = getConfig();

export async function generateRoles() {
  const roles = ["Admin", "Tester", "User"];

  for (const roleName of roles) {
    const role = new Role();
    role.name = roleName;
    await AppDataSource.manager.save(role);
  }

  console.log("Roles have been generated successfully.");
}

export async function generateLimits() {
  const roles = await AppDataSource.manager.find(Role);

  const limits = [
    {
      steps: 150,
      batch_size: 30,
      width: 2048,
      height: 1080,
      tiling: true,
      role: roles.find(r => r.name === "Admin"),
    },
    {
      steps: 100,
      batch_size: 10,
      width: 1280,
      height: 1024,
      tiling: true,
      role: roles.find(r => r.name === "Tester"),
    },
    {
      steps: 50,
      batch_size: 4,
      width: 768,
      height: 768,
      tiling: false,
      role: roles.find(r => r.name === "User"),
    },
  ];

  for (const limitData of limits) {
    const limit = new Limit();
    limit.steps = limitData.steps;
    limit.batch_size = limitData.batch_size;
    limit.width = limitData.width;
    limit.height = limitData.height;
    limit.tiling = limitData.tiling;
    limit.role = limitData.role!;
    await AppDataSource.manager.save(limit);
  }

  console.log("Limits have been generated successfully.");
}

export async function initOpenAIModels() {
  const model = new OpenAIModel();
  model.name = "text-davinci-003";
  await AppDataSource.manager.save(model);

  console.log("OpenAI have been generated successfully.");
}

export async function initPromtModels() {
  const model = new PromptModel();
  model.name = "default";
  model.promptText = DEFAULT_MODEL;
  await AppDataSource.manager.save(model);

  console.log("PromptModels have been generated successfully.");
}

export async function initSDModels() {
  const models = [
    {
      name: "stable-diffusion-1.5",
      modelKey: config.SD_MODEL_KEY_1!,
    },
    {
      name: "stable-diffusion-2.1",
      modelKey: config.SD_MODEL_KEY_2!,
    },
    {
      name: "stable-diffusion-openjourney",
      modelKey: config.SD_MODEL_KEY_3!,
    },
  ];

  for (const modelData of models) {
    const model = new StableDiffusion();
    model.name = modelData.name;
    model.modelKey = modelData.modelKey;
    await AppDataSource.manager.save(model);
  }

  console.log("StableDiffusion Models have been generated successfully.");
}

export async function initStartModels() {
  await generateRoles();
  await generateLimits();
  await initOpenAIModels();
  await initPromtModels();
  await initSDModels();
}

if (require.main === module) {
  AppDataSource.initialize().then(async () => {
    await initStartModels();
    AppDataSource.destroy();
    process.exit(0);
  });
}
