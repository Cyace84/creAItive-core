import Redis, { RedisOptions } from "ioredis";
import dotenv from "dotenv";
import { IGeneration } from "../entity/interfaces";
import { Generation, User } from "../entity";

dotenv.config();

export class Cache {
  private static instance: Cache;
  public redis: Redis;
  public options: RedisOptions;

  public constructor(options: RedisOptions) {
    this.redis = new Redis(options);
    this.options = options;
  }

  public static getInstance(options: any): Cache {
    if (!Cache.instance) {
      Cache.instance = new Cache(options);
    }
    return Cache.instance;
  }

  public async connect(): Promise<void> {
    if (
      this.redis.status === "connecting" ||
      this.redis.status === "ready" ||
      this.redis.status === "connect"
    ) {
      return;
    }
    await this.redis.connect();
  }

  public async disconnect(): Promise<void> {
    if (this.redis.status === "end" || this.redis.status === "close") {
      return;
    }
    await this.redis.quit();
  }

  public async get(key: string): Promise<any | null> {
    const redis = new Redis(this.options);
    const result = await redis.get(key);
    redis.disconnect();

    if (result === null) {
      return null;
    }

    return JSON.parse(result);
  }

  public async set(key: string, value: string): Promise<"OK"> {
    const redis = new Redis(this.options);
    const result = await redis.set(key, value);
    redis.disconnect();
    return result;
  }

  public async addGeneration(generation: Generation) {
    const cachedGenerations = await this.get("generations");
    let generations = cachedGenerations ? cachedGenerations : [];
    generations.push(generation);
    await this.set("generations", JSON.stringify(generations));
  }
  public async addUser(user: User) {
    const cachedUsers = await this.get("users");
    let users = cachedUsers ? cachedUsers : [];
    users.push(user);
    await this.set("users", JSON.stringify(users));
  }

  public async updateOrAddUser(user: User) {
    const cachedUsers = await this.get("users");
    let users = cachedUsers ? cachedUsers : [];

    const userIndex = users.findIndex((u: User) => u.id === user.id);

    if (userIndex !== -1) {
      users[userIndex] = user;

      await this.set("users", JSON.stringify(users));
    } else {
      users.push(user);
      await this.set("users", JSON.stringify(users));
    }
  }

  public async getUserFromEmail(email: string): Promise<User | null> {
    const cachedUsers = await this.get("users");
    let users = cachedUsers ? cachedUsers : [];
    const user = users.find((u: User) => u.email === email);
    return user;
  }
}
