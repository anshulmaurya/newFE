import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { setupWebSockets } from "./socket";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Set NODE_ENV based on Replit environment
// If we're running on dspcoder.replit.app, assume it's production
if (process.env.REPL_SLUG === 'dspcoder' && process.env.REPL_OWNER) {
  process.env.NODE_ENV = 'production';
  console.log('Running in production mode');
} else {
  process.env.NODE_ENV = process.env.NODE_ENV || 'development';
  console.log(`Running in ${process.env.NODE_ENV} mode`);
}

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Custom middleware for favicon handling with proper MIME types for Safari compatibility
app.get([
  "/favicon.ico", 
  "/favicon.png", 
  "/favicon.svg", 
  "/manifest.json", 
  "/apple-touch-icon.png",
  "/apple-touch-icon-precomposed.png",
  "/apple-touch-icon-120x120.png",
  "/apple-touch-icon-120x120-precomposed.png",
  "/apple-touch-icon-152x152.png",
  "/apple-touch-icon-152x152-precomposed.png",
  "/apple-touch-icon-167x167.png",
  "/apple-touch-icon-167x167-precomposed.png",
  "/apple-touch-icon-180x180.png",
  "/apple-touch-icon-180x180-precomposed.png"
], (req, res, next) => {
  const clientPublicPath = path.join(__dirname, "../client/public");
  
  // Map any Apple touch icon requests to our apple-touch-icon.png
  if (req.path.includes("apple-touch-icon")) {
    const appleIconPath = path.join(clientPublicPath, "/apple-touch-icon.png");
    
    if (fs.existsSync(appleIconPath)) {
      // Set proper headers for Safari
      res.set({
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400", // 24 hours
        "X-Content-Type-Options": "nosniff"
      });
      
      return res.sendFile(appleIconPath);
    }
  }
  
  // Handle regular favicon files
  const filePath = path.join(clientPublicPath, req.path);
  
  if (fs.existsSync(filePath)) {
    const ext = path.extname(req.path).toLowerCase();
    let contentType = "text/plain";
    
    switch (ext) {
      case ".ico":
        contentType = "image/x-icon";
        break;
      case ".png":
        contentType = "image/png";
        break;
      case ".svg":
        contentType = "image/svg+xml";
        break;
      case ".json":
        contentType = "application/json";
        break;
    }
    
    // Set proper headers with strong caching
    res.set({
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=86400", // 24 hours
      "X-Content-Type-Options": "nosniff"
    });
    
    return res.sendFile(filePath);
  }
  
  next();
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);
  
  // Set up WebSocket server and expose container status update function
  const { updateContainerStatus } = setupWebSockets(server, app);
  
  // Make the update function available globally via the app object
  (app as any).updateContainerStatus = updateContainerStatus;
  console.log('WebSocket server and container status updates initialized');

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port} with WebSocket support`);
  });
})();
