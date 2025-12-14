# Socket.IO Integration - Quick Start

## ✅ সম্পন্ন হয়েছে

Socket.IO Next.js API Routes-এর মাধ্যমে integrate করা হয়েছে।

## 🚀 Quick Start

### 1. Dependencies Install করুন

```bash
npm install
```

### 2. Development Server চালু করুন

**Option A: TypeScript Server (Recommended)**
```bash
npm run dev:server
```

**Option B: JavaScript Server**
```bash
npm run dev:server:js
```

**Option C: Standard Next.js Dev (Without Socket.IO)**
```bash
npm run dev
```

### 3. Socket.IO Status Check করুন

```bash
curl http://localhost:3000/api/socket/status
```

## 📁 Important Files

1. **`lib/socket-server.ts`** - Socket.IO Server Setup
2. **`lib/socket-client.ts`** - Client-side Socket.IO Hook
3. **`server.ts`** - TypeScript Custom Server
4. **`server.js`** - JavaScript Custom Server (Fallback)
5. **`components/chat.tsx`** - Chat Component with Socket.IO

## 🔌 Usage Example

### Client-Side (React Component)

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

    return () => {
      socket.off('order:new');
    };
  }, [socket]);

  return <div>Status: {isConnected ? 'Connected' : 'Disconnected'}</div>;
}
```

## 📡 Socket.IO Events

### Customer Events
- `need:offer` - New offer received
- `order:assign` - Order accepted by seller
- `order:complete` - Order completed
- `chat:message` - New chat message

### Seller Events
- `need:new` - New need request
- `order:new` - New order received
- `offer:accept` - Your offer accepted
- `chat:message` - New chat message

## 🔧 Troubleshooting

### Socket.IO Not Connecting?

1. **Check Server**: Make sure you're using `npm run dev:server`
2. **Check Token**: Verify JWT token is valid
3. **Check Port**: Ensure port 3000 is available
4. **Check Logs**: Look for initialization errors

### TypeScript Errors?

```bash
# Install tsx if not installed
npm install -D tsx

# Or use ts-node
npm install -D ts-node typescript
```

## 📚 More Information

See `SOCKET_SETUP.md` for detailed documentation.

