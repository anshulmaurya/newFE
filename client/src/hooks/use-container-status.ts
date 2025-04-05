import { useState, useEffect } from 'react';

interface ContainerStatus {
  status: 'creating' | 'ready' | 'error';
  message?: string;
  containerUrl?: string;
  token?: string;  // Token is needed to update from temporary to real token
}

/**
 * Hook to subscribe to container status updates via WebSocket
 * @param token The container token to subscribe to
 * @returns The current container status
 */
export function useContainerStatus(token?: string) {
  const [status, setStatus] = useState<ContainerStatus | null>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    if (!token) return;
    
    // Create WebSocket connection with the specific path
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const wsUrl = `${protocol}://${window.location.host}/ws`;
    console.log('Connecting to WebSocket at:', wsUrl);
    const socket = new WebSocket(wsUrl);
    
    socket.onopen = () => {
      console.log('WebSocket connected');
      // Subscribe to updates for this token
      socket.send(JSON.stringify({
        type: 'subscribe',
        token: token
      }));
    };
    
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        // Handle container status updates
        if (data.type === 'containerStatus') {
          // For temporary tokens, we need to accept ANY container status update
          // that might contain our real token
          const isTemporaryToken = token.startsWith('temp-');
          
          // Accept the message if:
          // 1. The tokens match exactly, OR
          // 2. We have a temporary token and need to catch the real token update
          if (data.token === token || isTemporaryToken) {
            console.log('Received container status update:', data);
            setStatus({
              status: data.status,
              message: data.message,
              containerUrl: data.containerUrl,
              token: data.token // Include the token in the status
            });
          }
        }
      } catch (err) {
        console.error('Error parsing WebSocket message:', err);
      }
    };
    
    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    
    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };
    
    setWs(socket);
    
    // Cleanup function
    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [token]);
  
  return status;
}