import dotenv from "dotenv";
import EventEmitter from "events";
import { exit } from "process";
import { Database } from "./database/Database";

dotenv.config();

if (!process.env.MONGOURI) exit(1);

export const globalEvent = new EventEmitter();
export const db = new Database(process.env.MONGOURI);

async function main() {
  await db.init();
  (await import('./ftp')).default();
  (await import('./subscribers/file-upload')).default();
}

main();