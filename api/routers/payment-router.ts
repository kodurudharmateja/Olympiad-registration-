import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { sql } from "drizzle-orm";
import { createRouter, publicQuery, adminQuery, schoolQuery, parentQuery } from "../middleware";
import {
  findPaymentById,
  findPaymentByRazorpayOrderId,
  listPayments,
  createPayment,
  updatePayment,
  getPaymentCount,
  getTotalRevenue,
} from "../queries/payments";
import { findExamById } from "../queries/exams";
import { getStudentsByIds } from "../queries/students";
import { createRegistration, updateRegistrationsByPaymentId } from "../queries/registrations";
import { getDb } from "../queries/connection";
import * as schema from "@db/schema";

// ─── Razorpay Simulation (development mode) ───
// In production, replace with actual Razorpay SDK calls
let orderCounter = 1000;
function generateOrderId() {
  orderCounter++;
  return `order_${Date.now()}_${orderCounter}`;
}

function generateReceiptNumber() {
  return `RCP-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

function generatePaymentId() {
  return `pay_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
}

export const paymentRouter = createRouter({
  // ─── Create Order (initiates payment) ───
  createOrder: publicQuery
    .input(
      z.object({
        examId: z.number(),
        payerType: z.enum(["SCHOOL", "PARENT"]),
        studentIds: z.array(z.number()).min(1),
        schoolId: z.number().optional(),
        parentId: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const exam = await findExamById(input.examId);
      if (!exam) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Exam not found" });
      }

      // Validate students
      const students = await getStudentsByIds(input.studentIds);
      if (students.length !== input.studentIds.length) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Some students not found" });
      }

      // Server-side amount calculation (never trust client)
      const feePerStudent = parseFloat(exam.feePerStudent.toString());
      const totalAmount = (feePerStudent * input.studentIds.length * 100).toFixed(0); // in paise

      // Create Razorpay order (simulated)
      const razorpayOrderId = generateOrderId();

      // Create payment record
      const paymentData: schema.InsertPayment = {
        razorpayOrderId,
        amount: (feePerStudent * input.studentIds.length).toFixed(2),
        payerType: input.payerType,
        schoolId: input.payerType === "SCHOOL" ? input.schoolId ?? null : null,
        parentId: input.payerType === "PARENT" ? input.parentId ?? null : null,
        status: "CREATED",
      };

      const result = await createPayment(paymentData);
      const paymentId = Number(result[0].insertId);

      // Create pending registrations for each student
      for (const studentId of input.studentIds) {
        await createRegistration({
          studentId,
          examId: input.examId,
          schoolId: input.payerType === "SCHOOL" ? input.schoolId ?? null : null,
          parentId: input.payerType === "PARENT" ? input.parentId ?? null : null,
          paymentId,
          status: "PENDING",
        });
      }

      return {
        success: true,
        orderId: razorpayOrderId,
        paymentId,
        amount: parseInt(totalAmount), // in paise for Razorpay
        currency: "INR",
        examName: exam.name,
        studentCount: input.studentIds.length,
        feePerStudent,
      };
    }),

  // ─── Verify Payment (after Razorpay checkout) ───
  verify: publicQuery
    .input(
      z.object({
        razorpayPaymentId: z.string(),
        razorpayOrderId: z.string(),
        razorpaySignature: z.string(),
        paymentId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      // In production, verify HMAC signature here
      // For development, we simulate success

      const payment = await findPaymentById(input.paymentId);
      if (!payment) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Payment not found" });
      }

      if (payment.status === "PAID") {
        return { success: true, alreadyProcessed: true };
      }

      // Update payment status
      const receiptNumber = generateReceiptNumber();
      await updatePayment(payment.id, {
        status: "PAID",
        razorpayPaymentId: input.razorpayPaymentId,
        receiptNumber,
      });

      // Update all linked registrations
      await updateRegistrationsByPaymentId(payment.id, { status: "PAID" });

      return {
        success: true,
        receiptNumber,
        amount: payment.amount,
      };
    }),

  // ─── Webhook handler (idempotent) ───
  webhook: publicQuery
    .input(
      z.object({
        event: z.string(),
        payload: z.record(z.string(), z.unknown()),
      })
    )
    .mutation(async ({ input }) => {
      // In production, verify webhook signature here
      const orderId = input.payload.order_id as string | undefined;
      if (!orderId) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Order ID missing" });
      }

      const payment = await findPaymentByRazorpayOrderId(orderId);
      if (!payment) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Payment not found" });
      }

      if (payment.status === "PAID") {
        return { success: true, alreadyProcessed: true };
      }

      if (input.event === "payment.captured" || input.event === "order.paid") {
        const receiptNumber = generateReceiptNumber();
        await updatePayment(payment.id, {
          status: "PAID",
          razorpayPaymentId: (input.payload.payment_id as string) ?? generatePaymentId(),
          receiptNumber,
        });
        await updateRegistrationsByPaymentId(payment.id, { status: "PAID" });
      } else if (input.event === "payment.failed") {
        await updatePayment(payment.id, { status: "FAILED" });
        await updateRegistrationsByPaymentId(payment.id, { status: "FAILED" });
      }

      return { success: true };
    }),

  // ─── Simulate Payment (for demo/testing) ───
  simulate: publicQuery
    .input(z.object({ paymentId: z.number() }))
    .mutation(async ({ input }) => {
      const payment = await findPaymentById(input.paymentId);
      if (!payment) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Payment not found" });
      }

      if (payment.status === "PAID") {
        return { success: true, alreadyProcessed: true, receiptNumber: payment.receiptNumber };
      }

      const receiptNumber = generateReceiptNumber();
      const razorpayPaymentId = generatePaymentId();

      await updatePayment(payment.id, {
        status: "PAID",
        razorpayPaymentId,
        receiptNumber,
      });

      await updateRegistrationsByPaymentId(payment.id, { status: "PAID" });

      return { success: true, receiptNumber, razorpayPaymentId };
    }),

  // ─── List payments ───
  list: adminQuery
    .input(
      z.object({
        status: z.string().optional(),
        payerType: z.string().optional(),
        schoolId: z.number().optional(),
        parentId: z.number().optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      return listPayments(input ?? {});
    }),

  getById: adminQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const payment = await findPaymentById(input.id);
      if (!payment) throw new TRPCError({ code: "NOT_FOUND", message: "Payment not found" });
      return payment;
    }),

  count: adminQuery.query(async () => {
    return {
      total: await getPaymentCount(),
      totalRevenue: await getTotalRevenue(),
    };
  }),

  // ─── School endpoints ───
  listBySchool: schoolQuery.query(async ({ ctx }) => {
    return listPayments({ schoolId: ctx.customSession!.id });
  }),

  // ─── Parent endpoints ───
  listByParent: parentQuery.query(async ({ ctx }) => {
    return listPayments({ parentId: ctx.customSession!.id });
  }),

  // ─── Receipt data ───
  getReceipt: publicQuery
    .input(z.object({ paymentId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const payment = await findPaymentById(input.paymentId);
      if (!payment) throw new TRPCError({ code: "NOT_FOUND", message: "Payment not found" });

      const regs = await db
        .select({
          registrationId: schema.registrations.id,
          studentName: schema.students.name,
          studentClass: schema.students.className,
          studentSection: schema.students.section,
          examName: schema.exams.name,
          examDate: schema.exams.examDate,
        })
        .from(schema.registrations)
        .leftJoin(schema.students, sql`${schema.students.id} = ${schema.registrations.studentId}`)
        .leftJoin(schema.exams, sql`${schema.exams.id} = ${schema.registrations.examId}`)
        .where(sql`${schema.registrations.paymentId} = ${input.paymentId}`);

      let payerName = "N/A";
      if (payment.schoolId) {
        const school = await db.select().from(schema.schools).where(sql`${schema.schools.id} = ${payment.schoolId}`).limit(1);
        payerName = school[0]?.name ?? "N/A";
      } else if (payment.parentId) {
        const parent = await db.select().from(schema.parents).where(sql`${schema.parents.id} = ${payment.parentId}`).limit(1);
        payerName = parent[0]?.name ?? "N/A";
      }

      return {
        payment,
        registrations: regs,
        payerName,
      };
    }),
});