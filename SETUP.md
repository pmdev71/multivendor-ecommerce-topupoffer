# Setup Guide - Multi-Vendor Digital Marketplace

## Quick Start Guide

### 1. Prerequisites
- Node.js 18+ installed
- MongoDB database (local or cloud like MongoDB Atlas)
- Git

### 2. Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd multivendor-like-indrive

# Install dependencies
npm install
# or
yarn install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
MONGODB_URI=mongodb://localhost:27017/multivendor-marketplace
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
NEXT_PUBLIC_SOCKET_URL=http://localhost:3000
```

### 4. Database Setup

Make sure MongoDB is running. If using MongoDB Atlas:
1. Create a cluster
2. Get connection string
3. Update `MONGODB_URI` in `.env.local`

### 5. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## First Admin User Setup

After starting the application, you need to create an admin user. You can do this by:

1. **Using MongoDB directly:**
```javascript
// Connect to MongoDB and run:
db.users.insertOne({
  email: "admin@example.com",
  name: "Admin User",
  role: "admin",
  wallet: { balance: 0, transactions: [] },
  isBlocked: false,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

2. **Or modify the Google OAuth response** to set role as admin for your email

## Testing the Application

### Customer Flow:
1. Login with Google
2. Browse products at `/products`
3. Create a need request at `/needs/create`
4. View offers and accept one
5. Track orders at `/orders`

### Seller Flow:
1. Login with Google
2. Register as seller at `/api/auth/register-seller`
3. Wait for admin approval
4. Go to seller dashboard
5. Add products and set prices
6. Toggle online status
7. Receive order notifications
8. Accept/Complete orders

### Admin Flow:
1. Login as admin
2. Go to admin dashboard
3. Approve sellers at `/admin/sellers`
4. Approve products at `/admin/products`
5. Manage withdrawals at `/admin/withdrawals`

## Socket.IO Setup

For Socket.IO to work properly, you need to:

1. **Option 1: Use Next.js API Routes** (Recommended for Next.js 15)
   - Socket.IO can be integrated via API routes
   - See `app/api/socket/route.ts` for reference

2. **Option 2: Custom Server** (For production)
   - Use `server.js` as custom server
   - Update `package.json` scripts:
   ```json
   "dev": "node server.js",
   "start": "NODE_ENV=production node server.js"
   ```

## Payment Gateway Integration

### SSLCommerz:
1. Sign up at https://developer.sslcommerz.com/
2. Get Store ID and Store Password
3. Add to `.env.local`:
   ```env
   SSLCOMMERZ_STORE_ID=your-store-id
   SSLCOMMERZ_STORE_PASSWORD=your-password
   SSLCOMMERZ_IS_LIVE=false
   ```
4. Implement payment API calls in `/app/api/wallet/deposit/route.ts`

### bKash:
1. Contact bKash for merchant account
2. Get API credentials
3. Add to `.env.local`:
   ```env
   BKASH_APP_KEY=your-app-key
   BKASH_APP_SECRET=your-app-secret
   BKASH_USERNAME=your-username
   BKASH_PASSWORD=your-password
   BKASH_IS_SANDBOX=true
   ```
4. Implement payment API calls in `/app/api/wallet/deposit/route.ts`

## Common Issues

### MongoDB Connection Error:
- Check MongoDB is running
- Verify `MONGODB_URI` in `.env.local`
- Check network/firewall settings

### Socket.IO Not Working:
- Ensure Socket.IO server is initialized
- Check `NEXT_PUBLIC_SOCKET_URL` matches your server URL
- Verify token is being sent in Socket.IO auth

### Authentication Issues:
- Check JWT_SECRET is set
- Verify Google OAuth credentials
- Check token expiration

## Production Deployment

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Set production environment variables:**
   - Use secure MongoDB connection string
   - Set strong JWT_SECRET
   - Enable SSLCommerz live mode
   - Update Socket.IO URL

3. **Deploy to Vercel/Netlify/Your Server:**
   - Follow platform-specific deployment guides
   - Ensure environment variables are set
   - MongoDB should be accessible from deployment platform

## Support

For issues or questions, please check:
- README.md for detailed documentation
- Code comments (Bengali) for implementation details
- API routes for endpoint documentation

