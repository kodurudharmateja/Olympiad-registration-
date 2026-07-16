import { eq, and, desc, sql } from "drizzle-orm";
import * as schema from "@db/schema";
import { getDb } from "./connection";

export async function findExamById(id: number) {
  const rows = await getDb()
    .select()
    .from(schema.exams)
    .where(eq(schema.exams.id, id))
    .limit(1);
  return rows.at(0);
}

export async function listExams(filters?: { isLive?: boolean; eligibility?: string }) {
  const db = getDb();
  const conditions = [];

  if (filters?.isLive !== undefined) {
    conditions.push(eq(schema.exams.isLive, filters.isLive));
  }
  if (filters?.eligibility) {
    conditions.push(eq(schema.exams.eligibility, filters.eligibility as "SCHOOL_ONLY" | "PARENT_ONLY" | "BOTH"));
  }

  if (conditions.length > 0) {
    return db
      .select()
      .from(schema.exams)
      .where(and(...conditions))
      .orderBy(desc(schema.exams.examDate));
  }

  return db
    .select()
    .from(schema.exams)
    .orderBy(desc(schema.exams.examDate));
}

export async function createExam(data: schema.InsertExam) {
  const result = await getDb().insert(schema.exams).values(data);
  return result;
}

export async function updateExam(id: number, data: Partial<schema.InsertExam>) {
  await getDb()
    .update(schema.exams)
    .set(data)
    .where(eq(schema.exams.id, id));
}

export async function deleteExam(id: number) {
  await getDb()
    .delete(schema.exams)
    .where(eq(schema.exams.id, id));
}

export async function getExamCount() {
  const rows = await getDb()
    .select({ count: sql<number>`count(*)` })
    .from(schema.exams);
  return rows[0]?.count ?? 0;
}

export async function getLiveExamCount() {
  const rows = await getDb()
    .select({ count: sql<number>`count(*)` })
    .from(schema.exams)
    .where(eq(schema.exams.isLive, true));
  return rows[0]?.count ?? 0;
}