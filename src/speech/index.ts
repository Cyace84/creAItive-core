import speech from "@google-cloud/speech";
import { google } from "@google-cloud/speech/build/protos/protos";
const GOOGLE_APPLICATION_CREDENTIALS = "./google-credentials.json";
const fs = require("fs");

//enum "LINEAR16" | AudioEncoding | "ENCODING_UNSPECIFIED" | "FLAC" | "MULAW" | "AMR" | "AMR_WB" | "OGG_OPUS" | "SPEEX_WITH_HEADER_BYTE" | "WEBM_OPUS"
enum AudioEncoding {
  ENCODING_UNSPECIFIED = "ENCODING_UNSPECIFIED",
  LINEAR16 = "LINEAR16",
  FLAC = "FLAC",
  MULAW = "MULAW",
  AMR = "AMR",
  AMR_WB = "AMR_WB",
  OGG_OPUS = "OGG_OPUS",
  SPEEX_WITH_HEADER_BYTE = "SPEEX_WITH_HEADER_BYTE",
  WEBM_OPUS = "WEBM_OPUS",
}
// Creates a client
const client = new speech.SpeechClient();

export async function voiceToText(
  audioBuffer: Buffer,
  config: google.cloud.speech.v1.IRecognitionConfig = {
    encoding: AudioEncoding.WEBM_OPUS,
    sampleRateHertz: 48000,
    languageCode: "ru-RU",
  },
) {
  const audio = {
    content: audioBuffer.toString("base64"),
  };

  const request = {
    audio: audio,
    config: config,
  };

  const [response] = await client.recognize(request);
  const transcription = response.results
    .map(result => result.alternatives[0].transcript)
    .join("\n");

  return transcription;
}
