import { Server } from 'http';
import { getUserFromSession } from './auth';
import type { Express } from 'express';
import type { User } from '@shared/schema';
import { WebSocketServer } from 'ws';

// WebSocket connection states
const OPEN = 1; // WebSocket OPEN state constant

// Define our extended WebSocket client
interface WebSocketClient {
  isAlive: boolean;
  userId?: number;
  send: (data: string) => void;
  terminate: () => void;
  ping: (callback: () => void) => void;
  on: (event: string, listener: any) => void;
  readyState: number;
}

interface ContainerStatusUpdate {
  type: 'containerStatus';
  status: 'creating' | 'ready' | 'error';
  token: string;
  message?: string;
  containerUrl?: string;
}

// Store of container status by token
const containerStatusMap = new Map<string, {
  status: 'creating' | 'ready' | 'error';
  message?: string;
  containerUrl?: string;
  userId?: number;
}>();

// Global WebSocketServer instance to prevent multiple initialization
let wsInstance: WebSocketServer | null = null;

export function setupWebSockets(server: Server, app: Express) {
  // Only create a new WebSocketServer instance if one doesn't already exist
  if (!wsInstance) {
    wsInstance = new WebSocketServer({ server, path: '/ws' });
    console.log('WebSocket server initialized');
  } else {
    console.log('WebSocket server already initialized, reusing existing instance');
  }
  
  const wss = wsInstance;
  
  wss.on('connection', (ws: WebSocketClient, req: any) => {
    console.log('WebSocket client connected');
    ws.isAlive = true;
    
    // Extract session cookie and authenticate user
    const cookies = req.headers.cookie;
    if (cookies) {
      try {
        // Use the same session middleware logic from auth.ts
        getUserFromSession(cookies).then(user => {
          if (user) {
            ws.userId = user.id;
            console.log(`WebSocket authenticated for user ${user.id}`);
          }
        }).catch(err => {
          console.warn('WebSocket authentication error:', err);
        });
      } catch (err) {
        console.error('Error parsing cookies:', err);
      }
    }
    
    ws.on('pong', () => {
      ws.isAlive = true;
    });
    
    ws.on('message', (message: string) => {
      try {
        const data = JSON.parse(message);
        
        // Handle subscription to container status updates
        if (data.type === 'subscribe' && data.token) {
          console.log(`Client subscribed to updates for token: ${data.token}`);
          
          // If we already have status for this token, send it immediately
          const status = containerStatusMap.get(data.token);
          if (status) {
            ws.send(JSON.stringify({
              type: 'containerStatus',
              token: data.token,
              status: status.status,
              message: status.message,
              containerUrl: status.containerUrl
            }));
          }
        }
      } catch (err) {
        console.error('Error handling WebSocket message:', err);
      }
    });
    
    ws.on('close', () => {
      console.log('WebSocket client disconnected');
    });
  });
  
  // Ping clients every 30 seconds to keep connections alive
  const interval = setInterval(() => {
    wss.clients.forEach((wsRaw: any) => {
      const ws = wsRaw as WebSocketClient;
      if (ws.isAlive === false) return ws.terminate();
      
      ws.isAlive = false;
      ws.ping(() => {});
    });
  }, 30000);
  
  wss.on('close', () => {
    clearInterval(interval);
  });
  
  return {
    wss,
    updateContainerStatus: (token: string, status: 'creating' | 'ready' | 'error', message?: string, containerUrl?: string, userId?: number) => {
      // Store status update in the map
      containerStatusMap.set(token, {
        status,
        message,
        containerUrl,
        userId
      });
      
      // Broadcast to all connected clients that should receive this update
      wss.clients.forEach((clientRaw: any) => {
        const client = clientRaw as WebSocketClient;
        if (client.readyState === OPEN) {
          // If userId is set on the update, only send to that user
          if (!userId || client.userId === userId) {
            const update: ContainerStatusUpdate = {
              type: 'containerStatus',
              status,
              token,
              message,
              containerUrl
            };
            client.send(JSON.stringify(update));
          }
        }
      });
    }
  };
}

export function getContainerStatus(token: string) {
  return containerStatusMap.get(token);
}

// Helper function to extract user ID from session cookie for WebSocket authentication
export async function getUserFromWebSocketRequest(request: any): Promise<number | null> {
  const cookies = request.headers.cookie;
  if (!cookies) return null;
  
  try {
    const user = await getUserFromSession(cookies);
    return user?.id || null;
  } catch (err) {
    console.error('Error getting user from WebSocket request:', err);
    return null;
  }
}