import { Request, Response, NextFunction } from "express";
import { SDTypes } from "../../../sd/types";
import { cache, promptAI } from "../../../..";
import { SD } from "../../../sd";
import { voiceToText } from "../../../speech";
import { APITypes } from "../../types";
import { makeTxt2ImgResponse } from "../../utils";
import { compressImages, getSDModelKey } from "../../../utils";
import { IGeneration } from "../../../entity/interfaces";
import config from "../../../../config";
import { AppDataSource } from "../../../../data-source";
import { Generation } from "../../../entity";

export async function txtToImg(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const params = req.txt2ImgRequest.params;
    const promptParams = req.txt2ImgRequest.prompt_params;
    let transcription = req.txt2ImgRequest.text;
    if (req.file) {
      transcription = await voiceToText(req.file.buffer);
    }
    const promptContext = promptParams.prompt_context;

    const { prompt, negativePrompt, data, gptRequest } =
      await promptAI.generatePrompt(
        transcription,
        promptContext,
        promptParams.temperature,
      );

    //console.log(312312312, data);

    const sd = new SD(config.BANANA_API_KEY!);
    const sdRequest: SDTypes.TextToImageParams = {
      prompt: prompt,
      negative_prompt: negativePrompt,
      steps: params.steps,
      sampler_name: params.sampler_name,
      cfg_scale: params.cfg_scale,
      seed: params.seed,
      batch_size: params.batch_size,
      n_iter: params.n_iter,
      width: params.width,
      height: params.height,
      tiling: params.tiling,
    };

    const respone = async () => {
      const sdResponse = await sd.getTextToImage(
        sdRequest,
        await getSDModelKey(req.txt2ImgRequest.params.model_id),
      );
      const response: APITypes.TextToImageResponse = makeTxt2ImgResponse(
        sdResponse.images,
        sdResponse.info,
        promptParams,
        transcription,
        gptRequest,
      );

      const fortmatInfo = response.info.replace(/,(?!\s)/g, ", ");

      const newGeneration = new Generation();
      const users = await cache.get("users");
      const user = users.find(user => user.email === req.user?.email);

      newGeneration.sourceText = response.prompt_parameters.transcripted_voice;
      newGeneration.gptRequest = gptRequest;
      newGeneration.images64 = sdResponse.images;
      newGeneration.info = JSON.parse(JSON.parse(fortmatInfo));
      newGeneration.modelSdId = req.txt2ImgRequest.params.model_id;
      newGeneration.promptParameters = {
        transcriptedVoice: response.prompt_parameters.transcripted_voice,
        promptContext: promptContext,
        modelAi: response.prompt_parameters.model_ai,
        promptModel: response.prompt_parameters.prompt_model,
        temperature: req.txt2ImgRequest.prompt_params.temperature,
      };
      newGeneration.userId = user.id;

      const savedGeneration = await AppDataSource.manager.save(
        Generation,
        newGeneration,
      );
      await cache.addGeneration(newGeneration);

      response.id = savedGeneration.id.toString();

      res.txt2ImgResponse = newGeneration;
      res.status(200);
      res.json(newGeneration);
    };
    let tries = 0;
    try {
      tries++;
      await respone();
    } catch (error) {
      if (tries < 9) {
        throw `The maximum number of attempts to create images has reached (${tries}): ${error}`;
      }
      await respone();
    }
  } catch (error) {
    next(error);
  }
}

export async function transcriptVoice(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const transcription = await voiceToText(req.file.buffer);
    res.status(200);
    res.json({ transcription });
  } catch (error) {
    next(error);
  }
}
