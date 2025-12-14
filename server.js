// Register ts-node to handle TypeScript files
require("ts-node").register({
  transpileOnly: true,
  compilerOptions: {
    module: "commonjs",
    moduleResolution: "node",
    esModuleInterop: true,
    resolveJsonModule: true,
    skipLibCheck: true,
    target: "ES2020",
  },
  project: "./tsconfig.json",
});

const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

/**
 * Next.js Custom Server with Socket.IO Integration
 * Socket.IO Server Next.js-এর সাথে integrate করার জন্য
 */

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({
  dev,
  hostname,
  port,
});
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    // Socket.IO automatically handles requests on its path
    // So we just pass all requests to Next.js handler
    // Socket.IO will intercept its own requests
    try {
      const parsedUrl = parse(req.url || "", true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("internal server error");
    }
  });

  // Socket.IO Server Initialize করা (HTTP Server-এর আগে)
  // Important: Socket.IO must be initialized BEFORE httpServer.listen()
  try {
    const { initSocketIO } = require("./lib/socket-server");
    const io = initSocketIO(httpServer);
    if (io) {
      // Store in global for API route access
      global.socketIOInstance = io;

      console.log("✅ Socket.IO server initialized successfully");
      console.log(`   Path: /api/socket.io`);
      console.log(`   Transports: websocket, polling`);
      console.log(`   Global access: enabled for API routes`);
      console.log(
        `   Status API: http://${hostname}:${port}/api/socket/status`
      );
    } else {
      console.error("❌ Socket.IO initialization returned null");
    }
  } catch (error) {
    console.error("❌ Socket.IO initialization error:", error.message);
    console.error(error.stack);
    console.log("\n💡 Make sure to install dependencies:");
    console.log("   npm install");
    console.log("\n💡 If TypeScript errors occur, install ts-node:");
    console.log("   npm install -D ts-node typescript");
  }

  httpServer.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
    console.log(
      `> Socket.IO available at http://${hostname}:${port}/api/socket.io`
    );
  });
});
