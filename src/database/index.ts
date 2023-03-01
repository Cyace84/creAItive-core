import fs from "fs";

export interface Request {
  id: string;
  source_text: string;
  gpt_request: string;
  prompts: string;
  negative_prompts: string;
  images: string[];
  completed: boolean;
  gpt_prompt: string;
  model_sd: string;
}

export type Requests = { [key: string]: Request };

export const DEFAULT_REQUEST: Request = {
  id: "0",
  source_text: "",
  gpt_request: "",
  gpt_prompt: "",
  model_sd: "sd-2.1",
  prompts: "[]",
  negative_prompts: "[]",
  images: [],
  completed: false,
};

export class JSONDatabase {
  public nextId: string = "0";
  public lastConversationId: string;
  private readonly filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
    const requests = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    if (Object.keys(requests).length !== 0) {
      const sortedKeys = Object.keys(requests).sort(
        (a, b) => parseInt(a, 10) - parseInt(b, 10),
      );
      const lastKey = sortedKeys[sortedKeys.length - 1];
      const lastRequest = requests[lastKey.toString()];

      const lastId = lastRequest.id;
      this.lastConversationId = lastRequest.conversation_id;
      this.nextId = (Number(lastId) + 1).toString();
    }
  }

  public async read(): Promise<Requests> {
    return new Promise<Requests>((resolve, reject) => {
      fs.readFile(this.filePath, "utf8", (err, data) => {
        if (err) {
          reject(err);
        } else {
          try {
            const requests = JSON.parse(data);
            resolve(requests);
          } catch (e) {
            reject(e);
          }
        }
      });
    });
  }

  private async write(requests: Requests): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const data = JSON.stringify(requests, null, 2);
      fs.writeFile(this.filePath, data, err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  public async add(request: Request): Promise<void> {
    const requests = await this.read();
    request.id = this.nextId;
    requests[this.nextId] = request;
    this.nextId = (parseInt(this.nextId) + 1).toString();
    await this.write(requests);
  }

  public async update(request: Request): Promise<void> {
    const requests = await this.read();
    requests[request.id] = request;
    await this.write(requests);
  }

  public async get(id: string): Promise<Request> {
    const requests = await this.read();
    const request = requests[id];
    return request;
  }
}
