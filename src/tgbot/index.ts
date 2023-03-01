// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { version } from "./../../package.json";
import { BOT_TOKEN, SERVER_PORT } from "./config";
import { Telegraf } from "telegraf";
import { voiceToText } from "../speech";
import { SD } from "../sd";
import { TextToImageRequest } from "../sd/types";
import { PromptGPT } from "./../prompts";
import { templateRequest } from "../prompts/templates";
import { JSONDatabase } from "../database";
const translate = require("translate-google");
const fetch = require("node-fetch");
const fs = require("fs");
const cors = require("cors");
const express = require("express");

const bot = new Telegraf(BOT_TOKEN);

bot.start(async ctx => {
  const message = `Hello, ${ctx.from.first_name}!`;

  ctx.reply("1");
});

bot.on("voice", async ctx => {
  const db = new JSONDatabase("./src/database/db.json");
  const messageId = ctx.message.message_id;
  const file = await ctx.telegram.getFile(ctx.message.voice.file_id);
  const voiceUrl = `http://api.telegram.org/file/bot${BOT_TOKEN}/${file.file_path}`;

  // Fetch the voice message
  const responseTr = await fetch(voiceUrl);
  const buffer = await responseTr.buffer();

  // Save the voice message to a file
  fs.writeFileSync("./temp.ogg", buffer);

  // Read the contents of the file
  const audio = {
    content: fs.readFileSync("./temp.ogg").toString("base64"),
  };

  // Pass the audio to the speech-to-text API
  const transcription = await voiceToText(audio);
  await ctx.reply(transcription);
  console.log(4312312);
  const promptGPT = new PromptGPT(process.env.OPENAI_API_KEY);
  console.log(312312);
  const { prompts, negativePrompts, data } = await promptGPT.generatePrompt(
    transcription,
    db.lastConversationId,
  );
  console.log(data);
  await ctx.reply(
    `Model: ${
      data.model
    }\n\n${prompts}\n\n${negativePrompts}\n\n${JSON.stringify(data.usage)}`,
  );

  const url = process.env.BACKEND_URL;
  const sd = new SD(url, "admin", "admin");
  const sdRequest: TextToImageRequest = {
    sampler_name: "Euler",
    text: " ",
    prompt: prompts[0],
    negative_prompt: negativePrompts[0],
  };
  // const response = await sd.getTextToImage(sdRequest);
  // const requests = await db.read();

  // const lastId =
  //   db.nextId !== "0" ? Number(db.nextId) - 1 : db.nextId.toString();
  // console.log(4444312312);
  // const request = requests[lastId];
  // request.images = response.images;
  // request.completed = true;
  // await db.update(request);

  // const image = {
  //   source: Buffer.from(response.images[0], "base64"),
  //   filename: "image.png",
  // };
  // await ctx.sendPhoto(image, { reply_to_message_id: messageId });
});

bot.launch();

const app = express();

app.use(cors());

// define a route handler
app.route("/").get(async (req, res) => {
  res.json({
    app: "tgbot",
    service: "sd-visualizer",
    status: "OK",
    status_code: 200,
    version,
  });
});

// Start the Express server
app.listen(SERVER_PORT, () => {
  console.log(`Server started at http://localhost:${SERVER_PORT}`);
});
