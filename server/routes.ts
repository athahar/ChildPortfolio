import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { db } from "@db";
import { children, achievements } from "@db/schema";
import { eq } from "drizzle-orm";
import { upload } from "./uploads";
import path from "path";
import fs from "fs/promises";

export function registerRoutes(app: Express): Server {
  setupAuth(app);

  // Ensure uploads directory exists
  fs.mkdir("uploads", { recursive: true }).catch(console.error);
  
  // Serve uploaded files
  app.use("/uploads", express.static("uploads"));

  // API Routes
  const apiRouter = express.Router();

  // Children endpoints
  apiRouter.get("/children", async (req, res) => {
    if (!req.user) return res.status(401).send("Not authenticated");
    
    const userChildren = await db.query.children.findMany({
      where: eq(children.userId, req.user.id),
      with: {
        achievements: true,
      },
    });
    res.json(userChildren);
  });

  apiRouter.post("/children", async (req, res) => {
    if (!req.user) return res.status(401).send("Not authenticated");
    
    const child = await db.insert(children)
      .values({
        ...req.body,
        userId: req.user.id,
      })
      .returning();
    res.json(child[0]);
  });

  // File upload endpoint
  apiRouter.post("/upload", upload.array("files", 5), (req, res) => {
    if (!req.user) {
      return res.status(401).send("Not authenticated");
    }
    
    try {
      const files = (req.files as Express.Multer.File[]) || [];
      const fileUrls = files.map(file => `/uploads/${file.filename}`);
      res.json({ urls: fileUrls });
    } catch (error) {
      console.error("[Upload] Error processing files:", error);
      res.status(500).send("Error processing upload");
    }
  });

  // Achievements endpoints
  apiRouter.get("/achievements/:childId", async (req, res) => {
    if (!req.user) return res.status(401).send("Not authenticated");
    
    const childAchievements = await db.query.achievements.findMany({
      where: eq(achievements.childId, parseInt(req.params.childId)),
      orderBy: (achievements, { desc }) => [desc(achievements.date)],
    });
    res.json(childAchievements);
  });

  apiRouter.post("/achievements", async (req, res) => {
    if (!req.user) return res.status(401).send("Not authenticated");
    
    const achievement = await db.insert(achievements)
      .values(req.body)
      .returning();
    res.json(achievement[0]);
  });

  // Mount API routes
  app.use("/api", apiRouter);

  const httpServer = createServer(app);
  return httpServer;
}
