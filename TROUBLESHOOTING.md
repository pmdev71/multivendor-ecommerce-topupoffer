# Socket.IO Troubleshooting Guide

## "Transport unknown" Error

এই error সাধারণত দেখা যায় যখন Socket.IO client server-এর সাথে properly connect করতে পারে না।

### Solution 1: Check Server is Running

```bash
# Check if server is running
curl http://localhost:3000/api/socket.io/?EIO=4&transport=polling

# Should return Socket.IO handshake response
```

### Solution 2: Verify Socket.IO Path

Socket.IO path must be: `/api/socket.io` (not `/api/socket`)

### Solution 3: Check Client Connection

Client-এ connection করার সময়:

```typescript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000', {
  path: '/api/socket.io',
  transports: ['websocket', 'polling'],
  auth: {
    token: 'your-jwt-token'
  }
});
```

### Solution 4: Browser Console Check

Browser Console-এ check করুন:
- Network tab-এ Socket.IO requests দেখুন
- Console-এ connection errors check করুন

### Solution 5: Restart Server

```bash
npm run restart
# or
npm run kill:node
npm run clean
npm run dev:server
```

### Common Issues:

1. **Server not initialized**: Make sure `server.js` is running, not `next dev`
2. **Wrong path**: Use `/api/socket.io` not `/api/socket`
3. **CORS issues**: Check browser console for CORS errors
4. **Port conflict**: Make sure port 3000 is available

### Test Socket.IO Connection:

```javascript
// In browser console
const socket = io('http://localhost:3000', {
  path: '/api/socket.io',
  transports: ['websocket', 'polling']
});

socket.on('connect', () => {
  console.log('✅ Connected!', socket.id);
});

socket.on('connect_error', (error) => {
  console.error('❌ Connection error:', error);
});
```

