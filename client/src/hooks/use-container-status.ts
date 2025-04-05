import { useState, useEffect } from 'react';

interface ContainerStatus {
  status: 'creating' | 'ready' | 'error';
  message?: string;
  containerUrl?: string;
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
        if (data.type === 'containerStatus' && data.token === token) {
          console.log('Received container status update:', data);
          setStatus({
            status: data.status,
            message: data.message,
            containerUrl: data.containerUrl
          });
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