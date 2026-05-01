import { Router } from "express";
import { db } from "@workspace/db";
import { usersTable, projectsTable, classesTable, submissionsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/analytics/dashboard", async (req, res) => {
  try {
    const allUsers = await db.select().from(usersTable);
    const students = allUsers.filter((u) => u.role === "student");
    const teachers = allUsers.filter((u) => u.role === "teacher");

    const allProjects = await db.select().from(projectsTable);
    const allSubmissions = await db.select().from(submissionsTable);
    const allClasses = await db.select().from(classesTable);

    const pendingReviews = allSubmissions.filter((s) => s.status === "pending").length;
    const approvedSubmissions = allSubmissions.filter((s) => s.status === "approved").length;
    const submissionRate =
      allProjects.length > 0 ? allSubmissions.length / (allProjects.length * Math.max(students.length, 1)) : 0;

    res.json({
      totalStudents: students.length,
      totalTeachers: teachers.length,
      totalProjects: allProjects.length,
      totalSubmissions: allSubmissions.length,
      pendingReviews,
      approvedSubmissions,
      activeClasses: allClasses.length,
      submissionRate: Math.min(submissionRate, 1),
    });
  } catch (err) {
    req.log.error({ err }, "Dashboard stats error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/analytics/recent-activity", async (req, res) => {
  try {
    const recentSubmissions = await db.select().from(submissionsTable);
    const recentProjects = await db.select().from(projectsTable);
    const recentUsers = await db.select().from(usersTable);

    const activities: Array<{
      id: number;
      type: "submission" | "review" | "project_created" | "user_joined";
      message: string;
      actorName: string;
      timestamp: string;
    }> = [];

    let idCounter = 1;

    for (const sub of recentSubmissions.slice(0, 5)) {
      const student = recentUsers.find((u) => u.id === sub.studentId);
      const project = recentProjects.find((p) => p.id === sub.projectId);
      activities.push({
        id: idCounter++,
        type: "submission",
        message: `Submitted "${project?.title ?? "Project"}"`,
        actorName: student?.name ?? "Unknown Student",
        timestamp: sub.submittedAt.toISOString(),
      });

      if (sub.reviewedAt) {
        activities.push({
          id: idCounter++,
          type: "review",
          message: `Reviewed "${project?.title ?? "Project"}" — ${sub.status}`,
          actorName: "Teacher",
          timestamp: sub.reviewedAt.toISOString(),
        });
      }
    }

    for (const proj of recentProjects.slice(0, 3)) {
      const teacher = recentUsers.find((u) => u.id === proj.teacherId);
      activities.push({
        id: idCounter++,
        type: "project_created",
        message: `Created project "${proj.title}"`,
        actorName: teacher?.name ?? "Unknown Teacher",
        timestamp: proj.createdAt.toISOString(),
      });
    }

    for (const user of recentUsers.slice(0, 2)) {
      activities.push({
        id: idCounter++,
        type: "user_joined",
        message: `Joined as ${user.role}`,
        actorName: user.name,
        timestamp: user.createdAt.toISOString(),
      });
    }

    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    res.json(activities.slice(0, 10));
  } catch (err) {
    req.log.error({ err }, "Recent activity error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/analytics/submission-trends", async (req, res) => {
  try {
    const allSubmissions = await db.select().from(submissionsTable);

    const now = new Date();
    const weeks: Array<{ week: string; submissions: number; reviews: number }> = [];

    for (let i = 7; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - i * 7 - 6);
      const weekEnd = new Date(now);
      weekEnd.setDate(now.getDate() - i * 7);

      const weekLabel = `Week ${8 - i}`;

      const weekSubs = allSubmissions.filter((s) => {
        const d = new Date(s.submittedAt);
        return d >= weekStart && d <= weekEnd;
      });
      const weekReviews = weekSubs.filter((s) => s.reviewedAt !== null).length;

      weeks.push({
        week: weekLabel,
        submissions: weekSubs.length,
        reviews: weekReviews,
      });
    }

    res.json(weeks);
  } catch (err) {
    req.log.error({ err }, "Submission trends error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
