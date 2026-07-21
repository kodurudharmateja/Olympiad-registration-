import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createRouter, publicQuery, adminQuery } from "../middleware";
import { findAdminByFirebaseUid, findAdminById } from "../queries/admins";
import { createCustomSession, getCustomCookieName } from "../custom-auth";
import { getDb } from "../queries/connection";

import * as schema from "@db/schema";
import { sql } from "drizzle-orm";
import * as cookie from "cookie";
import { getSerializeCookieOptions } from "../lib/cookies";

export const adminRouter = createRouter({
  login: publicQuery
    .input(
      z.object({
        idToken: z.string().min(1),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { verifyFirebaseToken } = await import("../firebase/auth");
      const decoded = await verifyFirebaseToken(input.idToken);
      if (!decoded) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid Firebase token" });
      }

      // Check for Admin mapped to this Firebase UID
      const admin = await findAdminByFirebaseUid(decoded.uid);
      if (!admin) {
        throw new TRPCError({ 
          code: "UNAUTHORIZED", 
          message: "No administrator account linked to this Firebase identity." 
        });
      }

      const token = await createCustomSession(admin.id, "ADMIN");

      ctx.resHeaders.append(
        "set-cookie",
        cookie.serialize(getCustomCookieName(), token, {
          ...getSerializeCookieOptions(ctx.req.headers),
          maxAge: 30 * 24 * 60 * 60,
        })
      );

      return { success: true, admin: { id: admin.id, email: admin.email, name: admin.name } };
    }),

  me: publicQuery.query(async ({ ctx }) => {
    if (!ctx.customSession || ctx.customSession.type !== "ADMIN") {
      return null;
    }
    const admin = await findAdminById(ctx.customSession.id);
    if (!admin) return null;
    return { id: admin.id, email: admin.email, name: admin.name };
  }),

  logout: publicQuery.mutation(async ({ ctx }) => {
    ctx.resHeaders.append(
      "set-cookie",
      cookie.serialize(getCustomCookieName(), "", {
        ...getSerializeCookieOptions(ctx.req.headers),
        maxAge: 0,
      })
    );
    return { success: true };
  }),

  dashboard: adminQuery.query(async () => {
    const db = getDb();

    const [schoolCount] = await db.select({ count: sql<number>`count(*)` }).from(schema.schools);
    const [parentCount] = await db.select({ count: sql<number>`count(*)` }).from(schema.parents);
    const [studentCount] = await db.select({ count: sql<number>`count(*)` }).from(schema.students);
    const [registrationCount] = await db.select({ count: sql<number>`count(*)` }).from(schema.registrations);
    const [paymentCount] = await db.select({ count: sql<number>`count(*)` }).from(schema.payments);
    const [revenueResult] = await db
      .select({ total: sql<string>`COALESCE(SUM(amount), 0)` })
      .from(schema.payments)
      .where(sql`${schema.payments.status} = 'PAID'`);
    const [pendingRegistrations] = await db
      .select({ count: sql<number>`count(*)` })
      .from(schema.registrations)
      .where(sql`${schema.registrations.status} = 'PENDING'`);
    const [paidRegistrations] = await db
      .select({ count: sql<number>`count(*)` })
      .from(schema.registrations)
      .where(sql`${schema.registrations.status} = 'PAID'`);
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
      payments: paymentCount?.count ?? 0,
      totalRevenue: revenueResult?.total ?? "0",
      pendingRegistrations: pendingRegistrations?.count ?? 0,
      paidRegistrations: paidRegistrations?.count ?? 0,
      exams: examCount?.count ?? 0,
      liveExams: liveExamCount?.count ?? 0,
    };
  }),

  examBreakdown: adminQuery.query(async () => {
    const db = getDb();
    const examsList = await db.select().from(schema.exams).orderBy(sql`${schema.exams.examDate} DESC`);

    const breakdown = [];
    for (const exam of examsList) {
      const [regCount] = await db
        .select({ count: sql<number>`count(*)` })
        .from(schema.registrations)
        .where(sql`${schema.registrations.examId} = ${exam.id}`);
      const [paidCount] = await db
        .select({ count: sql<number>`count(*)` })
        .from(schema.registrations)
        .where(sql`${schema.registrations.examId} = ${exam.id} AND ${schema.registrations.status} = 'PAID'`);
      const [revenue] = await db
        .select({ total: sql<string>`COALESCE(SUM(${schema.payments.amount}), 0)` })
        .from(schema.payments)
        .innerJoin(schema.registrations, sql`${schema.registrations.paymentId} = ${schema.payments.id}`)
        .where(sql`${schema.registrations.examId} = ${exam.id} AND ${schema.payments.status} = 'PAID'`);

      breakdown.push({
        examId: exam.id,
        examName: exam.name,
        examDate: exam.examDate,
        totalRegistrations: regCount?.count ?? 0,
        paidRegistrations: paidCount?.count ?? 0,
        revenue: revenue?.total ?? "0",
      });
    }

    return breakdown;
  }),
});