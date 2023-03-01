import { v4 as uuidv4 } from "uuid";
import { JSONDatabase } from "../database";

export const newConversationId = (): string => {
  const db = new JSONDatabase("./src/database/db.json");
  const conversationId = uuidv4();
  if (db.read().hasOwnProperty(conversationId)) {
    return newConversationId();
  }
};
