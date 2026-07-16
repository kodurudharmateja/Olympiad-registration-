import { eq } from "drizzle-orm";
import * as schema from "@db/schema";
import { getDb } from "./connection";

export async function findAdminByEmail(email: string) {
  const rows = await getDb()
    .select()
    .from(schema.admins)
    .where(eq(schema.admins.email, email))
    .limit(1);
  return rows.at(0);
}

export async function findAdminById(id: number) {
  const rows = await getDb()
    .select()
    .from(schema.admins)
    .where(eq(schema.admins.id, id))
    .limit(1);
  return rows.at(0);
}