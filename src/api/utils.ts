import { cache } from "../..";
import { AppDataSource } from "../../data-source";
import { Role, User } from "../entity";
import { SDTypes } from "../sd/types";
import { APITypes } from "./types";

export const makeTxt2ImgResponse = (
  images: string[],
  sdResponse: object,
  promptParams: APITypes.PromptParams,
  txtVoice: string,
  promptRequest: string,
): APITypes.TextToImageResponse => {
  const match = promptRequest.match(/\{.*\}/);
  const promptContext = match ? match[0] : "undefined";
  const response = {
    id: "0",
    images64: images,
    prompt_parameters: {
      prompt_context: promptContext,
      transcripted_voice: txtVoice,
      model_ai: promptParams.model_ai,
      prompt_model: promptParams.prompt_model,
      temperature: promptParams.temperature,
      top_p: promptParams.top_p,
    },
    info: JSON.stringify(sdResponse),
  };

  return response;
};

export const registerUser = async (
  name: string,
  username: string,
  email: string,
  picture: string,
  role: Role,
  password?: string,
) => {
  const user = new User();
  user.name = name;
  user.username = username;
  user.email = email;
  user.picture = picture;
  user.role = role;
  user.password = password;

  const users = await cache.get("users");
  if (users) {
    if (users.find(u => u.email === email)) {
      if (user.name !== name || user.picture !== picture) {
        user.name = name;
        user.picture = picture;
      }
    }
  }

  await AppDataSource.manager.upsert(User, user, {
    skipUpdateIfNoValuesChanged: true, // If true, postgres will skip the update if no values would be changed (reduces writes)
    conflictPaths: ["email"], // column(s) name that you would like to ON CONFLICT
  });
  await cache.updateOrAddUser(user);

  return user;
};
