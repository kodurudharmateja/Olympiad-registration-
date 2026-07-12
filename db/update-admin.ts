import { getDb } from "../api/queries/connection";
import * as schema from "./schema";
import { hashSync } from "bcrypt-ts";
import { eq } from "drizzle-orm";

async function updateAdmin() {
  const db = getDb();

  const newEmail = "jpo@admin.com";   
  const newPassword = "2468admin";    

  await db
    .update(schema.admins)
    .set({
      email: newEmail,
      passwordHash: hashSync(newPassword, 10),
    })
    .where(eq(schema.admins.email, "admin@olympiad.portal"));

  console.log("✅ Admin credentials updated");
  console.log(`New login: ${newEmail} / ${newPassword}`);
}

updateAdmin().catch(console.error);