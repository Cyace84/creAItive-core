import { RequestHandler, NextFunction, Request, Response } from "express";
import { Limit } from "../../entity/access-control/Limit";
import { Role } from "../../entity/access-control/Role";
import { cache } from "./../../../";
import { Generation, User } from "../../entity";

const checkTextToImageDataMiddleware: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { text, params = {}, prompt_params = {} } = req.body;
  const request = {
    text,
    params,
    prompt_params,
  };

  req.txt2ImgRequest = request;
  if (!req.txt2ImgRequest.text) {
    return res
      .status(400)
      .json({ error: "No TextToImageRequest data provided." });
  }
  const defaults = require("./../../defaults.json");

  const {
    steps = defaults.steps,
    batch_size = defaults.batchSize,
    width = defaults.width,
    height = defaults.height,
    model_id = defaults.sdModelId,
    sampler_name = defaults.samplerName,
    cfg_scale = defaults.cfgScale,
    seed = defaults.seed,
    n_iter = defaults.nIter,
    tiling = defaults.tiling,
  } = req.txt2ImgRequest.params;
  //TODO model_ai_id and prompt_model_id
  let {
    model_ai = defaults.openAiModelId,
    prompt_model = defaults.promptModelId,
    prompt_context = defaults.promptContext,
    temperature = req.txt2ImgRequest.prompt_params.temperature ||
      defaults.temperature,
    top_p = req.txt2ImgRequest.prompt_params.top_p || defaults.topP,
  } = req.txt2ImgRequest.prompt_params;

  if (temperature && top_p) {
    temperature = req.txt2ImgRequest.prompt_params.temperature;
    top_p = null;
  }

  req.txt2ImgRequest.params = {
    ...req.txt2ImgRequest.params,
    steps,
    batch_size,
    width,
    height,
    model_id,
    sampler_name,
    cfg_scale,
    seed,
    n_iter,
    tiling,
  };
  req.txt2ImgRequest.prompt_params = {
    ...req.txt2ImgRequest.prompt_params,
    model_ai,
    prompt_model,
    prompt_context,
    temperature,
    top_p,
  };
  next();
};
export default checkTextToImageDataMiddleware;

export const checkLimitsMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const params = req.txt2ImgRequest.params;
    const role = req.user.role;

    if (!role) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const limits = await cache.get("limits");
    const limit = limits.find((l: Limit) => l.role.id === role.id);

    if (!limit) {
      return res.status(403).json({ error: "Forbidden" });
    }

    if (
      params.steps > limit.steps ||
      params.batch_size > limit.batch_size ||
      params.width > limit.width ||
      params.height > limit.height
    ) {
      return res.status(400).json({ error: "Bad request" });
    }

    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
