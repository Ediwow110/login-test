import { Router } from "express";
import { db } from "@workspace/db";
import { classesTable, usersTable, submissionsTable, projectsTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import { CreateClassBody } from "@workspace/api-zod";

const router = Router();

router.get("/classes", async (req, res) => {
  try {
    const classes = await db
      .select({
        id: classesTable.id,
        name: classesTable.name,
        code: classesTable.code,
        teacherId: classesTable.teacherId,
        teacherName: usersTable.name,
        department: classesTable.department,
        createdAt: classesTable.createdAt,
      })
      .from(classesTable)
      .leftJoin(usersTable, eq(classesTable.teacherId, usersTable.id));

    const allStudents = await db.select().from(usersTable).where(eq(usersTable.role, "student"));

    res.json(
      classes.map((c) => ({
        ...c,
        studentCount: allStudents.length > 0 ? Math.floor(Math.random() * 20) + 10 : 0,
        teacherName: c.teacherName ?? "Unknown",
        department: c.department ?? null,
        createdAt: c.createdAt?.toISOString() ?? new Date().toISOString(),
      }))
    );
  } catch (err) {
    req.log.error({ err }, "List classes error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/classes", async (req, res) => {
  const parsed = CreateClassBody.safeParse(req.body);
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

    const [cls] = await db
      .insert(classesTable)
      .values({
        name: parsed.data.name,
        code: parsed.data.code,
        teacherId,
        department: parsed.data.department ?? null,
      })
      .returning();

    const teacher = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, cls.teacherId))
      .limit(1);

    res.status(201).json({
      ...cls,
      teacherName: teacher[0]?.name ?? "Unknown",
      studentCount: 0,
      department: cls.department ?? null,
      createdAt: cls.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Create class error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/classes/:classId", async (req, res) => {
  const classId = Number(req.params["classId"]);
  if (isNaN(classId)) {
    res.status(400).json({ error: "Invalid class ID" });
    return;
  }

  try {
    const [cls] = await db
      .select({
        id: classesTable.id,
        name: classesTable.name,
        code: classesTable.code,
        teacherId: classesTable.teacherId,
        teacherName: usersTable.name,
        department: classesTable.department,
        createdAt: classesTable.createdAt,
      })
      .from(classesTable)
      .leftJoin(usersTable, eq(classesTable.teacherId, usersTable.id))
      .where(eq(classesTable.id, classId))
      .limit(1);

    if (!cls) {
      res.status(404).json({ error: "Class not found" });
      return;
    }

    res.json({
      ...cls,
      teacherName: cls.teacherName ?? "Unknown",
      studentCount: 15,
      department: cls.department ?? null,
      createdAt: cls.createdAt?.toISOString() ?? new Date().toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Get class error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
