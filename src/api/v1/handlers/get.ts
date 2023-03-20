import { Request, Response, NextFunction } from "express";

import { cache, promptAI } from "../../../..";

import { Generation } from "../../../entity";

export async function getGenerations(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const generations = await cache.get("generations");
    const userGenerations = await generations.filter(
      (generation: Generation) => generation.userId === req.user.id,
    );
    console.log("generation: ", userGenerations);
    res.send(userGenerations);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
}

export async function getGeneration(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const generations = await cache.get("generations");

    const generation = generations.find(
      (generation: Generation) =>
        generation.id === Number(req.params.id) &&
        generation.userId === req.user.id,
    );
    if (!generation) {
      res.status(404).send("Generation not found");
    } else {
      res.send(generation);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
}

export async function getUser(req: Request, res: Response, next: NextFunction) {
  const user = req.user;
  const sdModels = await cache.get("stableDiffusionModels");
  const promptModels = await cache.get("promptModels");
  const openAImodels = await cache.get("openAImodels");
  const defaults = await cache.get("defaults");
  const response = {
    stableDiffusionModels: sdModels,
    promptModels: promptModels,
    openAImodels: openAImodels,
    defaults: defaults,
    user: user,
  };

  if (!user) {
    res.status(401).json({ message: "Unauthorized" });
  } else {
    res.json(response);
  }
}
