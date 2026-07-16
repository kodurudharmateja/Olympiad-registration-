import { z } from "zod";
import { sql } from "drizzle-orm";
import { createRouter, adminQuery } from "../middleware";
import { getDb } from "../queries/connection";
import * as schema from "@db/schema";

export const reportRouter = createRouter({
  dashboard: adminQuery.query(async () => {
    const db = getDb();

    const [schoolCount] = await db.select({ count: sql<number>`count(*)` }).from(schema.schools);
    const [parentCount] = await db.select({ count: sql<number>`count(*)` }).from(schema.parents);
    const [studentCount] = await db.select({ count: sql<number>`count(*)` }).from(schema.students);
    const [registrationCount] = await db.select({ count: sql<number>`count(*)` }).from(schema.registrations);
    const [paidRegistrationCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(schema.registrations)
      .where(sql`${schema.registrations.status} = 'PAID'`);
    const [pendingRegistrationCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(schema.registrations)
      .where(sql`${schema.registrations.status} = 'PENDING'`);
    const [paymentCount] = await db.select({ count: sql<number>`count(*)` }).from(schema.payments);
    const [paidPaymentCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(schema.payments)
      .where(sql`${schema.payments.status} = 'PAID'`);
    const [totalRevenue] = await db
      .select({ total: sql<string>`COALESCE(SUM(amount), 0)` })
      .from(schema.payments)
      .where(sql`${schema.payments.status} = 'PAID'`);
    const [examCount] = await db.select({ count: sql<number>`count(*)` }).from(schema.exams);
    const [liveExamCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(schema.exams)
      .where(sql`${schema.exams.isLive} = true`);

    return {
      schools: schoolCount?.count ?? 0,
      parents: parentCount?.count ?? 0,
      students: studentCount?.count ?? 0,
      registrations: registrationCount?.count ?? 0,
      paidRegistrations: paidRegistrationCount?.count ?? 0,
      pendingRegistrations: pendingRegistrationCount?.count ?? 0,
      payments: paymentCount?.count ?? 0,
      paidPayments: paidPaymentCount?.count ?? 0,
      totalRevenue: totalRevenue?.total ?? "0",
      exams: examCount?.count ?? 0,
      liveExams: liveExamCount?.count ?? 0,
    };
  }),

  payments: adminQuery
    .input(
      z.object({
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        status: z.string().optional(),
        payerType: z.string().optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const conditions = [];

      if (input?.status) {
        conditions.push(sql`${schema.payments.status} = ${input.status}`);
      }
      if (input?.payerType) {
        conditions.push(sql`${schema.payments.payerType} = ${input.payerType}`);
      }
      if (input?.startDate) {
        conditions.push(sql`${schema.payments.createdAt} >= ${new Date(input.startDate)}`);
      }
      if (input?.endDate) {
        conditions.push(sql`${schema.payments.createdAt} <= ${new Date(input.endDate)}`);
      }

      const query = db
        .select({
          id: schema.payments.id,
          razorpayOrderId: schema.payments.razorpayOrderId,
          razorpayPaymentId: schema.payments.razorpayPaymentId,
          amount: schema.payments.amount,
          payerType: schema.payments.payerType,
          status: schema.payments.status,
          receiptNumber: schema.payments.receiptNumber,
          createdAt: schema.payments.createdAt,
          schoolName: schema.schools.name,
          parentName: schema.parents.name,
        })
        .from(schema.payments)
        .leftJoin(schema.schools, sql`${schema.schools.id} = ${schema.payments.schoolId}`)
        .leftJoin(schema.parents, sql`${schema.parents.id} = ${schema.payments.parentId}`)
        .orderBy(sql`${schema.payments.createdAt} DESC`);

      if (conditions.length > 0) {
        return query.where(sql`${conditions.reduce((a, b) => sql`${a} AND ${b}`)}`);
      }
      return query;
    }),

  registrationsByExam: adminQuery
    .input(z.object({ examId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();

      const [totalRegs] = await db
        .select({ count: sql<number>`count(*)` })
        .from(schema.registrations)
        .where(sql`${schema.registrations.examId} = ${input.examId}`);

      const [paidRegs] = await db
        .select({ count: sql<number>`count(*)` })
        .from(schema.registrations)
        .where(sql`${schema.registrations.examId} = ${input.examId} AND ${schema.registrations.status} = 'PAID'`);

      const [schoolRegs] = await db
        .select({ count: sql<number>`count(DISTINCT ${schema.registrations.schoolId})` })
        .from(schema.registrations)
        .where(sql`${schema.registrations.examId} = ${input.examId} AND ${schema.registrations.schoolId} IS NOT NULL`);

      const [parentRegs] = await db
        .select({ count: sql<number>`count(DISTINCT ${schema.registrations.parentId})` })
        .from(schema.registrations)
        .where(sql`${schema.registrations.examId} = ${input.examId} AND ${schema.registrations.parentId} IS NOT NULL`);

      const [revenue] = await db
        .select({ total: sql<string>`COALESCE(SUM(${schema.payments.amount}), 0)` })
        .from(schema.payments)
        .innerJoin(schema.registrations, sql`${schema.registrations.paymentId} = ${schema.payments.id}`)
        .where(sql`${schema.registrations.examId} = ${input.examId} AND ${schema.payments.status} = 'PAID'`);

      const details = await db
        .select({
          id: schema.registrations.id,
          status: schema.registrations.status,
          createdAt: schema.registrations.createdAt,
          studentName: schema.students.name,
          studentClass: schema.students.className,
          schoolName: schema.schools.name,
          parentName: schema.parents.name,
          paymentStatus: schema.payments.status,
          amount: schema.payments.amount,
        })
        .from(schema.registrations)
        .leftJoin(schema.students, sql`${schema.students.id} = ${schema.registrations.studentId}`)
        .leftJoin(schema.schools, sql`${schema.schools.id} = ${schema.registrations.schoolId}`)
        .leftJoin(schema.parents, sql`${schema.parents.id} = ${schema.registrations.parentId}`)
        .leftJoin(schema.payments, sql`${schema.payments.id} = ${schema.registrations.paymentId}`)
        .where(sql`${schema.registrations.examId} = ${input.examId}`)
        .orderBy(sql`${schema.registrations.createdAt} DESC`);

      return {
        examId: input.examId,
        totalRegistrations: totalRegs?.count ?? 0,
        paidRegistrations: paidRegs?.count ?? 0,
        schoolCount: schoolRegs?.count ?? 0,
        parentCount: parentRegs?.count ?? 0,
        revenue: revenue?.total ?? "0",
        details,
      };
    }),

  registrationsByDate: adminQuery
    .input(
      z.object({
        startDate: z.string(),
        endDate: z.string(),
      })
    )
    .query(async ({ input }) => {
      const db = getDb();
      const start = new Date(input.startDate);
      const end = new Date(input.endDate);

      return db
        .select({
          id: schema.registrations.id,
          status: schema.registrations.status,
          createdAt: schema.registrations.createdAt,
          studentName: schema.students.name,
          studentClass: schema.students.className,
          examName: schema.exams.name,
          schoolName: schema.schools.name,
          parentName: schema.parents.name,
        })
        .from(schema.registrations)
        .leftJoin(schema.students, sql`${schema.students.id} = ${schema.registrations.studentId}`)
        .leftJoin(schema.exams, sql`${schema.exams.id} = ${schema.registrations.examId}`)
        .leftJoin(schema.schools, sql`${schema.schools.id} = ${schema.registrations.schoolId}`)
        .leftJoin(schema.parents, sql`${schema.parents.id} = ${schema.registrations.parentId}`)
        .where(sql`${schema.registrations.createdAt} BETWEEN ${start} AND ${end}`)
        .orderBy(sql`${schema.registrations.createdAt} DESC`);
    }),
});