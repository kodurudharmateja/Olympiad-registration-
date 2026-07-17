import { z } from "zod";
import { isValidDistrictForState, ALL_STATE_NAMES } from "@/lib/india-states-districts";
import { TRPCError } from "@trpc/server";

import { createRouter, publicQuery, adminQuery, schoolQuery } from "../middleware";
import {
  findSchoolById,
  findSchoolByMobile,
  listSchools,
  createSchool,
  updateSchool,
  getSchoolCount,
} from "../queries/schools";
import { createCustomSession, getCustomCookieName } from "../custom-auth";

import * as cookie from "cookie";

export const schoolRouter = createRouter({
  register: publicQuery
    .input(
      z.object({
        name: z
          .string()
          .min(3, "School name must be at least 3 characters")
          .max(150, "School name must be at most 150 characters")
          .refine((v) => /[a-zA-Z]/.test(v.trim()), {
            message: "School name must contain at least one letter",
          }),
        principalName: z
          .string()
          .min(2, "Principal name must be at least 2 characters")
          .max(100, "Principal name must be at most 100 characters")
          .refine((v) => /[a-zA-Z]/.test(v.trim()), {
            message: "Principal name must contain alphabetic characters",
          }),
        contactPerson: z
          .string()
          .min(2, "Contact person must be at least 2 characters")
          .max(100, "Contact person must be at most 100 characters")
          .refine((v) => /[a-zA-Z]/.test(v.trim()), {
            message: "Contact person must contain alphabetic characters",
          }),
        mobile: z
          .string()
          .regex(/^[6-9]\d{9}$/, "Mobile must be a valid 10-digit Indian number starting with 6-9"),
        email: z
          .string()
          .email("Invalid email address")
          .optional()
          .or(z.literal("")
            .transform(() => undefined)),
        address: z
          .string()
          .min(5, "Address must be at least 5 characters")
          .max(300, "Address must be at most 300 characters")
          .refine((v) => v.trim().length > 0, { message: "Address cannot be whitespace only" }),
        city: z
          .string()
          .min(2, "City must be at least 2 characters")
          .max(100, "City must be at most 100 characters")
          .refine((v) => /[a-zA-Z]/.test(v.trim()), {
            message: "City must contain alphabetic characters",
          }),
        district: z.string().min(2, "District is required"),
        state: z
          .string()
          .refine((v) => ALL_STATE_NAMES.includes(v), {
            message: "State must be a valid Indian state or union territory",
          }),
        pinCode: z
          .string()
          .regex(/^[1-9]\d{5}$/, "PIN code must be 6 digits and cannot start with 0"),
        idToken: z.string().min(1),
      }).refine(
        (data) => isValidDistrictForState(data.state, data.district),
        {
          message: "District does not belong to the selected state",
          path: ["district"],
        }
      )
    )
    .mutation(async ({ input }) => {
      const { verifyFirebaseToken } = await import("../firebase/auth");
      const decoded = await verifyFirebaseToken(input.idToken);
      if (!decoded) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid Firebase token" });
      }

      const existing = await findSchoolByMobile(input.mobile);
      if (existing) {
        throw new TRPCError({ code: "CONFLICT", message: "Mobile number already registered" });
      }

      // We no longer need passwordHash because Firebase handles passwords
      const passwordHash = ""; 
      const result = await createSchool({
        ...input,
        email: input.email ?? null,
        passwordHash,
      });

      return { success: true, schoolId: Number(result[0].insertId) };
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

      const school = await findSchoolByMobile(input.mobile);
      if (!school) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid mobile or password" });
      }
      if (!school.isActive) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Account is deactivated" });
      }

      const token = await createCustomSession(school.id, "SCHOOL");

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
        school: {
          id: school.id,
          name: school.name,
          principalName: school.principalName,
          contactPerson: school.contactPerson,
          mobile: school.mobile,
          email: school.email,
          address: school.address,
          city: school.city,
          district: school.district,
          state: school.state,
          pinCode: school.pinCode,
        },
      };
    }),

  me: publicQuery.query(async ({ ctx }) => {
    if (!ctx.customSession || ctx.customSession.type !== "SCHOOL") {
      return null;
    }
    const school = await findSchoolById(ctx.customSession.id);
    if (!school) return null;
    return {
      id: school.id,
      name: school.name,
      principalName: school.principalName,
      contactPerson: school.contactPerson,
      mobile: school.mobile,
      email: school.email,
      address: school.address,
      city: school.city,
      district: school.district,
      state: school.state,
      pinCode: school.pinCode,
      isActive: school.isActive,
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

  list: adminQuery
    .input(z.object({ search: z.string().optional() }).optional())
    .query(async ({ input }) => {
      return listSchools(input?.search);
    }),

  getById: adminQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const school = await findSchoolById(input.id);
      if (!school) throw new TRPCError({ code: "NOT_FOUND", message: "School not found" });
      return school;
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        principalName: z.string().optional(),
        contactPerson: z.string().optional(),
        mobile: z.string().optional(),
        email: z.string().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        district: z.string().optional(),
        state: z.string().optional(),
        pinCode: z.string().optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      await updateSchool(id, data);
      return { success: true };
    }),

  toggleActive: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const school = await findSchoolById(input.id);
      if (!school) throw new TRPCError({ code: "NOT_FOUND", message: "School not found" });
      await updateSchool(input.id, { isActive: !school.isActive });
      return { success: true, isActive: !school.isActive };
    }),

  count: adminQuery.query(async () => {
    return getSchoolCount();
  }),

  profile: schoolQuery.query(async ({ ctx }) => {
    const school = await findSchoolById(ctx.customSession!.id);
    if (!school) throw new TRPCError({ code: "NOT_FOUND", message: "School not found" });
    return school;
  }),

  updateProfile: schoolQuery
    .input(
      z.object({
        name: z.string().min(2).optional(),
        principalName: z.string().min(2).optional(),
        contactPerson: z.string().min(2).optional(),
        email: z.string().email().optional(),
        address: z.string().min(5).optional(),
        city: z.string().min(2).optional(),
        district: z.string().min(2).optional(),
        state: z.string().min(2).optional(),
        pinCode: z.string().min(4).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await updateSchool(ctx.customSession!.id, input);
      return { success: true };
    }),
});