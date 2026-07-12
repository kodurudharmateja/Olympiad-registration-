import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "../middleware";
import { getDb } from "../queries/connection";
import * as schema from "@db/schema";
import { sql, eq } from "drizzle-orm";

export const syllabusRouter = createRouter({
  // Public — no auth. Anyone visiting the site can call this.
  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(schema.syllabus).orderBy(sql`${schema.syllabus.createdAt} DESC`);
  }),

  // Admin only — same guard as your other admin mutations.
  create: adminQuery
    .input(
      z.object({
        examName: z.string().min(1),
        content: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.insert(schema.syllabus).values({
        examName: input.examName,
        content: input.content,
      });
      return { success: true };
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.number(),
        examName: z.string().min(1),
        content: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(schema.syllabus)
        .set({ examName: input.examName, content: input.content })
        .where(eq(schema.syllabus.id, input.id));
      return { success: true };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(schema.syllabus).where(eq(schema.syllabus.id, input.id));
      return { success: true };
    }),
});