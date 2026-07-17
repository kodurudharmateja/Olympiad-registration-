import { z } from "zod";
import { TRPCError } from "@trpc/server";
import crypto from "crypto";
import Razorpay from "razorpay";

import { createRouter, adminQuery, parentQuery } from "../middleware";
import {
  createPayment,
  findPaymentByOrderId,
  updatePaymentStatus,
  listPayments,
  getPaymentById,
} from "../queries/payments";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export const paymentRouter = createRouter({
  // Step 1: Parent initiates payment for a registration
  createOrder: parentQuery
    .input(
      z.object({
        registrationId: z.number(),
        amount: z.number().positive(), // in rupees
      })
    )
    .mutation(async ({ input, ctx }) => {
      const amountInPaise = Math.round(input.amount * 100);

      const order = await razorpay.orders.create({
        amount: amountInPaise,
        currency: "INR",
        receipt: `reg_${input.registrationId}_${Date.now()}`,
      });

      await createPayment({
        registrationId: input.registrationId,
        parentId: ctx.customSession!.id,
        razorpayOrderId: order.id,
        amount: input.amount,
        status: "CREATED",
      });

      return {
        success: true,
        orderId: order.id,
        amount: amountInPaise,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID,
      };
    }),

  // Step 2: Verify signature after Razorpay checkout completes on the frontend
  verify: parentQuery
    .input(
      z.object({
        razorpay_order_id: z.string(),
        razorpay_payment_id: z.string(),
        razorpay_signature: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const body = `${input.razorpay_order_id}|${input.razorpay_payment_id}`;
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
        .update(body)
        .digest("hex");

      if (expectedSignature !== input.razorpay_signature) {
        await updatePaymentStatus(input.razorpay_order_id, "FAILED");
        throw new TRPCError({ code: "BAD_REQUEST", message: "Payment verification failed" });
      }

      const payment = await findPaymentByOrderId(input.razorpay_order_id);
      if (!payment) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Payment record not found" });
      }

      await updatePaymentStatus(input.razorpay_order_id, "PAID", input.razorpay_payment_id);

      return { success: true };
    }),

  getById: adminQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const payment = await getPaymentById(input.id);
      if (!payment) throw new TRPCError({ code: "NOT_FOUND", message: "Payment not found" });
      return payment;
    }),

  list: adminQuery.query(async () => {
    return listPayments();
  }),
});