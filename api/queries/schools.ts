import { eq, like, desc, sql } from "drizzle-orm";
import * as schema from "@db/schema";
import { getDb } from "./connection";

export async function findSchoolById(id: number) {
  const rows = await getDb()
    .select()
    .from(schema.schools)
    .where(eq(schema.schools.id, id))
    .limit(1);
  return rows.at(0);
}

export async function findSchoolByMobile(mobile: string) {
  const rows = await getDb()
    .select()
    .from(schema.schools)
    .where(eq(schema.schools.mobile, mobile))
    .limit(1);
  return rows.at(0);
}

export async function listSchools(search?: string) {
  const db = getDb();
  if (search) {
    return db
      .select()
      .from(schema.schools)
      .where(like(schema.schools.name, `%${search}%`))
      .orderBy(desc(schema.schools.createdAt));
  }
  return db
    .select()
    .from(schema.schools)
    .orderBy(desc(schema.schools.createdAt));
}

export async function createSchool(data: schema.InsertSchool) {
  const result = await getDb().insert(schema.schools).values(data);
  return result;
}

export async function updateSchool(id: number, data: Partial<schema.InsertSchool>) {
  await getDb()
    .update(schema.schools)
    .set(data)
    .where(eq(schema.schools.id, id));
}

export async function getSchoolCount() {
  const rows = await getDb()
    .select({ count: sql<number>`count(*)` })
    .from(schema.schools);
  return rows[0]?.count ?? 0;
}

export async function getActiveSchoolCount() {
  const rows = await getDb()
    .select({ count: sql<number>`count(*)` })
    .from(schema.schools)
    .where(eq(schema.schools.isActive, true));
  return rows[0]?.count ?? 0;
}
