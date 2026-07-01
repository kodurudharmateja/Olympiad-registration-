import { ErrorMessages } from "@contracts/constants";
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { TrpcContext } from "./context";

const t = initTRPC.context<TrpcContext>().create({
  transformer: superjson,
});

export const createRouter = t.router;
export const publicQuery = t.procedure;

// ─── Auth Middleware (any authenticated user) ───
const requireAuth = t.middleware(async (opts) => {
  const { ctx, next } = opts;

  if (!ctx.user && !ctx.customSession) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: ErrorMessages.unauthenticated,
    });
  }

  return next({ ctx });
});

export const authedQuery = t.procedure.use(requireAuth);

// ─── Admin Middleware (Kimi admin OR custom admin) ───
const requireAdmin = t.middleware(async (opts) => {
  const { ctx, next } = opts;

  const isKimiAdmin = ctx.user?.role === "admin";
  const isCustomAdmin = ctx.customSession?.type === "ADMIN";

  if (!isKimiAdmin && !isCustomAdmin) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: ErrorMessages.insufficientRole,
    });
  }

  return next({ ctx });
});

export const adminQuery = t.procedure.use(requireAdmin);

// ─── School Middleware ───
const requireSchool = t.middleware(async (opts) => {
  const { ctx, next } = opts;

  if (!ctx.customSession || ctx.customSession.type !== "SCHOOL") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "School access required",
    });
  }

  return next({ ctx });
});

export const schoolQuery = t.procedure.use(requireSchool);

// ─── Parent Middleware ───
const requireParent = t.middleware(async (opts) => {
  const { ctx, next } = opts;

  if (!ctx.customSession || ctx.customSession.type !== "PARENT") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Parent access required",
    });
  }

  return next({ ctx });
});

export const parentQuery = t.procedure.use(requireParent);

// ─── School or Admin Middleware ───
const requireSchoolOrAdmin = t.middleware(async (opts) => {
  const { ctx, next } = opts;

  const isAdmin = ctx.user?.role === "admin" || ctx.customSession?.type === "ADMIN";
  const isSchool = ctx.customSession?.type === "SCHOOL";

  if (!isAdmin && !isSchool) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "School or admin access required",
    });
  }

  return next({ ctx });
});

export const schoolOrAdminQuery = t.procedure.use(requireSchoolOrAdmin);

// ─── Parent or Admin Middleware ───
const requireParentOrAdmin = t.middleware(async (opts) => {
  const { ctx, next } = opts;

  const isAdmin = ctx.user?.role === "admin" || ctx.customSession?.type === "ADMIN";
  const isParent = ctx.customSession?.type === "PARENT";

  if (!isAdmin && !isParent) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Parent or admin access required",
    });
  }

  return next({ ctx });
});

export const parentOrAdminQuery = t.procedure.use(requireParentOrAdmin);
