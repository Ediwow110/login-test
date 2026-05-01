import { pgTable, text, serial, timestamp, integer, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";
import { projectsTable } from "./projects";

export const submissionStatusEnum = pgEnum("submission_status", [
  "pending",
  "reviewed",
  "approved",
  "rejected",
]);

export const submissionsTable = pgTable("submissions", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id")
    .notNull()
    .references(() => projectsTable.id),
  studentId: integer("student_id")
    .notNull()
    .references(() => usersTable.id),
  content: text("content").notNull(),
  fileUrl: text("file_url"),
  status: submissionStatusEnum("status").notNull().default("pending"),
  score: integer("score"),
  feedback: text("feedback"),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
  reviewedAt: timestamp("reviewed_at"),
});

export const insertSubmissionSchema = createInsertSchema(submissionsTable).omit({
  id: true,
  submittedAt: true,
  reviewedAt: true,
});
export type InsertSubmission = z.infer<typeof insertSubmissionSchema>;
export type Submission = typeof submissionsTable.$inferSelect;
