import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { db } from "@db";
import { children, achievements } from "@db/schema";
import { eq } from "drizzle-orm";

export function registerRoutes(app: Express): Server {
  setupAuth(app);

  // Children endpoints
  app.get("/api/children", async (req, res) => {
    if (!req.user) return res.status(401).send("Not authenticated");
    
    const userChildren = await db.query.children.findMany({
      where: eq(children.userId, req.user.id),
      with: {
        achievements: true,
      },
    });
    res.json(userChildren);
  });

  app.post("/api/children", async (req, res) => {
    if (!req.user) return res.status(401).send("Not authenticated");
    
    const child = await db.insert(children)
      .values({
        ...req.body,
        userId: req.user.id,
      })
      .returning();
    res.json(child[0]);
  });

  // Achievements endpoints
  app.get("/api/achievements/:childId", async (req, res) => {
    if (!req.user) return res.status(401).send("Not authenticated");
    
    const childAchievements = await db.query.achievements.findMany({
      where: eq(achievements.childId, parseInt(req.params.childId)),
      orderBy: (achievements, { desc }) => [desc(achievements.date)],
    });
    res.json(childAchievements);
  });

  app.post("/api/achievements", async (req, res) => {
    if (!req.user) return res.status(401).send("Not authenticated");
    
    const achievement = await db.insert(achievements)
      .values(req.body)
      .returning();
    res.json(achievement[0]);
  });

  const httpServer = createServer(app);
  return httpServer;
}
