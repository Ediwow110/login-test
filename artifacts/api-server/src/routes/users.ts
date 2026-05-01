import { Router } from "express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { eq, ilike, and, or } from "drizzle-orm";
import { CreateUserBody, UpdateUserBody } from "@workspace/api-zod";
import { z } from "zod/v4";

const router = Router();

function formatUser(user: typeof usersTable.$inferSelect) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    identifier: user.identifier,
    role: user.role,
    department: user.department ?? null,
    avatar: user.avatar ?? null,
    createdAt: user.createdAt.toISOString(),
  };
}

router.get("/users", async (req, res) => {
  try {
    const role = req.query["role"] as string | undefined;
    const search = req.query["search"] as string | undefined;

    let users = await db.select().from(usersTable);

    if (role && ["admin", "teacher", "student"].includes(role)) {
      users = users.filter((u) => u.role === role);
    }

    if (search) {
      const q = search.toLowerCase();
      users = users.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.identifier.toLowerCase().includes(q)
      );
    }

    res.json(users.map(formatUser));
  } catch (err) {
    req.log.error({ err }, "List users error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/users", async (req, res) => {
  const parsed = CreateUserBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const { name, email, password, role, department } = parsed.data;

  try {
    const rolePrefix: Record<string, string> = {
      admin: "ADM",
      teacher: "TCH",
      student: "STU",
    };
    const existingCount = await db
      .select()
      .from(usersTable)
      .then((u) => u.filter((x) => x.role === role).length);
    const identifier = `${rolePrefix[role]}${String(existingCount + 1).padStart(4, "0")}`;

    const [user] = await db
      .insert(usersTable)
      .values({
        name,
        email,
        identifier,
        passwordHash: password,
        role: role as "admin" | "teacher" | "student",
        department: department ?? null,
      })
      .returning();

    res.status(201).json(formatUser(user));
  } catch (err) {
    req.log.error({ err }, "Create user error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/users/:userId", async (req, res) => {
  const userId = Number(req.params["userId"]);
  if (isNaN(userId)) {
    res.status(400).json({ error: "Invalid user ID" });
    return;
  }

  try {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .limit(1);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json(formatUser(user));
  } catch (err) {
    req.log.error({ err }, "Get user error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/users/:userId", async (req, res) => {
  const userId = Number(req.params["userId"]);
  if (isNaN(userId)) {
    res.status(400).json({ error: "Invalid user ID" });
    return;
  }

  const parsed = UpdateUserBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  try {
    const [user] = await db
      .update(usersTable)
      .set({
        ...(parsed.data.name ? { name: parsed.data.name } : {}),
        ...(parsed.data.email ? { email: parsed.data.email } : {}),
        ...(parsed.data.department !== undefined
          ? { department: parsed.data.department }
          : {}),
      })
      .where(eq(usersTable.id, userId))
      .returning();

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json(formatUser(user));
  } catch (err) {
    req.log.error({ err }, "Update user error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/users/:userId", async (req, res) => {
  const userId = Number(req.params["userId"]);
  if (isNaN(userId)) {
    res.status(400).json({ error: "Invalid user ID" });
    return;
  }

  try {
    await db.delete(usersTable).where(eq(usersTable.id, userId));
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    req.log.error({ err }, "Delete user error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
