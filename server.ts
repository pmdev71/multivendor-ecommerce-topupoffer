import { createServer, Server as HTTPServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { initSocketIO } from './lib/socket-server';

/**
 * Next.js Custom Server with Socket.IO Integration (TypeScript Version)
 * Socket.IO Server Next.js-এর সাথে integrate করার জন্য
 * 
 * Usage: ts-node server.ts (with ts-node installed)
 * Or: Compile to JS and use node server.js
 */

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer: HTTPServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url || '', true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  // Socket.IO Server Initialize করা
  try {
    initSocketIO(httpServer);
    console.log('✅ Socket.IO server initialized');
  } catch (error) {
    console.error('❌ Socket.IO initialization error:', error);
  }

  httpServer.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
    console.log(`> Socket.IO available at http://${hostname}:${port}/api/socket`);
  });
});

