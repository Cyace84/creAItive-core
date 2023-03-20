import { StableDiffusion } from '../src/entity';
import { AppDataSource } from './../data-source';
import { getConfig } from '../config';

const config = getConfig();

async function resetSDModels() {
  const models = await AppDataSource.manager.find(StableDiffusion);

  for (const model of models) {
    await AppDataSource.manager.remove(model);
  }

  console.log('All StableDiffusion Models have been removed successfully.');

  await AppDataSource.manager.query('ALTER SEQUENCE stable_diffusion_id_seq RESTART WITH 1');

  console.log('Auto-increment counter has been reset successfully.');
}

async function initSDModels() {
  await resetSDModels();

  const models = [
    {
      name: 'stable-diffusion-1.5',
      modelKey: config.SD_MODEL_KEY_1!
    },
    {
      name: 'stable-diffusion-2.1',
      modelKey: config.SD_MODEL_KEY_2!
    },
    {
      name: 'stable-diffusion-openjourney',
      modelKey: config.SD_MODEL_KEY_3!
    }
  ];

  for (const modelData of models) {
    const model = new StableDiffusion();
    model.name = modelData.name;
    model.modelKey = modelData.modelKey;
    await AppDataSource.manager.save(model);
  }

  console.log('New StableDiffusion Models have been generated successfully.');
}

if (require.main === module) {
  AppDataSource.initialize().then(async () => {
    await initSDModels();
    AppDataSource.destroy();
    process.exit(0);
  });
}
