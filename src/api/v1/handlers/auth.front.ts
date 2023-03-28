import { Request, Response, NextFunction } from "express";
import { cache } from "../../../..";
import config from "../../../../config";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function authFront(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const callbackURL = req.query.callbackUrl as string;
  if (!callbackURL) {
    return res.status(400).send("Missing callback URL");
  }

  await cache.set("callbackURL", JSON.stringify(callbackURL));

  res.redirect(`${config.SELF_URL}/auth/google`);
}
