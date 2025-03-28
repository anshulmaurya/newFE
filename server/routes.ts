import express, { type Request, Response } from "express";
import type { Express } from "express";
import { createServer, type Server } from "http";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create API routes
  const apiRouter = express.Router();
  app.use("/api", apiRouter);

  // Health check endpoint
  apiRouter.get("/health", async (_req: Request, res: Response) => {
    res.status(200).json({ 
      status: "ok", 
      timestamp: new Date().toISOString() 
    });
  });

  const httpServer = createServer(app);

  return httpServer;
}
