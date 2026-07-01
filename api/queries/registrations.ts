import { eq, and, desc, sql } from "drizzle-orm";
import * as schema from "@db/schema";
import { getDb } from "./connection";

export async function findRegistrationById(id: number) {
  const rows = await getDb()
    .select()
    .from(schema.registrations)
    .where(eq(schema.registrations.id, id))
    .limit(1);
  return rows.at(0);
}

export async function listRegistrations(filters?: {
  studentId?: number;
  examId?: number;
  schoolId?: number;
  parentId?: number;
  status?: string;
}) {
  const db = getDb();
  const conditions = [];

  if (filters?.studentId) {
    conditions.push(eq(schema.registrations.studentId, filters.studentId));
  }
  if (filters?.examId) {
    conditions.push(eq(schema.registrations.examId, filters.examId));
  }
  if (filters?.schoolId) {
    conditions.push(eq(schema.registrations.schoolId, filters.schoolId));
  }
  if (filters?.parentId) {
    conditions.push(eq(schema.registrations.parentId, filters.parentId));
  }
  if (filters?.status) {
    conditions.push(eq(schema.registrations.status, filters.status as "PENDING" | "PAID" | "FAILED" | "CANCELLED"));
  }

  if (conditions.length > 0) {
    return db
      .select()
      .from(schema.registrations)
      .where(and(...conditions))
      .orderBy(desc(schema.registrations.createdAt));
  }

  return db
    .select()
    .from(schema.registrations)
    .orderBy(desc(schema.registrations.createdAt));
}

export async function createRegistration(data: schema.InsertRegistration) {
  const result = await getDb().insert(schema.registrations).values(data);
  return result;
}

export async function createRegistrations(data: schema.InsertRegistration[]) {
  if (data.length === 0) return;
  const result = await getDb().insert(schema.registrations).values(data);
  return result;
}

export async function updateRegistration(id: number, data: Partial<schema.InsertRegistration>) {
  await getDb()
    .update(schema.registrations)
    .set(data)
    .where(eq(schema.registrations.id, id));
}

export async function updateRegistrationsByPaymentId(paymentId: number, data: Partial<schema.InsertRegistration>) {
  await getDb()
    .update(schema.registrations)
    .set(data)
    .where(eq(schema.registrations.paymentId, paymentId));
}

export async function getRegistrationCount() {
  const rows = await getDb()
    .select({ count: sql<number>`count(*)` })
    .from(schema.registrations);
  return rows[0]?.count ?? 0;
}

export async function getRegistrationCountByStatus(status: string) {
  const rows = await getDb()
    .select({ count: sql<number>`count(*)` })
    .from(schema.registrations)
    .where(eq(schema.registrations.status, status as "PENDING" | "PAID" | "FAILED" | "CANCELLED"));
  return rows[0]?.count ?? 0;
}

export async function getRegistrationsByExamId(examId: number) {
  return getDb()
    .select()
    .from(schema.registrations)
    .where(eq(schema.registrations.examId, examId))
    .orderBy(desc(schema.registrations.createdAt));
}

export async function getRegistrationsWithDetails() {
  return getDb().query.registrations.findMany({
    with: {
      student: true,
      exam: true,
      school: true,
      parent: true,
      payment: true,
    },
    orderBy: desc(schema.registrations.createdAt),
  });
}
