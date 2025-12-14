'use client';

import { io, Socket } from 'socket.io-client';
import { useEffect, useState } from 'react';

/**
 * Socket.IO Client Hook
 * Frontend-এ Socket.IO Connection Manage করার জন্য
 */

let socketInstance: Socket | null = null;

/**
 * Socket.IO Connection Initialize করার Function
 */
export function initSocketClient(token: string): Socket {
  if (socketInstance?.connected) {
    return socketInstance;
  }

  const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000';

  socketInstance = io(socketUrl, {
    path: '/api/socket.io',
    auth: {
      token: token,
    },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
    forceNew: false,
  });

  socketInstance.on('connect', () => {
    console.log('✅ Socket.IO connected');
  });

  socketInstance.on('disconnect', () => {
    console.log('❌ Socket.IO disconnected');
  });

  socketInstance.on('connect_error', (error) => {
    console.error('Socket.IO connection error:', error);
  });

  return socketInstance;
}

/**
 * Get Socket.IO Instance
 */
export function getSocketClient(): Socket | null {
  return socketInstance;
}

/**
 * Disconnect Socket.IO
 */
export function disconnectSocket() {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
}

/**
 * React Hook for Socket.IO
 */
export function useSocket(token: string | null) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!token) {
      console.log('⚠️ useSocket: No token provided');
      return;
    }

    console.log('🔌 useSocket: Initializing socket connection...');
    const socketClient = initSocketClient(token);
    setSocket(socketClient);

    const onConnect = () => {
      console.log('✅ useSocket: Socket connected', { socketId: socketClient.id });
      setIsConnected(true);
    };

    const onDisconnect = () => {
      console.log('❌ useSocket: Socket disconnected');
      setIsConnected(false);
    };

    const onConnectError = (error: Error) => {
      console.error('❌ useSocket: Connection error', error);
    };

    socketClient.on('connect', onConnect);
    socketClient.on('disconnect', onDisconnect);
    socketClient.on('connect_error', onConnectError);

    // Check initial connection state
    if (socketClient.connected) {
      setIsConnected(true);
    }

    return () => {
      socketClient.off('connect', onConnect);
      socketClient.off('disconnect', onDisconnect);
      socketClient.off('connect_error', onConnectError);
      // Don't disconnect on cleanup, keep connection alive
      // socketClient.disconnect();
    };
  }, [token]);

  return { socket, isConnected };
}

