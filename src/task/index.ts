import { AppDataSource } from '../../data-source';
import { User } from '../entity/User';
import { Role } from '../entity/access-control/Role';
import { Generation } from '../entity/Generation';
import { Limit } from '../entity/access-control/Limit';
import { PromptModel } from '../entity/ai-models/PromptModel';
import { cache } from '../..';

export async function updateDatabase() {
  const cachedUsers = await cache.get('users');
  const users = await AppDataSource.manager.find(User);

  if (cachedUsers !== JSON.stringify(users)) {
    await AppDataSource.manager.save(users);
    await cache.set('users', JSON.stringify(users));
  }

  const cachedRoles = await cache.get('roles');
  const roles = await AppDataSource.manager.find(Role);

  if (cachedRoles !== JSON.stringify(roles)) {
    await AppDataSource.manager.save(roles);
    await cache.set('roles', JSON.stringify(roles));
  }

  const cachedGenerations = await cache.get('generations');
  const generations = await AppDataSource.manager.find(Generation);

  if (cachedGenerations !== JSON.stringify(generations)) {
    if (cachedGenerations.length > generations.length) {
      const cachedGenerationsParsed: any[] = JSON.parse(cachedGenerations);
      const generationsIds: string[] = generations.map((g: any) => g.id);
      const newGenerations = cachedGenerationsParsed.filter((g: any) => !generationsIds.includes(g.id));
      await AppDataSource.manager.save(newGenerations);
    } else if (cachedGenerations.length < generations.length) {
      const cachedGenerationsParsed: any[] = JSON.parse(cachedGenerations);
      const cachedGenerationsIds: string[] = cachedGenerationsParsed.map((g: any) => g.id);

      const newGenerations = generations.filter((g: any) => !cachedGenerationsIds.includes(g.id));
      await cache.set('generations', JSON.stringify(newGenerations));
    }

    await AppDataSource.manager.save(cachedGenerations);
    await cache.set('generations', JSON.stringify(generations));
  }

  const cachedLimits = await cache.get('limits');
  const limits = await AppDataSource.manager.find(Limit);

  if (cachedLimits !== JSON.stringify(limits)) {
    await AppDataSource.manager.save(limits);
    await cache.set('limits', JSON.stringify(limits));
  }

  const cachedPromptModels = await cache.get('promptModels');
  const promptModels = await AppDataSource.manager.find(PromptModel);

  if (cachedPromptModels !== JSON.stringify(promptModels)) {
    await AppDataSource.manager.save(promptModels);
    await cache.set('promptModels', JSON.stringify(promptModels));
  }

  console.log('Users: ', Object.keys(users).length);
  console.log('Roles: ', Object.keys(roles).length);
  console.log('Generations: ', Object.keys(generations).length);
  console.log('Limits: ', Object.keys(limits).length);
  console.log('Prompt models: ', Object.keys(promptModels).length);
}
