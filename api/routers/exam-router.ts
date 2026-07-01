import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createRouter, publicQuery, adminQuery } from "../middleware";
import {
  findExamById,
  listExams,
  createExam,
  updateExam,
  deleteExam,
  getExamCount,
  getLiveExamCount,
} from "../queries/exams";

export const examRouter = createRouter({
  list: publicQuery
    .input(
      z.object({
        isLive: z.boolean().optional(),
        eligibility: z.string().optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      return listExams(input ?? {});
    }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const exam = await findExamById(input.id);
      if (!exam) throw new TRPCError({ code: "NOT_FOUND", message: "Exam not found" });
      return exam;
    }),

  create: adminQuery
    .input(
      z.object({
        name: z.string().min(2),
        examDate: z.string().or(z.date()),
        feePerStudent: z.string().or(z.number()),
        registrationDeadline: z.string().or(z.date()),
        center: z.string().optional(),
        eligibility: z.enum(["SCHOOL_ONLY", "PARENT_ONLY", "BOTH"]).default("BOTH"),
        isLive: z.boolean().default(true),
      })
    )
    .mutation(async ({ input }) => {
      const examDate = typeof input.examDate === "string" ? new Date(input.examDate) : input.examDate;
      const deadline = typeof input.registrationDeadline === "string"
        ? new Date(input.registrationDeadline)
        : input.registrationDeadline;
      const fee = typeof input.feePerStudent === "string"
        ? input.feePerStudent
        : input.feePerStudent.toFixed(2);

      const result = await createExam({
        name: input.name,
        examDate,
        feePerStudent: fee,
        registrationDeadline: deadline,
        center: input.center ?? null,
        eligibility: input.eligibility,
        isLive: input.isLive,
      });

      return { success: true, examId: Number(result[0].insertId) };
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(2).optional(),
        examDate: z.string().or(z.date()).optional(),
        feePerStudent: z.string().or(z.number()).optional(),
        registrationDeadline: z.string().or(z.date()).optional(),
        center: z.string().optional(),
        eligibility: z.enum(["SCHOOL_ONLY", "PARENT_ONLY", "BOTH"]).optional(),
        isLive: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      const updateData: Record<string, unknown> = {};

      if (data.name) updateData.name = data.name;
      if (data.examDate) updateData.examDate = typeof data.examDate === "string" ? new Date(data.examDate) : data.examDate;
      if (data.registrationDeadline) updateData.registrationDeadline = typeof data.registrationDeadline === "string" ? new Date(data.registrationDeadline) : data.registrationDeadline;
      if (data.feePerStudent) updateData.feePerStudent = typeof data.feePerStudent === "string" ? data.feePerStudent : data.feePerStudent.toFixed(2);
      if (data.center !== undefined) updateData.center = data.center;
      if (data.eligibility) updateData.eligibility = data.eligibility;
      if (data.isLive !== undefined) updateData.isLive = data.isLive;

      await updateExam(id, updateData);
      return { success: true };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await deleteExam(input.id);
      return { success: true };
    }),

  count: adminQuery.query(async () => {
    return { total: await getExamCount(), live: await getLiveExamCount() };
  }),
});
