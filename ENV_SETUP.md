# Environment Variables Setup Guide

## 📋 Required Environment Variables

`.env.local` file-এ নিচের environment variables গুলো add করতে হবে:

## 🔧 Setup Steps

### 1. Create `.env.local` File

Project root directory-তে `.env.local` file তৈরি করুন (যদি না থাকে)।

### 2. Copy from `.env.example`

`.env.example` file থেকে content copy করে `.env.local`-এ paste করুন।

### 3. Update Values

নিচের values গুলো update করুন:

## 📝 Environment Variables

### MongoDB Connection (Required)
```env
MONGODB_URI=mongodb://localhost:27017/multivendor-marketplace
```

**Local MongoDB:**
```env
MONGODB_URI=mongodb://localhost:27017/multivendor-marketplace
```

**MongoDB Atlas:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/multivendor-marketplace
```

### JWT Secret (Required)
```env
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-characters-long
```

**Important:** Production-এ একটি strong random string ব্যবহার করুন (minimum 32 characters)।

### Next.js Socket URL (Required)
```env
NEXT_PUBLIC_SOCKET_URL=http://localhost:3000
```

Production-এ আপনার domain URL ব্যবহার করুন:
```env
NEXT_PUBLIC_SOCKET_URL=https://yourdomain.com
```

### Google OAuth (Already Configured)
```env
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

✅ এই credentials already configured আছে।

### Payment Gateways (Optional - For Future)

#### SSLCommerz
```env
SSLCOMMERZ_STORE_ID=your-store-id
SSLCOMMERZ_STORE_PASSWORD=your-store-password
SSLCOMMERZ_IS_LIVE=false
```

#### bKash
```env
BKASH_APP_KEY=your-bkash-app-key
BKASH_APP_SECRET=your-bkash-app-secret
BKASH_USERNAME=your-bkash-username
BKASH_PASSWORD=your-bkash-password
BKASH_IS_SANDBOX=true
```

## ✅ Minimum Required Variables

Database seed করার জন্য minimum এই variables গুলো required:

```env
MONGODB_URI=mongodb://localhost:27017/multivendor-marketplace
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NEXT_PUBLIC_SOCKET_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

## 🔍 Verification

### Check if `.env.local` exists:
```bash
ls -la .env.local
```

### Check MongoDB Connection:
```bash
# MongoDB running check
mongosh mongodb://localhost:27017/multivendor-marketplace
```

### Test Environment Variables:
Server start করার পর console-এ দেখবেন:
```
✅ MongoDB Connected Successfully
```

## ⚠️ Important Notes

1. **`.env.local` is gitignored** - এটি version control-এ commit হবে না
2. **Never commit secrets** - Production secrets কখনো commit করবেন না
3. **Restart Server** - Environment variables change করার পর server restart করতে হবে
4. **MongoDB Running** - MongoDB server running থাকতে হবে

## 🚀 Quick Setup

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Update `MONGODB_URI`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/multivendor-marketplace
   ```

3. Update `JWT_SECRET`:
   ```env
   JWT_SECRET=your-random-secret-key-min-32-chars
   ```

4. Restart server:
   ```bash
   npm run dev:server
   ```

5. Seed database:
   ```bash
   curl -X POST http://localhost:3000/api/admin/seed
   ```

## 📚 Additional Resources

- MongoDB Setup: https://www.mongodb.com/docs/manual/installation/
- MongoDB Atlas: https://www.mongodb.com/cloud/atlas
- Google OAuth Setup: `GOOGLE_OAUTH_SETUP.md`

