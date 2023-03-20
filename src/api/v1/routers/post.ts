import express from "express";
import { authMiddleware } from "../../middleware";
import { transcriptVoice, txtToImg } from "../handlers";
const router = express.Router();

router.post("/text2img", txtToImg);
router.post("/transcript", transcriptVoice);

export { router };
