import { eq, desc, sql } from "drizzle-orm";
import * as schema from "@db/schema";
import { getDb } from "./connection";

export async function findParentById(id: number) {
  const rows = await getDb()
    .select()
    .from(schema.parents)
    .where(eq(schema.parents.id, id))
    .limit(1);
  return rows.at(0);
}

export async function findParentByMobile(mobile: string) {
  const rows = await getDb()
    .select()
    .from(schema.parents)
    .where(eq(schema.parents.mobile, mobile))
    .limit(1);
  return rows.at(0);
}

export async function listParents() {
  return getDb()
    .select()
    .from(schema.parents)
    .orderBy(desc(schema.parents.createdAt));
}

export async function createParent(data: schema.InsertParent) {
  const result = await getDb().insert(schema.parents).values(data);
  return result;
}

export async function updateParent(id: number, data: Partial<schema.InsertParent>) {
  await getDb()
    .update(schema.parents)
    .set(data)
    .where(eq(schema.parents.id, id));
}

export async function getParentCount() {
  const rows = await getDb()
    .select({ count: sql<number>`count(*)` })
    .from(schema.parents);
  return rows[0]?.count ?? 0;
}
