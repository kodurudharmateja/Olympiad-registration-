import "dotenv/config";

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function optional(name: string): string | undefined {
  return process.env[name];
}

export const env = {
  isProduction: process.env.NODE_ENV === "production" || process.env.IS_PROD === "true",

  // Firebase Admin SDK
  firebaseProjectId: required("FIREBASE_PROJECT_ID"),
  firebaseClientEmail: required("FIREBASE_CLIENT_EMAIL"),
  firebasePrivateKey: required("FIREBASE_PRIVATE_KEY"),

  // Optional: Make one user the owner/admin automatically
  ownerFirebaseUid: optional("OWNER_FIREBASE_UID"),

  // Add any other existing env variables here...
};