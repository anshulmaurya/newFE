import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { setupWebSockets, closeWebSocketServer } from "./socket";
import { setContainerInactivityTimeout } from "./container-activity";

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
  
  // Initialize container activity tracking with inactivity timeout (30 minutes for production)
  setContainerInactivityTimeout(30 * 60 * 1000); // 30 minutes in milliseconds

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
  const startServer = (port: number = 5000, retries: number = 3) => {
    try {
      server.listen({
        port,
        host: "0.0.0.0",
        reusePort: true,
      }, () => {
        log(`serving on port ${port} with WebSocket support`);
      });

      // Add error handler for the server
      server.on('error', (err: any) => {
        if (err.code === 'EADDRINUSE' && retries > 0) {
          console.log(`Port ${port} is in use, attempting to close existing connections...`);
          
          // First close the WebSocket server
          closeWebSocketServer();
          
          // Try to recover by finding a new port
          const newPort = port + 1;
          console.log(`Attempting to use port ${newPort} instead...`);
          
          // Short delay to allow connections to close
          setTimeout(() => {
            startServer(newPort, retries - 1);
          }, 1000);
        } else {
          console.error('Server error:', err);
          closeWebSocketServer();
          process.exit(1);
        }
      });
    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
  };

  // Start the server
  startServer();
  
  // Handle graceful shutdown
  const handleShutdown = () => {
    console.log('Shutting down server gracefully...');
    closeWebSocketServer();
    server.close(() => {
      console.log('Server closed successfully');
      process.exit(0);
    });
    
    // Force exit after timeout
    setTimeout(() => {
      console.error('Forced shutdown after timeout');
      process.exit(1);
    }, 5000);
  };
  
  // Listen for termination signals
  process.on('SIGTERM', handleShutdown);
  process.on('SIGINT', handleShutdown);
})();
