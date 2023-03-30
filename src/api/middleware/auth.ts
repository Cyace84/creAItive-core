import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { User } from "../../entity";
import config from "../../../config";
import { cache } from "../../..";

export default {
  authenticateToken: (
    req: Request & { user?: User },
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const authHeader = req.headers["authorization"];
      const token =
        authHeader &&
        authHeader.split(" ")[1].replace('"', "").replace('"', "");

      if (token == null) return res.sendStatus(401);
      jwt.verify(token, config.JWT_SECRET, async (err: any, user: User) => {
        const cachedUser = await cache.getUserFromEmail(user.email);
        if (err) return res.sendStatus(403);

        req.user = cachedUser;
        next();
      });
    } catch (error) {
      next(error);
    }
  },
  getCallbackUrl: (req: Request, res: Response, next: NextFunction) => {
    const callbackUrl = req.query.callback as string;
    if (callbackUrl) {
      req.callbackUrl = callbackUrl;
    }
    next();
  },
};
