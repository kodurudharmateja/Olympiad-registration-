import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  decimal,
  boolean,
  bigint,
} from "drizzle-orm/mysql-core";

// ─── Users (Firebase Auth) ───
export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  firebaseUid: varchar("firebase_uid", { length: 255 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  avatar: varchar("avatar", { length: 512 }),
  role: mysqlEnum("role", ["admin", "user", "school", "parent"]).default("user"),
  lastSignInAt: timestamp("last_sign_in_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── Admin (email/password login) ───
export const admins = mysqlTable("admins", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  passwordHash: varchar("passwordHash", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).default("Administrator"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Admin = typeof admins.$inferSelect;
export type InsertAdmin = typeof admins.$inferInsert;

// ─── School ───
export const schools = mysqlTable("schools", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  principalName: varchar("principalName", { length: 255 }).notNull(),
  contactPerson: varchar("contactPerson", { length: 255 }).notNull(),
  mobile: varchar("mobile", { length: 20 }).notNull().unique(),
  email: varchar("email", { length: 320 }),
  address: text("address").notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  district: varchar("district", { length: 100 }).notNull(),
  state: varchar("state", { length: 100 }).notNull(),
  pinCode: varchar("pinCode", { length: 10 }).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  firebaseUid: varchar("firebaseUid", { length: 255 }).unique(),
  passwordHash: varchar("passwordHash", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type School = typeof schools.$inferSelect;
export type InsertSchool = typeof schools.$inferInsert;

// ─── Parent ───
export const parents = mysqlTable("parents", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  mobile: varchar("mobile", { length: 20 }).notNull().unique(),
  email: varchar("email", { length: 320 }),
  firebaseUid: varchar("firebaseUid", { length: 255 }).unique(),
  passwordHash: varchar("passwordHash", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Parent = typeof parents.$inferSelect;
export type InsertParent = typeof parents.$inferInsert;

// ─── Student ───
export const students = mysqlTable("students", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  className: varchar("className", { length: 50 }).notNull(),
  section: varchar("section", { length: 20 }),
  rollNumber: varchar("rollNumber", { length: 50 }),
  gender: varchar("gender", { length: 20 }).notNull(),
  mobile: varchar("mobile", { length: 20 }),
  parentName: varchar("parentName", { length: 255 }),
  schoolName: varchar("schoolName", { length: 255 }),
  schoolId: bigint("schoolId", { mode: "number", unsigned: true }),
  parentId: bigint("parentId", { mode: "number", unsigned: true }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Student = typeof students.$inferSelect;
export type InsertStudent = typeof students.$inferInsert;

// ─── Exam ───
export const exams = mysqlTable("exams", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  examDate: timestamp("examDate").notNull(),
  feePerStudent: decimal("feePerStudent", { precision: 10, scale: 2 }).notNull(),
  registrationDeadline: timestamp("registrationDeadline").notNull(),
  center: varchar("center", { length: 255 }),
  eligibility: mysqlEnum("eligibility", ["SCHOOL_ONLY", "PARENT_ONLY", "BOTH"]).default("BOTH").notNull(),
  isLive: boolean("isLive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Exam = typeof exams.$inferSelect;
export type InsertExam = typeof exams.$inferInsert;

// ─── Registration ───
export const registrations = mysqlTable("registrations", {
  id: serial("id").primaryKey(),
  studentId: bigint("studentId", { mode: "number", unsigned: true }).notNull(),
  examId: bigint("examId", { mode: "number", unsigned: true }).notNull(),
  schoolId: bigint("schoolId", { mode: "number", unsigned: true }),
  parentId: bigint("parentId", { mode: "number", unsigned: true }),
  paymentId: bigint("paymentId", { mode: "number", unsigned: true }),
  status: mysqlEnum("status", ["PENDING", "PAID", "FAILED", "CANCELLED"]).default("PENDING").notNull(),
  hallTicketUrl: text("hallTicketUrl"),
  certificateUrl: text("certificateUrl"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});



export type Registration = typeof registrations.$inferSelect;
export type InsertRegistration = typeof registrations.$inferInsert;

// ─── Syllabus ───
export const syllabus = mysqlTable("syllabus", {
  id: serial("id").primaryKey(),
  examName: varchar("examName", { length: 255 }).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type Syllabus = typeof syllabus.$inferSelect;
export type InsertSyllabus = typeof syllabus.$inferInsert;

// ─── Payment ───
export const payments = mysqlTable("payments", {
  id: serial("id").primaryKey(),
  razorpayOrderId: varchar("razorpayOrderId", { length: 255 }).unique(),
  razorpayPaymentId: varchar("razorpayPaymentId", { length: 255 }),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  payerType: mysqlEnum("payerType", ["SCHOOL", "PARENT"]).notNull(),
  schoolId: bigint("schoolId", { mode: "number", unsigned: true }),
  parentId: bigint("parentId", { mode: "number", unsigned: true }),
  status: mysqlEnum("status", ["CREATED", "PAID", "FAILED"]).default("CREATED").notNull(),
  receiptNumber: varchar("receiptNumber", { length: 100 }).unique(),
  receiptUrl: text("receiptUrl"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = typeof payments.$inferInsert;

// ─── Result (Phase 2) ───
export const results = mysqlTable("results", {
  id: serial("id").primaryKey(),
  examId: bigint("examId", { mode: "number", unsigned: true }).notNull(),
  studentId: bigint("studentId", { mode: "number", unsigned: true }).notNull(),
  score: varchar("score", { length: 50 }),
  rank: varchar("rank", { length: 50 }),
  fileUrl: text("fileUrl"),
  publishedAt: timestamp("publishedAt").defaultNow().notNull(),
});

export type Result = typeof results.$inferSelect;
export type InsertResult = typeof results.$inferInsert;

// ─── Audit Log ───
export const auditLogs = mysqlTable("auditLogs", {
  id: serial("id").primaryKey(),
  entityType: varchar("entityType", { length: 50 }).notNull(),
  entityId: bigint("entityId", { mode: "number", unsigned: true }).notNull(),
  action: varchar("action", { length: 100 }).notNull(),
  oldValue: text("oldValue"),
  newValue: text("newValue"),
  performedBy: varchar("performedBy", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = typeof auditLogs.$inferInsert;