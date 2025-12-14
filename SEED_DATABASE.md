# Database Seed Guide

Database-এ dummy data add করার জন্য guide।

## Method 1: API Route (Recommended)

### Step 1: Server Start করুন
```bash
npm run dev:server
```

### Step 2: API Call করুন
Browser বা Postman থেকে:
```
POST http://localhost:3000/api/admin/seed
```

অথবা terminal থেকে:
```bash
curl -X POST http://localhost:3000/api/admin/seed
```

## Method 2: Script Command

### Step 1: Script Run করুন
```bash
npm run seed
```

অথবা:
```bash
npm run seed:db
```

## 📊 Created Data

### Users
- **1 Admin** (`admin@example.com`)
- **8 Customers** (including 1 blocked)
- **6 Sellers** (including 1 pending, 1 blocked)

### Sellers
- **6 Seller Profiles**
  - 4 Approved & Active
  - 1 Pending Approval
  - 1 Blocked

### Products
- **8 Products**
  - 5 Active
  - 1 Inactive
  - 2 Pending Approval

### Seller Products
- **10 Seller Products** (different sellers selling same products at different prices)

### Orders
- **6 Orders**
  - 2 Completed
  - 2 Assigned
  - 1 Pending
  - 1 Cancelled

### Withdrawals
- **5 Withdrawal Requests**
  - 2 Pending
  - 1 Approved
  - 1 Completed
  - 1 Rejected

## 🔄 Reset Data

Database reset করতে হলে আবার seed script run করুন:
```bash
npm run seed
```

**Note:** Script automatically clears existing data before adding new data.

## ✅ Verification

Seed করার পর check করুন:
1. Admin Dashboard → Users page
2. Admin Dashboard → Sellers page
3. Admin Dashboard → Products page
4. Admin Dashboard → Orders page
5. Admin Dashboard → Withdrawals page

সব page-এ data দেখতে পাবেন!

## 🎯 Test Credentials

### Admin Login
- Email: `admin@example.com`
- Role: `admin`

### Customer Users
- `john.doe@example.com`
- `jane.smith@example.com`
- `bob.wilson@example.com`
- etc.

### Seller Users
- `seller1@techstore.com` (Tech Store BD)
- `seller2@digital.com` (Digital Services)
- `seller3@services.com` (Mobile Data Hub)
- etc.

## ⚠️ Important Notes

1. **Environment Variables**: Make sure `.env.local` file-এ `MONGODB_URI` set করা আছে
2. **Database Connection**: MongoDB server running থাকতে হবে
3. **Data Clearing**: Script automatically clears existing data
4. **Production**: Production environment-এ seed script use করবেন না

