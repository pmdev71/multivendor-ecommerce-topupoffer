# Socket.IO Setup Guide - Next.js API Routes Integration

## Overview

Socket.IO has been integrated with Next.js API Routes. This setup allows real-time communication between clients and the server.

## Architecture

1. **Server Side**: Socket.IO server initialized in `server.js` using custom Next.js server
2. **Client Side**: Socket.IO client hooks in `lib/socket-client.ts`
3. **API Integration**: Socket.IO events emitted from API routes when actions occur

## Setup Instructions

### 1. Use Custom Server

Socket.IO requires a persistent HTTP server connection. Use the custom server:

```bash
# Development
npm run dev:server

# Production
npm run start:server
```

### 2. Environment Variables

Make sure these are set in `.env.local`:

```env
NEXT_PUBLIC_SOCKET_URL=http://localhost:3000
```

### 3. Client-Side Usage

#### Using the Hook:

```tsx
'use client';

import { useSocket } from '@/lib/socket-client';

function MyComponent() {
  const token = 'your-jwt-token'; // Get from auth
  const { socket, isConnected } = useSocket(token);

  useEffect(() => {
    if (!socket) return;

    // Listen for events
    socket.on('order:new', (data) => {
      console.log('New order:', data);
    });

    // Emit events
    socket.emit('need:create', { needId: '123' });

    return () => {
      socket.off('order:new');
    };
  }, [socket]);

  return <div>Status: {isConnected ? 'Connected' : 'Disconnected'}</div>;
}
```

#### Manual Connection:

```tsx
import { initSocketClient, getSocketClient } from '@/lib/socket-client';

const token = 'your-jwt-token';
const socket = initSocketClient(token);

socket.on('connect', () => {
  console.log('Connected');
});

socket.emit('chat:join', { orderId: '123' });
```

## Socket.IO Events

### Customer Events

**Listen:**
- `need:offer` - New offer received for need request
- `offer:accept` - Offer accepted, order created
- `order:created` - Order created successfully
- `order:assign` - Order accepted by seller
- `order:complete` - Order completed
- `chat:message` - New chat message

**Emit:**
- `need:create` - Create need request (auto-emitted from API)
- `chat:join` - Join chat room
- `chat:message` - Send chat message

### Seller Events

**Listen:**
- `need:new` - New need request available
- `offer:accept` - Your offer was accepted
- `offer:rejected` - Your offer was not selected
- `order:new` - New order received
- `order:assigned` - Order accepted confirmation
- `order:completed` - Order completed confirmation
- `chat:message` - New chat message

**Emit:**
- `offer:submit` - Submit offer for need request (auto-emitted from API)
- `chat:join` - Join chat room
- `chat:message` - Send chat message

## API Routes Integration

Socket.IO events are automatically emitted from API routes:

### Need Request Created
```typescript
// app/api/needs/route.ts
// Automatically emits 'need:new' to all online sellers
```

### Offer Submitted
```typescript
// app/api/offers/route.ts
// Automatically emits 'need:offer' to customer
```

### Order Created
```typescript
// app/api/orders/route.ts
// Automatically emits 'order:new' to seller
```

### Order Accepted
```typescript
// app/api/orders/[id]/route.ts
// Automatically emits 'order:assign' to customer
```

### Order Completed
```typescript
// app/api/orders/[id]/route.ts
// Automatically emits 'order:complete' to customer
```

## Authentication

Socket.IO uses JWT token for authentication:

1. Token is sent in `auth.token` when connecting
2. Server verifies token using `verifyToken()` from `lib/jwt.ts`
3. User info is stored in `socket.data.user`

## Testing Socket.IO

### Check Status:
```bash
curl http://localhost:3000/api/socket/status
```

### Test Connection (Client):
```tsx
const socket = io('http://localhost:3000', {
  path: '/api/socket',
  auth: { token: 'your-token' }
});

socket.on('connect', () => {
  console.log('Connected!');
});
```

## Troubleshooting

### Socket.IO Not Connecting

1. **Check Server Running**: Make sure you're using `npm run dev:server` not `npm run dev`
2. **Check Token**: Verify JWT token is valid
3. **Check CORS**: Ensure CORS settings allow your origin
4. **Check Path**: Socket.IO path is `/api/socket`

### Events Not Receiving

1. **Check Room**: Make sure you've joined the correct room
2. **Check User ID**: Verify user ID matches room name
3. **Check Event Name**: Ensure event names match exactly

### Server Not Initializing

1. **Check Dependencies**: `npm install` to ensure all packages installed
2. **Check TypeScript**: Ensure TypeScript compiles without errors
3. **Check Logs**: Look for initialization errors in console

## Production Deployment

### Vercel/Netlify
- These platforms don't support custom servers
- Use a separate Socket.IO server or serverless functions
- Consider using Socket.IO Cloud or separate Node.js server

### Custom Server (Recommended)
- Deploy with custom server (`server.js`)
- Ensure persistent HTTP connection
- Use process manager like PM2

### Separate Socket.IO Server
- Run Socket.IO on separate port/server
- Update `NEXT_PUBLIC_SOCKET_URL` to point to Socket.IO server
- Use Redis adapter for multiple instances

## Example: Real-time Order Notification

```tsx
'use client';

import { useEffect, useState } from 'react';
import { useSocket } from '@/lib/socket-client';

export function OrderNotifications() {
  const token = 'your-token';
  const { socket, isConnected } = useSocket(token);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!socket) return;

    socket.on('order:new', (data) => {
      setNotifications(prev => [...prev, {
        type: 'new_order',
        message: `New order: ${data.orderNumber}`,
        timestamp: new Date(),
      }]);
    });

    return () => {
      socket.off('order:new');
    };
  }, [socket]);

  return (
    <div>
      {notifications.map((notif, i) => (
        <div key={i}>{notif.message}</div>
      ))}
    </div>
  );
}
```

## Additional Resources

- [Socket.IO Documentation](https://socket.io/docs/v4/)
- [Next.js Custom Server](https://nextjs.org/docs/pages/building-your-application/configuring/custom-server)
- [Socket.IO with Next.js](https://socket.io/docs/v4/server-initialization/)

