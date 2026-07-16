import { eq, and, desc, sql } from "drizzle-orm";
import * as schema from "@db/schema";
import { getDb } from "./connection";

export async function findPaymentById(id: number) {
  const rows = await getDb()
    .select()
    .from(schema.payments)
    .where(eq(schema.payments.id, id))
    .limit(1);
  return rows.at(0);
}

export async function findPaymentByRazorpayOrderId(orderId: string) {
  const rows = await getDb()
    .select()
    .from(schema.payments)
    .where(eq(schema.payments.razorpayOrderId, orderId))
    .limit(1);
  return rows.at(0);
}

export async function listPayments(filters?: {
  schoolId?: number;
  parentId?: number;
  status?: string;
  payerType?: string;
}) {
  const db = getDb();
  const conditions = [];

  if (filters?.schoolId) {
    conditions.push(eq(schema.payments.schoolId, filters.schoolId));
  }
  if (filters?.parentId) {
    conditions.push(eq(schema.payments.parentId, filters.parentId));
  }
  if (filters?.status) {
    conditions.push(eq(schema.payments.status, filters.status as "CREATED" | "PAID" | "FAILED"));
  }
  if (filters?.payerType) {
    conditions.push(eq(schema.payments.payerType, filters.payerType as "SCHOOL" | "PARENT"));
  }

  if (conditions.length > 0) {
    return db
      .select()
      .from(schema.payments)
      .where(and(...conditions))
      .orderBy(desc(schema.payments.createdAt));
  }

  return db
    .select()
    .from(schema.payments)
    .orderBy(desc(schema.payments.createdAt));
}

export async function createPayment(data: schema.InsertPayment) {
  const result = await getDb().insert(schema.payments).values(data);
  return result;
}

export async function updatePayment(id: number, data: Partial<schema.InsertPayment>) {
  await getDb()
    .update(schema.payments)
    .set(data)
    .where(eq(schema.payments.id, id));
}

export async function getPaymentCount() {
  const rows = await getDb()
    .select({ count: sql<number>`count(*)` })
    .from(schema.payments);
  return rows[0]?.count ?? 0;
}

export async function getTotalRevenue() {
  const rows = await getDb()
    .select({ total: sql<string>`COALESCE(SUM(amount), 0)` })
    .from(schema.payments)
    .where(eq(schema.payments.status, "PAID"));
  return rows[0]?.total ?? "0";
}

export async function getPaymentsByStatus(status: string) {
  return getDb()
    .select()
    .from(schema.payments)
    .where(eq(schema.payments.status, status as "CREATED" | "PAID" | "FAILED"))
    .orderBy(desc(schema.payments.createdAt));
}