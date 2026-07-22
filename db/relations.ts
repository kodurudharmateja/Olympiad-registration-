import { relations } from "drizzle-orm";
import {
  schools,
  parents,
  payments,
  results,
  students,
  exams,
  registrations,

} from "./schema";

export const schoolsRelations = relations(schools, ({ many }) => ({
  students: many(students),
  registrations: many(registrations),
  payments: many(payments),
}));

export const parentsRelations = relations(parents, ({ many }) => ({
  students: many(students),
  registrations: many(registrations),
  payments: many(payments),
}));

export const studentsRelations = relations(students, ({ one, many }) => ({
  school: one(schools, {
    fields: [students.schoolId],
    references: [schools.id],
  }),
  parent: one(parents, {
    fields: [students.parentId],
    references: [parents.id],
  }),
  registrations: many(registrations),
}));

export const examsRelations = relations(exams, ({ many }) => ({
  registrations: many(registrations),
  results: many(results),
}));

export const registrationsRelations = relations(registrations, ({ one }) => ({
  student: one(students, {
    fields: [registrations.studentId],
    references: [students.id],
  }),
  exam: one(exams, {
    fields: [registrations.examId],
    references: [exams.id],
  }),
  school: one(schools, {
    fields: [registrations.schoolId],
    references: [schools.id],
  }),
  parent: one(parents, {
    fields: [registrations.parentId],
    references: [parents.id],
  }),
  payment: one(payments, {
    fields: [registrations.paymentId],
    references: [payments.id],
  }),
}));

export const paymentsRelations = relations(payments, ({ one, many }) => ({
  school: one(schools, {
    fields: [payments.schoolId],
    references: [schools.id],
  }),
  parent: one(parents, {
    fields: [payments.parentId],
    references: [parents.id],
  }),
  registrations: many(registrations),
}));

export const resultsRelations = relations(results, ({ one }) => ({
  exam: one(exams, {
    fields: [results.examId],
    references: [exams.id],
  }),
}));