import express, { type Request, Response } from "express";
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWaitlistEntrySchema } from "@shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create API routes
  const apiRouter = express.Router();
  app.use("/api", apiRouter);

  // Waitlist API
  apiRouter.post("/waitlist", async (req: Request, res: Response) => {
    try {
      // Validate request body
      const validatedData = insertWaitlistEntrySchema.parse(req.body);
      
      // Add timestamp
      const entry = {
        ...validatedData,
        createdAt: new Date().toISOString()
      };
      
      // Store entry
      const result = await storage.addWaitlistEntry(entry);
      
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ 
          success: false, 
          message: "Validation failed", 
          errors: validationError.message 
        });
      } else if (error instanceof Error) {
        res.status(500).json({ 
          success: false, 
          message: error.message || "Failed to add to waitlist" 
        });
      } else {
        res.status(500).json({ 
          success: false, 
          message: "An unknown error occurred" 
        });
      }
    }
  });

  // Get waitlist entries (admin only in a real app)
  apiRouter.get("/waitlist", async (_req: Request, res: Response) => {
    try {
      const entries = await storage.getWaitlistEntries();
      res.status(200).json({ success: true, data: entries });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Failed to retrieve waitlist entries" 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
