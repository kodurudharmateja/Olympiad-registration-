import { eq, and, like, desc, sql, inArray } from "drizzle-orm";
import * as schema from "@db/schema";
import { getDb } from "./connection";

export async function findStudentById(id: number) {
  const rows = await getDb()
    .select()
    .from(schema.students)
    .where(eq(schema.students.id, id))
    .limit(1);
  return rows.at(0);
}

export async function listStudents(filters?: {
  schoolId?: number;
  parentId?: number;
  className?: string;
  search?: string;
}) {
  const db = getDb();
  const conditions = [];

  if (filters?.schoolId) {
    conditions.push(eq(schema.students.schoolId, filters.schoolId));
  }
  if (filters?.parentId) {
    conditions.push(eq(schema.students.parentId, filters.parentId));
  }
  if (filters?.className) {
    conditions.push(eq(schema.students.className, filters.className));
  }
  if (filters?.search) {
    conditions.push(like(schema.students.name, `%${filters.search}%`));
  }

  if (conditions.length > 0) {
    return db
      .select()
      .from(schema.students)
      .where(and(...conditions))
      .orderBy(desc(schema.students.createdAt));
  }

  return db
    .select()
    .from(schema.students)
    .orderBy(desc(schema.students.createdAt));
}

export async function createStudent(data: schema.InsertStudent) {
  const result = await getDb().insert(schema.students).values(data);
  return result;
}

export async function createStudents(data: schema.InsertStudent[]) {
  if (data.length === 0) return;
  const result = await getDb().insert(schema.students).values(data);
  return result;
}

export async function updateStudent(id: number, data: Partial<schema.InsertStudent>) {
  await getDb()
    .update(schema.students)
    .set(data)
    .where(eq(schema.students.id, id));
}

export async function deleteStudent(id: number) {
  await getDb()
    .delete(schema.students)
    .where(eq(schema.students.id, id));
}

export async function getStudentCount() {
  const rows = await getDb()
    .select({ count: sql<number>`count(*)` })
    .from(schema.students);
  return rows[0]?.count ?? 0;
}

export async function getStudentsByIds(ids: number[]) {
  if (ids.length === 0) return [];
  return getDb()
    .select()
    .from(schema.students)
    .where(inArray(schema.students.id, ids));
}