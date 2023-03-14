import express from "express";
import { authMiddleware } from "../../middleware";
import { txtToImg } from "../handlers";
const router = express.Router();

router.post("/text2img", txtToImg);

export { router };
