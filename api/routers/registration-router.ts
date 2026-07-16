import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { sql } from "drizzle-orm";
import { createRouter, adminQuery, schoolQuery, parentQuery } from "../middleware";
import {
  findRegistrationById,
  listRegistrations,
  createRegistration,
  createRegistrations,
  updateRegistration,
  getRegistrationCount,
  getRegistrationCountByStatus,
  getRegistrationsByExamId,
} from "../queries/registrations";
import { findExamById } from "../queries/exams";
import { findStudentById } from "../queries/students";
import { getDb } from "../queries/connection";
import * as schema from "@db/schema";

export const registrationRouter = createRouter({
  list: adminQuery
    .input(
      z.object({
        examId: z.number().optional(),
        schoolId: z.number().optional(),
        parentId: z.number().optional(),
        status: z.string().optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      return listRegistrations(input ?? {});
    }),

  getById: adminQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const reg = await findRegistrationById(input.id);
      if (!reg) throw new TRPCError({ code: "NOT_FOUND", message: "Registration not found" });
      return reg;
    }),

  create: adminQuery
    .input(
      z.object({
        studentId: z.number(),
        examId: z.number(),
        schoolId: z.number().optional(),
        parentId: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const result = await createRegistration(input);
      return { success: true, registrationId: Number(result[0].insertId) };
    }),

  updateStatus: adminQuery
    .input(z.object({ id: z.number(), status: z.enum(["PENDING", "PAID", "FAILED", "CANCELLED"]) }))
    .mutation(async ({ input }) => {
      await updateRegistration(input.id, { status: input.status });
      return { success: true };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await getDb().delete(schema.registrations).where(sql`${schema.registrations.id} = ${input.id}`);
      return { success: true };
    }),

  count: adminQuery.query(async () => {
    return {
      total: await getRegistrationCount(),
      pending: await getRegistrationCountByStatus("PENDING"),
      paid: await getRegistrationCountByStatus("PAID"),
      failed: await getRegistrationCountByStatus("FAILED"),
      cancelled: await getRegistrationCountByStatus("CANCELLED"),
    };
  }),

  byExam: adminQuery
    .input(z.object({ examId: z.number() }))
    .query(async ({ input }) => {
      return getRegistrationsByExamId(input.examId);
    }),

  // ─── School endpoints ───
  listBySchool: schoolQuery.query(async ({ ctx }) => {
    return listRegistrations({ schoolId: ctx.customSession!.id });
  }),

  createBulkBySchool: schoolQuery
    .input(
      z.object({
        examId: z.number(),
        studentIds: z.array(z.number()).min(1),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const exam = await findExamById(input.examId);
      if (!exam) throw new TRPCError({ code: "NOT_FOUND", message: "Exam not found" });

      const schoolId = ctx.customSession!.id;
      const registrations = input.studentIds.map((studentId) => ({
        studentId,
        examId: input.examId,
        schoolId,
        status: "PENDING" as const,
      }));

      await createRegistrations(registrations);
      return { success: true, count: registrations.length };
    }),

  // ─── Parent endpoints ───
  listByParent: parentQuery.query(async ({ ctx }) => {
    return listRegistrations({ parentId: ctx.customSession!.id });
  }),

  createByParent: parentQuery
    .input(
      z.object({
        studentId: z.number(),
        examId: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const exam = await findExamById(input.examId);
      if (!exam) throw new TRPCError({ code: "NOT_FOUND", message: "Exam not found" });

      const student = await findStudentById(input.studentId);
      if (!student) throw new TRPCError({ code: "NOT_FOUND", message: "Student not found" });

      const result = await createRegistration({
        studentId: input.studentId,
        examId: input.examId,
        parentId: ctx.customSession!.id,
        status: "PENDING",
      });

      return { success: true, registrationId: Number(result[0].insertId) };
    }),

  // ─── Detailed list with joins ───
  listDetailed: adminQuery.query(async () => {
    const db = getDb();
    const regs = await db
      .select({
        id: schema.registrations.id,
        status: schema.registrations.status,
        createdAt: schema.registrations.createdAt,
        studentName: schema.students.name,
        studentClass: schema.students.className,
        studentSection: schema.students.section,
        examName: schema.exams.name,
        examDate: schema.exams.examDate,
        examFee: schema.exams.feePerStudent,
        schoolName: schema.schools.name,
        parentName: schema.parents.name,
        paymentStatus: schema.payments.status,
        paymentAmount: schema.payments.amount,
        receiptNumber: schema.payments.receiptNumber,
      })
      .from(schema.registrations)
      .leftJoin(schema.students, sql`${schema.students.id} = ${schema.registrations.studentId}`)
      .leftJoin(schema.exams, sql`${schema.exams.id} = ${schema.registrations.examId}`)
      .leftJoin(schema.schools, sql`${schema.schools.id} = ${schema.registrations.schoolId}`)
      .leftJoin(schema.parents, sql`${schema.parents.id} = ${schema.registrations.parentId}`)
      .leftJoin(schema.payments, sql`${schema.payments.id} = ${schema.registrations.paymentId}`)
      .orderBy(sql`${schema.registrations.createdAt} DESC`);

    return regs;
  }),
});