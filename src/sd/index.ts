import { SDTypes } from './types';
const banana = require('@banana-dev/banana-dev');

export class SD {
  apiKey: string;
  headers: any;
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getTextToImage(request: SDTypes.TextToImageParams, modelKey: string): Promise<SDTypes.TextToImageResponse> {
    const response = await banana.run(this.apiKey, modelKey, {
      endpoint: 'txt2img',
      params: request
    });

    return response.modelOutputs[0];
  }
}
