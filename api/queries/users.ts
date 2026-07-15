import { eq } from "drizzle-orm";
import * as schema from "@db/schema";
import type { InsertUser } from "@db/schema";
import { getDb } from "./connection";
import { env } from "../lib/env";

// Find user by Firebase UID (new primary key)
export async function findUserByFirebaseUid(firebaseUid: string) {
  if (!firebaseUid) return null;

  const rows = await getDb()
    .select()
    .from(schema.users)
    .where(eq(schema.users.firebaseUid, firebaseUid))
    .limit(1);

  return rows.at(0) ?? null;
}

// Create or update user (replaces old upsertUser)
export async function upsertUser(data: {
  firebaseUid: string;
  email: string;
  name?: string;
  avatar?: string;
  lastSignInAt?: Date;
  role?: "admin" | "user" | "school" | "parent"; // adjust as per your schema
}) {
  if (!data.firebaseUid) {
    throw new Error("firebaseUid is required");
  }

  const now = new Date();

  const values: InsertUser = {
    firebaseUid: data.firebaseUid,
    email: data.email,
    name: data.name || data.email?.split("@")[0] || "User",
    avatar: data.avatar,
    lastSignInAt: data.lastSignInAt || now,
    role: data.role,
  };

  // Auto-promote owner to admin (optional - update env variable name)
  if (env.ownerFirebaseUid && data.firebaseUid === env.ownerFirebaseUid) {
    values.role = "admin";
  }

  await getDb()
    .insert(schema.users)
    .values(values)
    .onDuplicateKeyUpdate({
      set: {
        name: values.name,
        avatar: values.avatar,
        lastSignInAt: now,
        email: values.email,
        ...(values.role ? { role: values.role } : {}),
      },
    });

  // Return the user after upsert
  return findUserByFirebaseUid(data.firebaseUid);
}