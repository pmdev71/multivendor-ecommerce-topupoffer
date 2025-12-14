# Socket.IO Quick Fix Guide

## সমস্যা: "Socket.IO server is not initialized"

### ✅ Solution:

1. **Server Restart করুন:**
   ```bash
   npm run restart
   ```

2. **Check Server Console:**
   Server start করার পর console-এ দেখবেন:
   ```
   ✅ Socket.IO server initialized successfully
      Path: /api/socket.io
      Transports: websocket, polling
      Global access: enabled for API routes
   ```

3. **Test Status API:**
   ```
   http://localhost:3000/api/socket/status
   ```

### যদি এখনও কাজ না করে:

1. **All Node Processes Kill করুন:**
   ```bash
   npm run kill:node
   ```

2. **Cache Clear করুন:**
   ```bash
   npm run clean
   ```

3. **Server Start করুন:**
   ```bash
   npm run dev:server
   ```

### Important Notes:

- ✅ **Use:** `npm run dev:server` (custom server)
- ❌ **Don't use:** `npm run dev` (standard Next.js dev - Socket.IO won't work)

### Verification:

Server console-এ দেখবেন:
- `✅ Socket.IO server initialized successfully`
- `> Ready on http://localhost:3000`
- `> Socket.IO available at http://localhost:3000/api/socket.io`

Browser-এ test করুন:
- `http://localhost:3000/api/socket/status` → Should show `"success": true`

