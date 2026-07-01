import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { hashSync, compareSync } from "bcrypt-ts";
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

export const parentRouter = createRouter({
  register: publicQuery
    .input(
      z.object({
        name: z.string().min(2),
        mobile: z.string().min(10).max(15),
        email: z.string().email().optional(),
        password: z.string().min(6),
      })
    )
    .mutation(async ({ input }) => {
      const existing = await findParentByMobile(input.mobile);
      if (existing) {
        throw new TRPCError({ code: "CONFLICT", message: "Mobile number already registered" });
      }

      const passwordHash = hashSync(input.password, 10);
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
        mobile: z.string().min(10),
        password: z.string().min(1),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const parent = await findParentByMobile(input.mobile);
      if (!parent) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid mobile or password" });
      }

      const valid = compareSync(input.password, parent.passwordHash ?? "");
      if (!valid) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid mobile or password" });
      }

      const token = await createCustomSession(parent.id, "PARENT");

      ctx.resHeaders.append(
        "set-cookie",
        cookie.serialize(getCustomCookieName(), token, {
          httpOnly: true,
          path: "/",
          sameSite: "lax",
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
        httpOnly: true,
        path: "/",
        sameSite: "lax",
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
