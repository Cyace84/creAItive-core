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
      const audio = {
        content: req.file?.buffer.toString("base64"),
      };
      transcription = await voiceToText(audio);
    }
    const { prompt, negativePrompt, data, gptRequest } =
      await promptAI.generatePrompt(transcription);

    console.log(312312312, data);

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

    const newGeneration = new Generation();
    newGeneration.sourceText = response.prompt_parameters.transcripted_voice;
    newGeneration.gptRequest = gptRequest;
    newGeneration.images64 = sdResponse.images;
    newGeneration.info = response.info;
    newGeneration.modelSdId = req.txt2ImgRequest.params.model_id;
    newGeneration.promptParameters = {
      transcriptedVoice: response.prompt_parameters.transcripted_voice,
      promptContext: response.prompt_parameters.prompt_context,
      modelAi: response.prompt_parameters.model_ai,
      promptModel: response.prompt_parameters.prompt_model,
      temperature: req.txt2ImgRequest.prompt_params.temperature,
    };
    newGeneration.userId = req.user?.id;

    // const inewGeneration: IGeneration = {
    //   sourceText: response.prompt_parameters.transcripted_voice,
    //   gptRequest: gptRequest,
    //   images: await compressImages(sdResponse.images),
    //   info: response.info,
    //   modelSdId: req.txt2ImgRequest.params.model_id,
    //   promptParameters: {
    //     promptContext: response.prompt_parameters.prompt_context,
    //     modelAi: response.prompt_parameters.model_ai,
    //     promptModel: response.prompt_parameters.prompt_model,
    //     temperature: req.txt2ImgRequest.prompt_params.temperature
    //   },
    //   userId: req.user?.id
    // };

    await cache.addGeneration(newGeneration);

    const savedGeneration = await AppDataSource.manager.save(
      Generation,
      newGeneration,
    );
    response.id = savedGeneration.id.toString();

    res.txt2ImgResponse = newGeneration;
    res.status(200);
    res.json(response);
  } catch (error) {
    next(error);
  }
}
