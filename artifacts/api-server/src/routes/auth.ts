import { Router } from "express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { LoginBody } from "@workspace/api-zod";
import { z } from "zod/v4";

const router = Router();

const SESSION_COOKIE = "projtrack_session";
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

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

router.post("/auth/login", async (req, res) => {
  const parsed = LoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const { identifier, password, role } = parsed.data;

  try {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.identifier, identifier))
      .limit(1);

    if (!user) {
      const [byEmail] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, identifier))
        .limit(1);

      if (!byEmail) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }

      if (byEmail.role !== role || byEmail.passwordHash !== password) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }

      const sessionData = JSON.stringify({ userId: byEmail.id });
      res.cookie(SESSION_COOKIE, sessionData, {
        maxAge: COOKIE_MAX_AGE,
        httpOnly: true,
        signed: true,
      });
      res.json({ user: formatUser(byEmail), token: sessionData });
      return;
    }

    if (user.role !== role || user.passwordHash !== password) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const sessionData = JSON.stringify({ userId: user.id });
    res.cookie(SESSION_COOKIE, sessionData, {
      maxAge: COOKIE_MAX_AGE,
      httpOnly: true,
      signed: true,
    });
    res.json({ user: formatUser(user), token: sessionData });
  } catch (err) {
    req.log.error({ err }, "Login error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/auth/logout", (req, res) => {
  res.clearCookie(SESSION_COOKIE);
  res.json({ message: "Logged out successfully" });
});

router.get("/auth/me", async (req, res) => {
  const sessionCookie = req.signedCookies?.[SESSION_COOKIE];
  if (!sessionCookie) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  try {
    const { userId } = JSON.parse(sessionCookie) as { userId: number };
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .limit(1);

    if (!user) {
      res.status(401).json({ error: "User not found" });
      return;
    }

    res.json(formatUser(user));
  } catch (err) {
    req.log.error({ err }, "Get me error");
    res.status(401).json({ error: "Invalid session" });
  }
});

export default router;
