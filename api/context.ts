import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import type { User } from "@db/schema";
import type { CustomSession } from "./custom-auth";
import { authenticateRequest } from "./firebase/auth";   // ← Updated import
import { authenticateCustomRequest } from "./custom-auth";

export type TrpcContext = {
  req: Request;
  resHeaders: Headers;
  user?: User;
  customSession?: CustomSession | null;
};

export async function createContext(
  opts: FetchCreateContextFnOptions,
): Promise<TrpcContext> {
  const ctx: TrpcContext = { 
    req: opts.req, 
    resHeaders: opts.resHeaders 
  };

  // Firebase Auth (main auth now)
  try {
    ctx.user = await authenticateRequest(opts.req.headers);
  } catch {
    // Firebase auth is optional (falls back to custom)
  }

  // Keep your custom auth (admin/school/parent)
  try {
    ctx.customSession = await authenticateCustomRequest(opts.req.headers);
  } catch {
    // Custom auth is optional
  }

  return ctx;
}