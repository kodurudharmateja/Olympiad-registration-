import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createRouter, adminQuery, schoolQuery, parentQuery } from "../middleware";
import {
  findStudentById,
  listStudents,
  createStudent,
  createStudents,
  updateStudent,
  deleteStudent,
  getStudentCount,
} from "../queries/students";

export const studentRouter = createRouter({
  list: adminQuery
    .input(
      z.object({
        schoolId: z.number().optional(),
        parentId: z.number().optional(),
        className: z.string().optional(),
        search: z.string().optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      return listStudents(input ?? {});
    }),

  getById: adminQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const student = await findStudentById(input.id);
      if (!student) throw new TRPCError({ code: "NOT_FOUND", message: "Student not found" });
      return student;
    }),

  create: adminQuery
    .input(
      z.object({
        name: z.string().min(2),
        className: z.string().min(1),
        section: z.string().optional(),
        rollNumber: z.string().optional(),
        gender: z.string().min(1),
        mobile: z.string().optional(),
        parentName: z.string().optional(),
        schoolName: z.string().optional(),
        schoolId: z.number().optional(),
        parentId: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const result = await createStudent(input);
      return { success: true, studentId: Number(result[0].insertId) };
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(2).optional(),
        className: z.string().optional(),
        section: z.string().optional(),
        rollNumber: z.string().optional(),
        gender: z.string().optional(),
        mobile: z.string().optional(),
        parentName: z.string().optional(),
        schoolName: z.string().optional(),
        schoolId: z.number().optional(),
        parentId: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      await updateStudent(id, data);
      return { success: true };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await deleteStudent(input.id);
      return { success: true };
    }),

  count: adminQuery.query(async () => {
    return getStudentCount();
  }),

  // ─── School endpoints ───
  listBySchool: schoolQuery.query(async ({ ctx }) => {
    return listStudents({ schoolId: ctx.customSession!.id });
  }),

  createBySchool: schoolQuery
    .input(
      z.object({
        name: z.string().min(2),
        className: z.string().min(1),
        section: z.string().optional(),
        rollNumber: z.string().optional(),
        gender: z.string().min(1),
        mobile: z.string().optional(),
        parentName: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const result = await createStudent({
        ...input,
        schoolId: ctx.customSession!.id,
      });
      return { success: true, studentId: Number(result[0].insertId) };
    }),

  bulkCreateBySchool: schoolQuery
    .input(
      z.array(
        z.object({
          name: z.string().min(1),
          className: z.string().min(1),
          section: z.string().optional(),
          rollNumber: z.string().optional(),
          gender: z.string().min(1),
          mobile: z.string().optional(),
          parentName: z.string().optional(),
        })
      )
    )
    .mutation(async ({ input, ctx }) => {
      if (input.length === 0) return { success: true, count: 0 };

      const studentsWithSchool = input.map((s) => ({
        ...s,
        schoolId: ctx.customSession!.id,
      }));

      await createStudents(studentsWithSchool);
      return { success: true, count: input.length };
    }),

  // ─── Parent endpoints ───
  listByParent: parentQuery.query(async ({ ctx }) => {
    return listStudents({ parentId: ctx.customSession!.id });
  }),

  createByParent: parentQuery
    .input(
      z.object({
        name: z.string().min(2),
        className: z.string().min(1),
        section: z.string().optional(),
        rollNumber: z.string().optional(),
        gender: z.string().min(1),
        mobile: z.string().optional(),
        parentName: z.string().optional(),
        schoolName: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const result = await createStudent({
        ...input,
        parentId: ctx.customSession!.id,
      });
      return { success: true, studentId: Number(result[0].insertId) };
    }),
});