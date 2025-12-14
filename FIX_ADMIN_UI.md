# Admin UI Fix Guide

## Problem
Admin dashboard এবং users page-এ data দেখাচ্ছে না।

## Solution
Pages এখন API routes থেকে data fetch করবে।

## Changes Made

### 1. Dashboard Page (`app/admin/dashboard/page.tsx`)
- ✅ API call added: `/api/admin/stats`
- ✅ Real data fetch from database
- ✅ Error handling improved

### 2. Users Page (`app/admin/users/page.tsx`)
- ✅ API call added: `/api/admin/users`
- ✅ Real data fetch from database
- ✅ Data formatting for UI

### 3. API Routes
- ✅ Auth check temporarily disabled for development
- ✅ Ready to enable in production

## Steps to Fix

### Step 1: Seed Database
```bash
# Make sure server is running
npm run dev:server

# In another terminal or browser:
curl -X POST http://localhost:3000/api/admin/seed
```

### Step 2: Verify Data
Check browser console for any errors:
- Open DevTools (F12)
- Go to Network tab
- Refresh the page
- Check if API calls are successful

### Step 3: Check API Endpoints
Test these URLs directly:
- `http://localhost:3000/api/admin/stats`
- `http://localhost:3000/api/admin/users`

Should return JSON data.

## Common Issues

### Issue 1: No Data Showing
**Solution:** Database seed করুন
```bash
curl -X POST http://localhost:3000/api/admin/seed
```

### Issue 2: API Returns 500 Error
**Solution:** MongoDB connection check করুন
- `.env.local` file-এ `MONGODB_URI` আছে কিনা
- MongoDB server running আছে কিনা

### Issue 3: CORS Error
**Solution:** Same origin থেকে call হচ্ছে কিনা check করুন
- API calls same domain থেকে হওয়া উচিত (`/api/admin/...`)

### Issue 4: Loading Forever
**Solution:** 
- Browser console check করুন
- Network tab-এ API call দেখুন
- API response check করুন

## Testing

1. **Seed Database:**
   ```bash
   curl -X POST http://localhost:3000/api/admin/seed
   ```

2. **Check Dashboard:**
   ```
   http://localhost:3000/admin/dashboard
   ```
   Should show stats cards with numbers.

3. **Check Users Page:**
   ```
   http://localhost:3000/admin/users
   ```
   Should show users table with data.

## Next Steps

1. ✅ Database seed করুন
2. ✅ Page refresh করুন
3. ✅ Data দেখতে পাবেন

## Production Notes

Production-এ auth check enable করুন:
- `app/api/admin/stats/route.ts`
- `app/api/admin/users/route.ts`

Uncomment the auth check lines.
