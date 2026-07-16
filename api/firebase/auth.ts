import type { Context } from "hono";
import { setCookie } from "hono/cookie";
import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import type { DecodedIdToken } from 'firebase-admin/auth';
import { env } from "../lib/env";
import { getSessionCookieOptions } from "../lib/cookies";
import { Session } from "@contracts/constants";
import { Errors } from "@contracts/errors";
import { signSessionToken } from "./session";           // Keep your existing session signer
import { findUserByFirebaseUid, upsertUser } from "../queries/users";

// Initialize Firebase Admin (once)
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: env.firebaseProjectId,
      clientEmail: env.firebaseClientEmail,
      privateKey: env.firebasePrivateKey?.replace(/\\n/g, '\n'),
    }),
  });
}

// Verify Firebase ID Token
export async function verifyFirebaseToken(idToken: string) {
  try {
    const decodedToken = await getAuth().verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    console.error("Firebase token verification failed:", error);
    return null;
  }
}

// Main auth for tRPC / protected routes
export async function authenticateRequest(headers: Headers) {
  const authHeader = headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    throw Errors.forbidden("Missing or invalid authorization header.");
  }

  const idToken = authHeader.split("Bearer ")[1];
  const decodedToken = await verifyFirebaseToken(idToken);

  if (!decodedToken) {
    throw Errors.forbidden("Invalid authentication token.");
  }

  const user = await findUserByFirebaseUid(decodedToken.uid);
  if (!user) {
    throw Errors.forbidden("User not found. Please re-login.");
  }

  return user;
}

// Create session cookie after login (optional but recommended)
export async function createSessionCookie(c: Context, decodedToken: DecodedIdToken) {
  const token = await signSessionToken({
    uid: decodedToken.uid,           // Changed from unionId
    email: decodedToken.email,
  });

  const cookieOpts = getSessionCookieOptions(c.req.raw.headers);
  setCookie(c, Session.cookieName, token, {
    ...cookieOpts,
    maxAge: Session.maxAgeMs / 1000,
  });
}

// Handle login from frontend (new endpoint)
export async function handleFirebaseLogin(c: Context) {
  try {
    const { idToken } = await c.req.json();
    if (!idToken) {
      return c.json({ error: "idToken is required" }, 400);
    }

    const decodedToken = await verifyFirebaseToken(idToken);
    if (!decodedToken) {
      return c.json({ error: "Invalid token" }, 401);
    }

    // Create or update user in DB
    await upsertUser({
      firebaseUid: decodedToken.uid,
      email: decodedToken.email || "",
      name: decodedToken.name || decodedToken.email?.split("@")[0] || "User",
      avatar: decodedToken.picture,
      lastSignInAt: new Date(),
    });

    await createSessionCookie(c, decodedToken);

    return c.json({ success: true, uid: decodedToken.uid });
  } catch (error) {
    console.error("[Firebase Login] Failed", error);
    return c.json({ error: "Login failed" }, 500);
  }
}