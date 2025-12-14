import { NextRequest, NextResponse } from 'next/server';

/**
 * Socket.IO Info Route
 * Browser-এ direct access করলে Socket.IO server information দেখাবে
 * 
 * Note: "Transport unknown" error normal - Socket.IO needs proper handshake
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
        message: 'Socket.IO server not initialized',
        note: 'Please use custom server: npm run dev:server',
        instructions: {
          step1: 'Make sure server.js is running',
          step2: 'Socket.IO is initialized in server.js',
          step3: 'Check server console for initialization messages',
        },
        aboutTransportUnknown: {
          message: 'If you see "Transport unknown" error, it is NORMAL',
          explanation: 'Socket.IO requires proper handshake parameters. Direct browser access will show this error.',
          solution: 'Use socket.io-client library or test page: /socket-test.html',
        }
      }, { status: 503 });
    }

    // Return Socket.IO server info
    return NextResponse.json({
      success: true,
      message: 'Socket.IO server is running ✅',
      server: {
        connectedClients: io.engine?.clientsCount || 0,
        path: '/api/socket.io',
        transports: ['websocket', 'polling'],
        cors: 'enabled',
      },
      aboutDirectAccess: {
        note: 'Direct browser access to /api/socket.io shows "Transport unknown" - this is NORMAL',
        reason: 'Socket.IO requires proper handshake with query parameters',
        properWay: 'Use socket.io-client library or test page',
      },
      howToConnect: {
        testPage: 'http://localhost:3000/socket-test.html',
        browserConsole: `
// Browser Console-এ (F12)
const socket = io('http://localhost:3000', {
  path: '/api/socket.io',
  transports: ['websocket', 'polling']
});

socket.on('connect', () => {
  console.log('✅ Connected!', socket.id);
});
        `,
      },
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Socket.IO error',
      note: 'Direct browser access may show "Transport unknown" - this is normal',
    }, { status: 500 });
  }
}

