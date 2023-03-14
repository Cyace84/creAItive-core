import express from "express";

import { getGeneration, getGenerations } from "../handlers";

const router = express.Router();

router.get("/generations", getGenerations);
router.get("/generation/:id", getGeneration);

export { router };
