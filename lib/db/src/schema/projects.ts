import { pgTable, text, serial, timestamp, integer, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";
import { classesTable } from "./classes";

export const projectStatusEnum = pgEnum("project_status", ["open", "closed", "draft"]);

export const projectsTable = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  classId: integer("class_id")
    .notNull()
    .references(() => classesTable.id),
  teacherId: integer("teacher_id")
    .notNull()
    .references(() => usersTable.id),
  deadline: timestamp("deadline").notNull(),
  status: projectStatusEnum("status").notNull().default("open"),
  maxScore: integer("max_score").notNull().default(100),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertProjectSchema = createInsertSchema(projectsTable).omit({
  id: true,
  createdAt: true,
});
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projectsTable.$inferSelect;
