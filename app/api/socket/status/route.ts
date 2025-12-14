import { NextRequest, NextResponse } from 'next/server';

/**
 * Socket.IO Status Check API
 * Socket.IO Server Running আছে কিনা Check করার জন্য
 * 
 * Note: Socket.IO is initialized in server.js
 * This route checks global variable set by server.js
 */
export async function GET(request: NextRequest) {
  try {
    // Check global variable (set by server.js)
    let io = null;
    
    if (typeof global !== 'undefined') {
      io = (global as any).socketIOInstance || null;
    }
    
    if (!io) {
      return NextResponse.json({
        success: false,
        status: 'not_initialized',
        message: 'Socket.IO server is not initialized.',
        instructions: [
          '1. Make sure you are using: npm run dev:server (not npm run dev)',
          '2. Socket.IO is initialized in server.js',
          '3. Check server console for "✅ Socket.IO server initialized" message',
          '4. Restart server if needed: npm run restart',
        ],
        note: 'Socket.IO requires custom server (server.js) to work properly.',
        troubleshooting: {
          checkServer: 'Look for "✅ Socket.IO server initialized" in server console',
          restartCommand: 'npm run restart',
          verifyPort: 'Make sure port 3000 is available',
        },
      });
    }

    // Socket.IO is initialized
    return NextResponse.json({
      success: true,
      status: 'running',
      connectedClients: io.engine?.clientsCount || 0,
      message: 'Socket.IO server is running ✅',
      path: '/api/socket.io',
      transports: ['websocket', 'polling'],
      serverInfo: {
        initialized: true,
        ready: io.engine ? 'ready' : 'not ready',
      },
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      status: 'error',
      error: error.message || 'Unknown error',
      note: 'Check server console for detailed error messages',
    }, { status: 500 });
  }
}

