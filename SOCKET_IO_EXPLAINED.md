# Socket.IO Link-এ কি দেখাবে?

## `http://localhost:3000/api/socket.io` - Direct Browser Access

### ❌ "Transport unknown" Error কেন আসে?

যখন আপনি browser-এ directly `/api/socket.io` access করেন **without proper Socket.IO handshake parameters**, তখন Socket.IO server "Transport unknown" error দেয়। এটি **normal behavior**।

### ✅ কি দেখতে পাওয়া উচিত:

#### Option 1: Proper Handshake URL (Socket.IO Client এর জন্য)
```
http://localhost:3000/api/socket.io/?EIO=4&transport=polling
```
**Response:** Socket.IO handshake JSON
```json
{
  "sid": "unique-session-id",
  "upgrades": ["websocket"],
  "pingInterval": 25000,
  "pingTimeout": 60000,
  "maxPayload": 1000000
}
```

#### Option 2: Info Route (Browser-এ Direct Access)
```
http://localhost:3000/api/socket.io
```
**Response:** Server Information (আমি API route তৈরি করেছি)
```json
{
  "success": true,
  "message": "Socket.IO server is running ✅",
  "server": {
    "connectedClients": 0,
    "path": "/api/socket.io",
    "transports": ["websocket", "polling"]
  },
  "howToConnect": {
    "client": "Use socket.io-client",
    "example": "..."
  }
}
```

## 🧪 Test করার উপায়:

### 1. Browser Console Test:
```javascript
// Browser Console-এ (F12)
const socket = io('http://localhost:3000', {
  path: '/api/socket.io',
  transports: ['websocket', 'polling']
});

socket.on('connect', () => {
  console.log('✅ Connected!', socket.id);
});
```

### 2. Test HTML Page:
```
http://localhost:3000/socket-test.html
```
এই page-এ visual test করতে পারবেন।

### 3. Status Check:
```
http://localhost:3000/api/socket/status
```

## 📝 Summary:

- **Direct browser access** → Info page দেখাবে (API route)
- **Socket.IO client** → Proper connection হবে
- **"Transport unknown"** → Normal (proper parameters ছাড়া)

**Important:** Socket.IO-এর জন্য browser-এ direct access না করে, **socket.io-client library** ব্যবহার করুন।

