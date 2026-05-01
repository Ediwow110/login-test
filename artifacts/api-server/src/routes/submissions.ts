import { Router } from "express";
import { db } from "@workspace/db";
import { submissionsTable, projectsTable, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { CreateSubmissionBody, UpdateSubmissionBody } from "@workspace/api-zod";

const router = Router();

async function formatSubmission(sub: typeof submissionsTable.$inferSelect) {
  const [project] = await db
    .select()
    .from(projectsTable)
    .where(eq(projectsTable.id, sub.projectId))
    .limit(1);
  const [student] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, sub.studentId))
    .limit(1);

  return {
    id: sub.id,
    projectId: sub.projectId,
    projectTitle: project?.title ?? "Unknown",
    studentId: sub.studentId,
    studentName: student?.name ?? "Unknown",
    content: sub.content,
    fileUrl: sub.fileUrl ?? null,
    status: sub.status,
    score: sub.score ?? null,
    feedback: sub.feedback ?? null,
    submittedAt: sub.submittedAt.toISOString(),
    reviewedAt: sub.reviewedAt?.toISOString() ?? null,
  };
}

router.get("/submissions", async (req, res) => {
  try {
    const projectId = req.query["projectId"] ? Number(req.query["projectId"]) : undefined;
    const studentId = req.query["studentId"] ? Number(req.query["studentId"]) : undefined;
    const status = req.query["status"] as string | undefined;

    let subs = await db.select().from(submissionsTable);

    if (projectId && !isNaN(projectId)) {
      subs = subs.filter((s) => s.projectId === projectId);
    }
    if (studentId && !isNaN(studentId)) {
      subs = subs.filter((s) => s.studentId === studentId);
    }
    if (status && ["pending", "reviewed", "approved", "rejected"].includes(status)) {
      subs = subs.filter((s) => s.status === status);
    }

    const formatted = await Promise.all(subs.map(formatSubmission));
    res.json(formatted);
  } catch (err) {
    req.log.error({ err }, "List submissions error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/submissions", async (req, res) => {
  const parsed = CreateSubmissionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  try {
    const students = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.role, "student"))
      .limit(1);
    const studentId = students[0]?.id ?? 1;

    const [sub] = await db
      .insert(submissionsTable)
      .values({
        projectId: parsed.data.projectId,
        studentId,
        content: parsed.data.content,
        fileUrl: parsed.data.fileUrl ?? null,
      })
      .returning();

    res.status(201).json(await formatSubmission(sub));
  } catch (err) {
    req.log.error({ err }, "Create submission error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/submissions/:submissionId", async (req, res) => {
  const submissionId = Number(req.params["submissionId"]);
  if (isNaN(submissionId)) {
    res.status(400).json({ error: "Invalid submission ID" });
    return;
  }

  try {
    const [sub] = await db
      .select()
      .from(submissionsTable)
      .where(eq(submissionsTable.id, submissionId))
      .limit(1);

    if (!sub) {
      res.status(404).json({ error: "Submission not found" });
      return;
    }

    res.json(await formatSubmission(sub));
  } catch (err) {
    req.log.error({ err }, "Get submission error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/submissions/:submissionId", async (req, res) => {
  const submissionId = Number(req.params["submissionId"]);
  if (isNaN(submissionId)) {
    res.status(400).json({ error: "Invalid submission ID" });
    return;
  }

  const parsed = UpdateSubmissionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  try {
    const updates: Record<string, unknown> = {};
    if (parsed.data.status) {
      updates["status"] = parsed.data.status;
      updates["reviewedAt"] = new Date();
    }
    if (parsed.data.score !== undefined) updates["score"] = parsed.data.score;
    if (parsed.data.feedback !== undefined) updates["feedback"] = parsed.data.feedback;

    const [sub] = await db
      .update(submissionsTable)
      .set(updates)
      .where(eq(submissionsTable.id, submissionId))
      .returning();

    if (!sub) {
      res.status(404).json({ error: "Submission not found" });
      return;
    }

    res.json(await formatSubmission(sub));
  } catch (err) {
    req.log.error({ err }, "Update submission error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
