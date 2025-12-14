# Database Seed Instructions

## 🚀 Quick Start

### Method 1: API Route (Easiest) ✅

1. **Server Start করুন:**
   ```bash
   npm run dev:server
   ```

2. **Browser বা Postman থেকে API Call করুন:**
   ```
   POST http://localhost:3000/api/admin/seed
   ```

   অথবা **Terminal থেকে:**
   ```bash
   curl -X POST http://localhost:3000/api/admin/seed
   ```

3. **Response দেখবেন:**
   ```json
   {
     "success": true,
     "message": "Database seeded successfully!",
     "summary": {
       "users": 15,
       "customers": 8,
       "sellers": 6,
       "admins": 1,
       ...
     }
   }
   ```

### Method 2: Script Command

```bash
npm run seed
```

## 📊 Created Data Summary

### Users (15 total)
- ✅ **1 Admin** - `admin@example.com`
- ✅ **8 Customers** (1 blocked)
- ✅ **6 Sellers** (1 pending, 1 blocked)

### Sellers (6 profiles)
- ✅ **4 Approved & Active**
- ✅ **1 Pending Approval**
- ✅ **1 Blocked**

### Products (8 total)
- ✅ **5 Active Products**
- ✅ **1 Inactive Product**
- ✅ **2 Pending Approval**

### Seller Products (10)
- ✅ Different sellers selling same products at different prices

### Orders (6)
- ✅ **2 Completed**
- ✅ **2 Assigned**
- ✅ **1 Pending**
- ✅ **1 Cancelled**

### Withdrawals (5)
- ✅ **2 Pending**
- ✅ **1 Approved**
- ✅ **1 Completed**
- ✅ **1 Rejected**

## ✅ Verification Steps

Seed করার পর admin dashboard-এ check করুন:

1. **Dashboard** → `/admin/dashboard`
   - Stats cards দেখবেন

2. **Users** → `/admin/users`
   - 15 users দেখবেন (8 customers, 6 sellers, 1 admin)

3. **Sellers** → `/admin/sellers`
   - 6 sellers দেখবেন (4 approved, 1 pending, 1 blocked)

4. **Products** → `/admin/products`
   - 8 products দেখবেন

5. **Orders** → `/admin/orders`
   - 6 orders দেখবেন

6. **Withdrawals** → `/admin/withdrawals`
   - 5 withdrawals দেখবেন

## 🔄 Reset Data

Database reset করতে হলে আবার seed করুন:
```bash
curl -X POST http://localhost:3000/api/admin/seed
```

**Note:** Script automatically clears existing data before adding new data.

## ⚠️ Important

1. **MongoDB Connection**: `.env.local` file-এ `MONGODB_URI` set করা থাকতে হবে
2. **MongoDB Running**: MongoDB server running থাকতে হবে
3. **Server Running**: `npm run dev:server` running থাকতে হবে (API route method-এর জন্য)

## 🎯 Test Credentials

### Admin
- Email: `admin@example.com`
- Role: `admin`

### Customers
- `john.doe@example.com`
- `jane.smith@example.com`
- `bob.wilson@example.com`
- `alice.brown@example.com`
- `blocked.user@example.com` (blocked)
- etc.

### Sellers
- `seller1@techstore.com` → Tech Store BD (approved)
- `seller2@digital.com` → Digital Services (approved)
- `seller3@services.com` → Mobile Data Hub (approved)
- `seller4@mobile.com` → Internet Packages Pro (approved)
- `seller5@pending.com` → Pending Store (pending)
- `seller6@blocked.com` → Blocked Store (blocked)

## 💡 Tips

- API route method সবচেয়ে reliable
- Browser DevTools Network tab থেকে response দেখতে পারবেন
- Seed করার পর page refresh করুন
- Data দেখতে না পেলে MongoDB connection check করুন

