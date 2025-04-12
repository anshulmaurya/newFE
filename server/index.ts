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

// Special handling for root-level files for Safari compatibility
// Safari is very specific about its favicon handling
app.use(express.static(path.join(__dirname, "../public"), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.png')) {
      res.setHeader('Content-Type', 'image/png');
      // Aggressive cache-busting headers for Safari
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    } else if (filePath.endsWith('.ico')) {
      res.setHeader('Content-Type', 'image/x-icon');
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    }
  }
}));

// High-priority Safari-specific apple-touch-icon.png handler
app.get([
  '/apple-touch-icon.png',
  '/apple-touch-icon-precomposed.png',
  '/apple-touch-icon-*.png',
  '/favicon-*.png'
], (req, res, next) => {
  // First check if the file exists in the root public directory (preferred by Safari)
  const publicPath = path.join(__dirname, "../public");
  const requestedFile = req.path;
  const filePath = path.join(publicPath, requestedFile);
  
  if (fs.existsSync(filePath)) {
    // Safari-specific aggressive non-caching headers
    res.set({
      'Content-Type': 'image/png',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'X-Content-Type-Options': 'nosniff'
    });
    
    return res.sendFile(filePath);
  }
  
  next();
});

// Catch-all for standard favicon files
app.get([
  "/favicon.ico",
  "/favicon.svg",
  "/manifest.json"
], (req, res, next) => {
  // First check public directory
  const publicPath = path.join(__dirname, "../public");
  let filePath = path.join(publicPath, req.path);
  
  if (!fs.existsSync(filePath)) {
    // Then check client/public as fallback
    const clientPublicPath = path.join(__dirname, "../client/public");
    filePath = path.join(clientPublicPath, req.path);
  }
  
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
    
    // Use cache-busting headers to ensure Safari refreshes the favicon
    res.set({
      "Content-Type": contentType,
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "Pragma": "no-cache",
      "Expires": "0",
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
