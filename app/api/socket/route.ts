import { NextRequest } from 'next/server';
import { Server as HTTPServer } from 'http';
import { initSocketIO, getSocketIO } from '@/lib/socket-server';

/**
 * Socket.IO API Route Handler
 * Next.js API Routes-এর মাধ্যমে Socket.IO Server Initialize করা
 */

// Global variable to store HTTP server instance
let httpServer: HTTPServer | null = null;

export async function GET(request: NextRequest) {
  // Check if Socket.IO is already initialized
  const io = getSocketIO();
  
  if (io) {
    return Response.json({
      success: true,
      message: 'Socket.IO server is already running',
      connected: io.engine.clientsCount,
    });
  }

  return Response.json({
    success: false,
    message: 'Socket.IO server not initialized. Please use custom server or initialize via API.',
  });
}

/**
 * Note: Socket.IO requires a persistent HTTP server connection.
 * For Next.js API routes, you need to:
 * 
 * Option 1: Use a custom server (server.js)
 * Option 2: Use a separate Socket.IO server
 * Option 3: Use Next.js API Routes with Socket.IO adapter
 * 
 * This route is mainly for checking Socket.IO status.
 * Actual Socket.IO initialization should be done in server.js
 */
