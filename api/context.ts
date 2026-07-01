import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import type { User } from "@db/schema";
import type { CustomSession } from "./custom-auth";
import { authenticateRequest } from "./kimi/auth";
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
  const ctx: TrpcContext = { req: opts.req, resHeaders: opts.resHeaders };

  // Try Kimi OAuth first
  try {
    ctx.user = await authenticateRequest(opts.req.headers);
  } catch {
    // OAuth auth is optional
  }

  // Try custom auth (admin/school/parent)
  try {
    ctx.customSession = await authenticateCustomRequest(opts.req.headers);
  } catch {
    // Custom auth is optional
  }

  return ctx;
}
