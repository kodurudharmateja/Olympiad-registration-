import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";
import { env } from "../lib/env";
import * as schema from "@db/schema";
import * as relations from "@db/relations";

const fullSchema = { ...schema, ...relations };

let instance: ReturnType<typeof initDb>;

function initDb() {
  const caPath = path.resolve(process.cwd(), "db/ca.pem");
  const pool = mysql.createPool({
    uri: env.databaseUrl,
    ssl: {
      ca: fs.readFileSync(caPath),
      rejectUnauthorized: true,
    }
  });
  return drizzle(pool, {
    mode: "planetscale",
    schema: fullSchema,
  });
}

export function getDb() {
  if (!instance) {
    instance = initDb();
  }
  return instance;
}