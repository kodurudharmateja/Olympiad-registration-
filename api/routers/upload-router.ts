import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createRouter, schoolQuery } from "../middleware";
import { createStudents } from "../queries/students";

interface ValidationResult {
  valid: boolean;
  row: Record<string, string>;
  errors: string[];
  index: number;
}

interface CsvRow {
  name?: string;
  class?: string;
  className?: string;
  section?: string;
  rollNumber?: string;
  roll_no?: string;
  rollno?: string;
  gender?: string;
  mobile?: string;
  parentName?: string;
  parent_name?: string;
  [key: string]: string | undefined;
}



function normalizeRow(row: CsvRow): Record<string, string> {
  return {
    name: row.name ?? row.Name ?? "",
    className: row.class ?? row.className ?? row.Class ?? row.class_name ?? "",
    section: row.section ?? row.Section ?? "",
    rollNumber: row.rollNumber ?? row.roll_no ?? row.rollno ?? row["Roll Number"] ?? row["roll number"] ?? "",
    gender: row.gender ?? row.Gender ?? "",
    mobile: row.mobile ?? row.Mobile ?? row.Phone ?? row.phone ?? "",
    parentName: row.parentName ?? row.parent_name ?? row["Parent Name"] ?? row["parent name"] ?? "",
  };
}

function validateRow(row: Record<string, string>, index: number): ValidationResult {
  const errors: string[] = [];

  if (!row.name || row.name.trim().length < 2) {
    errors.push("Name is required (min 2 characters)");
  }

  if (!row.className || row.className.trim().length < 1) {
    errors.push("Class is required");
  }

  const gender = row.gender?.trim().toLowerCase();
  if (!gender || !["male", "female", "other"].includes(gender)) {
    errors.push("Gender must be Male, Female, or Other");
  }

  return {
    valid: errors.length === 0,
    row,
    errors,
    index,
  };
}

export const uploadRouter = createRouter({
  validateCsv: schoolQuery
    .input(
      z.object({
        rows: z.array(z.record(z.string(), z.string().optional())),
      })
    )
    .mutation(async ({ input }) => {
      const normalizedRows = input.rows.map((r, i) => {
        const normalized = normalizeRow(r as CsvRow);
        return validateRow(normalized, i);
      });

      const validRows = normalizedRows.filter((r) => r.valid);
      const invalidRows = normalizedRows.filter((r) => !r.valid);

      // Check for duplicates within the upload
      const seen = new Set<string>();
      for (const row of validRows) {
        const key = `${row.row.name.trim().toLowerCase()}_${row.row.className.trim()}_${row.row.section?.trim() ?? ""}_${row.row.rollNumber?.trim() ?? ""}`;
        if (seen.has(key)) {
          row.valid = false;
          row.errors.push("Duplicate entry in this upload");
        }
        seen.add(key);
      }

      const finalValid = validRows.filter((r) => r.valid);
      const finalInvalid = [...invalidRows, ...validRows.filter((r) => !r.valid)];

      return {
        totalRows: input.rows.length,
        validCount: finalValid.length,
        invalidCount: finalInvalid.length,
        validRows: finalValid.map((r) => r.row),
        invalidRows: finalInvalid.map((r) => ({ row: r.row, errors: r.errors, index: r.index })),
      };
    }),

  importStudents: schoolQuery
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
      if (input.length === 0) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "No students to import" });
      }

      const studentsWithSchool = input.map((s) => ({
        ...s,
        schoolId: ctx.customSession!.id,
      }));

      await createStudents(studentsWithSchool);
      return { success: true, count: input.length };
    }),
});