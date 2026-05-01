import { Router } from "express";
import { db } from "@workspace/db";
import { projectsTable, usersTable, classesTable, submissionsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { CreateProjectBody, UpdateProjectBody } from "@workspace/api-zod";

const router = Router();

async function formatProject(project: typeof projectsTable.$inferSelect) {
  const [teacher] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, project.teacherId))
    .limit(1);
  const [cls] = await db
    .select()
    .from(classesTable)
    .where(eq(classesTable.id, project.classId))
    .limit(1);
  const submissions = await db
    .select()
    .from(submissionsTable)
    .where(eq(submissionsTable.projectId, project.id));

  return {
    id: project.id,
    title: project.title,
    description: project.description,
    classId: project.classId,
    className: cls?.name ?? "Unknown",
    teacherId: project.teacherId,
    teacherName: teacher?.name ?? "Unknown",
    deadline: project.deadline.toISOString(),
    status: project.status,
    maxScore: project.maxScore,
    submissionCount: submissions.length,
    createdAt: project.createdAt.toISOString(),
  };
}

router.get("/projects", async (req, res) => {
  try {
    const classId = req.query["classId"] ? Number(req.query["classId"]) : undefined;
    const status = req.query["status"] as string | undefined;

    let projects = await db.select().from(projectsTable);

    if (classId && !isNaN(classId)) {
      projects = projects.filter((p) => p.classId === classId);
    }
    if (status && ["open", "closed", "draft"].includes(status)) {
      projects = projects.filter((p) => p.status === status);
    }

    const formatted = await Promise.all(projects.map(formatProject));
    res.json(formatted);
  } catch (err) {
    req.log.error({ err }, "List projects error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/projects", async (req, res) => {
  const parsed = CreateProjectBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  try {
    const teachers = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.role, "teacher"))
      .limit(1);
    const teacherId = teachers[0]?.id ?? 1;

    const [project] = await db
      .insert(projectsTable)
      .values({
        title: parsed.data.title,
        description: parsed.data.description,
        classId: parsed.data.classId,
        teacherId,
        deadline: new Date(parsed.data.deadline as unknown as string),
        status: parsed.data.status as "open" | "closed" | "draft",
        maxScore: parsed.data.maxScore,
      })
      .returning();

    res.status(201).json(await formatProject(project));
  } catch (err) {
    req.log.error({ err }, "Create project error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/projects/:projectId", async (req, res) => {
  const projectId = Number(req.params["projectId"]);
  if (isNaN(projectId)) {
    res.status(400).json({ error: "Invalid project ID" });
    return;
  }

  try {
    const [project] = await db
      .select()
      .from(projectsTable)
      .where(eq(projectsTable.id, projectId))
      .limit(1);

    if (!project) {
      res.status(404).json({ error: "Project not found" });
      return;
    }

    res.json(await formatProject(project));
  } catch (err) {
    req.log.error({ err }, "Get project error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/projects/:projectId", async (req, res) => {
  const projectId = Number(req.params["projectId"]);
  if (isNaN(projectId)) {
    res.status(400).json({ error: "Invalid project ID" });
    return;
  }

  const parsed = UpdateProjectBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  try {
    const updates: Record<string, unknown> = {};
    if (parsed.data.title) updates["title"] = parsed.data.title;
    if (parsed.data.description) updates["description"] = parsed.data.description;
    if (parsed.data.deadline) updates["deadline"] = new Date(parsed.data.deadline as unknown as string);
    if (parsed.data.status) updates["status"] = parsed.data.status;
    if (parsed.data.maxScore !== undefined) updates["maxScore"] = parsed.data.maxScore;

    const [project] = await db
      .update(projectsTable)
      .set(updates)
      .where(eq(projectsTable.id, projectId))
      .returning();

    if (!project) {
      res.status(404).json({ error: "Project not found" });
      return;
    }

    res.json(await formatProject(project));
  } catch (err) {
    req.log.error({ err }, "Update project error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/projects/:projectId", async (req, res) => {
  const projectId = Number(req.params["projectId"]);
  if (isNaN(projectId)) {
    res.status(400).json({ error: "Invalid project ID" });
    return;
  }

  try {
    await db.delete(projectsTable).where(eq(projectsTable.id, projectId));
    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    req.log.error({ err }, "Delete project error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
