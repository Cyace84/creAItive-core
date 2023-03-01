import axios from "axios";
import { spawn } from "child_process";
import {
  TextToImageParams,
  TextToImageRequest,
  TextToImageResponse,
} from "./types";
import banana from "@banana-dev/banana-dev";

export class SD {
  apiKey: string;
  headers: any;
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getTextToImage(
    request: TextToImageParams,
    modelKey: string,
  ): Promise<TextToImageResponse> {
    return (await banana.run(this.apiKey, modelKey, {
      enpoint: "tx",
      params: request,
    })) as TextToImageResponse;
  }
}
