import { config } from "dotenv";
import { defined } from "./type-checks";

config();
export const SERVER_PORT = process.env.PORT || 3000;
export const BOT_TOKEN = defined(process.env.BOT_TOKEN);
