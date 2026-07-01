import * as jose from "jose";
import * as cookie from "cookie";
import { env } from "./lib/env";
import { findAdminById } from "./queries/admins";
import { findSchoolById } from "./queries/schools";
import { findParentById } from "./queries/parents";

const JWT_ALG = "HS256";
const CUSTOM_COOKIE = "olympiad_session";

export type SessionType = "ADMIN" | "SCHOOL" | "PARENT";

export interface CustomSession {
  id: number;
  type: SessionType;
  email?: string;
  name: string;
}

async function signCustomToken(payload: { id: number; type: SessionType }): Promise<string> {
  const secret = new TextEncoder().encode(env.appSecret);
  return new jose.SignJWT(payload as unknown as jose.JWTPayload)
    .setProtectedHeader({ alg: JWT_ALG })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret);
}

async function verifyCustomToken(token: string): Promise<{ id: number; type: SessionType } | null> {
  if (!token) return null;
  try {
    const secret = new TextEncoder().encode(env.appSecret);
    const { payload } = await jose.jwtVerify(token, secret, {
      algorithms: [JWT_ALG],
      clockTolerance: 60,
    });
    const id = payload.id as number;
    const type = payload.type as SessionType;
    if (!id || !type) return null;
    return { id, type };
  } catch {
    return null;
  }
}

export async function authenticateCustomRequest(headers: Headers): Promise<CustomSession | null> {
  const cookies = cookie.parse(headers.get("cookie") || "");
  const token = cookies[CUSTOM_COOKIE];
  if (!token) return null;

  const claim = await verifyCustomToken(token);
  if (!claim) return null;

  if (claim.type === "ADMIN") {
    const admin = await findAdminById(claim.id);
    if (!admin) return null;
    return { id: admin.id, type: "ADMIN", email: admin.email, name: admin.name ?? "Administrator" };
  }

  if (claim.type === "SCHOOL") {
    const school = await findSchoolById(claim.id);
    if (!school || !school.isActive) return null;
    return { id: school.id, type: "SCHOOL", name: school.name };
  }

  if (claim.type === "PARENT") {
    const parent = await findParentById(claim.id);
    if (!parent) return null;
    return { id: parent.id, type: "PARENT", name: parent.name };
  }

  return null;
}

export async function createCustomSession(id: number, type: SessionType): Promise<string> {
  return signCustomToken({ id, type });
}

export function getCustomCookieName(): string {
  return CUSTOM_COOKIE;
}
