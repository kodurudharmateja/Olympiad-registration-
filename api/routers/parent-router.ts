import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { createRouter, publicQuery, adminQuery, parentQuery } from "../middleware";
import {
  findParentById,
  findParentByMobile,
  listParents,
  createParent,
  updateParent,
  getParentCount,
} from "../queries/parents";
import { createCustomSession, getCustomCookieName } from "../custom-auth";
import * as cookie from "cookie";
import { getSerializeCookieOptions } from "../lib/cookies";

export const parentRouter = createRouter({
  register: publicQuery
    .input(
      z.object({
        name: z.string().min(2),
        mobile: z.string().min(10).max(15),
        email: z.string().email().optional(),
        idToken: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      const { verifyFirebaseToken } = await import("../firebase/auth");
      const decoded = await verifyFirebaseToken(input.idToken);
      if (!decoded) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid Firebase token" });
      }

      const existing = await findParentByMobile(input.mobile);
      if (existing) {
        throw new TRPCError({ code: "CONFLICT", message: "Mobile number already registered" });
      }

      const passwordHash = ""; // Firebase handles passwords
      const result = await createParent({
        name: input.name,
        mobile: input.mobile,
        email: input.email ?? null,
        passwordHash,
      });

      return { success: true, parentId: Number(result[0].insertId) };
    }),

  login: publicQuery
    .input(
      z.object({
        idToken: z.string().min(1),
        mobile: z.string().min(10),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { verifyFirebaseToken } = await import("../firebase/auth");
      const decoded = await verifyFirebaseToken(input.idToken);
      if (!decoded) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid Firebase token" });
      }

      const parent = await findParentByMobile(input.mobile);
      if (!parent) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid mobile or password" });
      }

      const token = await createCustomSession(parent.id, "PARENT");

      ctx.resHeaders.append(
        "set-cookie",
        cookie.serialize(getCustomCookieName(), token, {
          ...getSerializeCookieOptions(ctx.req.headers),
          maxAge: 30 * 24 * 60 * 60,
        })
      );

      return {
        success: true,
        parent: {
          id: parent.id,
          name: parent.name,
          mobile: parent.mobile,
          email: parent.email,
        },
      };
    }),

  me: publicQuery.query(async ({ ctx }) => {
    if (!ctx.customSession || ctx.customSession.type !== "PARENT") {
      return null;
    }
    const parent = await findParentById(ctx.customSession.id);
    if (!parent) return null;
    return {
      id: parent.id,
      name: parent.name,
      mobile: parent.mobile,
      email: parent.email,
    };
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

  list: adminQuery.query(async () => {
    return listParents();
  }),

  getById: adminQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const parent = await findParentById(input.id);
      if (!parent) throw new TRPCError({ code: "NOT_FOUND", message: "Parent not found" });
      return parent;
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        mobile: z.string().optional(),
        email: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      await updateParent(id, data);
      return { success: true };
    }),

  count: adminQuery.query(async () => {
    return getParentCount();
  }),

  profile: parentQuery.query(async ({ ctx }) => {
    const parent = await findParentById(ctx.customSession!.id);
    if (!parent) throw new TRPCError({ code: "NOT_FOUND", message: "Parent not found" });
    return parent;
  }),

  updateProfile: parentQuery
    .input(
      z.object({
        name: z.string().min(2).optional(),
        email: z.string().email().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await updateParent(ctx.customSession!.id, input);
      return { success: true };
    }),
});