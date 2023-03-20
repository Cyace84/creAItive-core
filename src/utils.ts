import crypto from "crypto";
import config from "../config";
import { cache } from "..";

export function encryptModelKey(modelKey: string, secretKey: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(secretKey, "hex").subarray(0, 32),
    iv,
  );
  let encrypted = cipher.update(modelKey);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
}

export function decryptModelKey(
  encryptedModelKey: string,
  secretKey: string,
): string {
  const [ivHex, encryptedHex] = encryptedModelKey.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const encrypted = Buffer.from(encryptedHex, "hex");
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(secretKey, "hex").subarray(0, 32),
    iv,
  );
  let decrypted = decipher.update(encrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

export const getSDModelKey = async (modelId: number): Promise<string> => {
  const sdModels = await cache.get("stableDiffusionModels");
  console.log("sdModels", sdModels)
  const modelKey = sdModels.find( (model: any) => model.id === modelId).modelKey;
  if (modelKey) {
    return modelKey;
  }
  throw new Error("No model key found");
};

import zlib from "zlib";

export const compressImage = (imageData: string): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const buffer = Buffer.from(imageData, "base64");
    zlib.gzip(buffer, (err, compressedBuffer) => {
      if (err) {
        reject(err);
      } else {
        resolve(compressedBuffer);
      }
    });
  });
};

export const decompressImage = (compressedData: Buffer): Promise<string> => {
  return new Promise((resolve, reject) => {
    zlib.gunzip(compressedData, (err, uncompressedBuffer) => {
      if (err) {
        reject(err);
      } else {
        const uncompressedData = uncompressedBuffer.toString("base64");
        resolve(uncompressedData);
      }
    });
  });
};

export const compressImages = async (images: string[]): Promise<Buffer> => {
  const promises = images.map(str => {
    return compressImage(str);
  });

  const compressedBuffers = await Promise.all(promises);
  const combinedBuffer = Buffer.concat(compressedBuffers);
  return combinedBuffer;
};
