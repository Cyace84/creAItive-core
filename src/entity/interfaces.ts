import { Role } from "./access-control/Role";

export interface IGeneration {
  id?: number;
  sourceText: string;
  gptRequest: string;
  images64: string[];
  info: string;
  modelSdId: number;
  promptParameters: {
    promptContext: string;
    modelAi: string;
    promptModel: string;
    temperature?: number;
    topP?: number;
  };
  userId: number;
}

export interface IUser {
  id: number;
  username: string;
  email?: string;
  password?: string;
  name?: string;
  picture?: string;
  role: Role;
}
