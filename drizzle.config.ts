import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import fs from "fs";
import path from "path";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required to run drizzle commands");
}

const caPath = path.resolve(process.cwd(), "db/ca.pem");

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dialect: "mysql",
  dbCredentials: {
    url: connectionString,
    ssl: {
      ca: fs.readFileSync(caPath).toString(),
      rejectUnauthorized: true,
    }
  },
});