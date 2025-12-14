# Multi-Vendor Digital Marketplace

একটি সম্পূর্ণ Multi-Vendor Digital Product Marketplace Platform যেটা Uber/inDrive-এর মতো কাজ করবে, কিন্তু Ride Sharing এর পরিবর্তে Digital Products (Internet Package, Mobile Data, Digital Services) বিক্রির জন্য।

## 🚀 Features

### Customer Features

- ✅ Google One Click Login
- ✅ Product List দেখতে পারবে (Lowest Price আগে)
- ✅ Direct Order করতে পারবে নির্দিষ্ট Seller থেকে
- ✅ Need Request System - সকল Seller-দের থেকে Live Price Offer নিতে পারবে
- ✅ Order Tracking
- ✅ Live Chat with Seller
- ✅ Wallet System
- ✅ Multiple Payment Methods (Wallet, SSLCommerz, bKash)

### Seller Features

- ✅ Google One Click Login
- ✅ Store/Shop Name Setup
- ✅ Product Add & Price Management
- ✅ Online/Offline Toggle
- ✅ Realtime Order Notifications
- ✅ Order Accept/Reject/Complete
- ✅ Earnings Dashboard
- ✅ Withdrawal Request System

### Admin Features

- ✅ Seller Approve/Block
- ✅ User Block
- ✅ Product Management (Create, Edit, Delete, Approve)
- ✅ Order Monitoring & Cancellation
- ✅ Withdrawal Management
- ✅ Commission Control

## 📋 Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS
- **Backend**: Next.js API Routes, MongoDB (Mongoose)
- **Real-time**: Socket.IO
- **Authentication**: JWT, Google OAuth
- **Payment**: SSLCommerz, bKash Integration Ready
- **State Management**: Zustand (optional)

## 🛠️ Installation

### Prerequisites

- Node.js 18+
- MongoDB Database
- npm or yarn

### Setup Steps

1. **Clone the repository**

```bash
git clone <repository-url>
cd multivendor-like-indrive
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
```

3. **Environment Variables**
   Create a `.env.local` file in the root directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/multivendor-marketplace

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Next.js
NEXT_PUBLIC_SOCKET_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# SSLCommerz (Payment Gateway)
SSLCOMMERZ_STORE_ID=your-store-id
SSLCOMMERZ_STORE_PASSWORD=your-store-password
SSLCOMMERZ_IS_LIVE=false

# bKash (Payment Gateway)
BKASH_APP_KEY=your-bkash-app-key
BKASH_APP_SECRET=your-bkash-app-secret
BKASH_USERNAME=your-bkash-username
BKASH_PASSWORD=your-bkash-password
BKASH_IS_SANDBOX=true
```

4. **Run Development Server**

```bash
npm run dev
# or
yarn dev
```

5. **Build for Production**

```bash
npm run build
npm start
```

## 📁 Project Structure

```
multivendor-like-indrive/
├── app/
│   ├── (auth)/              # Authentication pages
│   ├── (customer)/          # Customer dashboard pages
│   │   ├── products/       # Product listing & details
│   │   ├── needs/          # Need request pages
│   │   └── orders/         # Order management
│   ├── (seller)/           # Seller dashboard pages
│   │   ├── dashboard/      # Seller dashboard
│   │   ├── products/       # Product management
│   │   └── orders/         # Order management
│   ├── api/                # API Routes
│   │   ├── auth/           # Authentication APIs
│   │   ├── products/       # Product APIs
│   │   ├── orders/         # Order APIs
│   │   ├── needs/          # Need Request APIs
│   │   ├── offers/         # Offer APIs
│   │   ├── seller/         # Seller APIs
│   │   ├── wallet/         # Wallet APIs
│   │   ├── chat/           # Chat APIs
│   │   └── admin/          # Admin APIs
│   └── layout.tsx          # Root layout
├── components/             # Reusable components
│   └── chat.tsx            # Live Chat component
├── lib/                    # Utility functions
│   ├── mongodb.ts          # MongoDB connection
│   ├── jwt.ts              # JWT utilities
│   ├── auth.ts             # Authentication helpers
│   ├── socket.ts           # Socket.IO setup
│   └── utils.ts            # General utilities
├── models/                 # MongoDB Schemas
│   ├── User.ts
│   ├── Seller.ts
│   ├── Product.ts
│   ├── SellerProduct.ts
│   ├── Order.ts
│   ├── Need.ts
│   ├── Offer.ts
│   ├── Chat.ts
│   ├── Transaction.ts
│   └── Withdrawal.ts
└── middleware.ts           # Next.js middleware
```

## 🔐 Authentication

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs
6. Update `.env.local` with credentials

### JWT Token

- Tokens are stored in HTTP-only cookies
- Token expiration: 7 days
- Role-based access control implemented

## 💰 Payment Integration

### SSLCommerz

- Integration ready in `/app/api/wallet/deposit/route.ts`
- Add your SSLCommerz credentials in `.env.local`
- Implement payment gateway API calls

### bKash

- Integration ready in `/app/api/wallet/deposit/route.ts`
- Add your bKash credentials in `.env.local`
- Implement bKash API calls

## 🔌 Socket.IO Setup

Socket.IO has been integrated with Next.js API Routes for real-time features:

- Need Request Notifications
- Order Notifications
- Live Chat
- Seller Online/Offline Status

### Quick Start

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Run with Socket.IO server:**

   ```bash
   npm run dev:server
   ```

3. **Check Socket.IO status:**
   ```bash
   curl http://localhost:3000/api/socket/status
   ```

**See `README_SOCKET.md` and `SOCKET_SETUP.md` for detailed documentation.**

## 📊 Database Collections

- `users` - User accounts
- `sellers` - Seller profiles
- `products` - Product catalog
- `seller_products` - Seller-specific product prices
- `orders` - Order records
- `needs` - Need requests
- `offers` - Seller offers for needs
- `chats` - Chat messages
- `transactions` - Wallet transactions
- `withdrawals` - Withdrawal requests

## 🎯 API Endpoints

### Authentication

- `POST /api/auth/google` - Google OAuth login
- `POST /api/auth/register-seller` - Register as seller

### Products

- `GET /api/products` - List all products
- `GET /api/products/[id]` - Get product details
- `POST /api/products` - Create product (Seller/Admin)

### Orders

- `GET /api/orders` - List orders
- `POST /api/orders` - Create order
- `GET /api/orders/[id]` - Get order details
- `PATCH /api/orders/[id]` - Update order status

### Needs & Offers

- `POST /api/needs` - Create need request
- `GET /api/needs` - List need requests
- `POST /api/needs/[id]/offers` - Accept offer
- `POST /api/offers` - Submit offer (Seller)

### Seller

- `GET /api/seller/products` - List seller products
- `POST /api/seller/products` - Add/Update product price
- `PATCH /api/seller/online` - Toggle online status
- `POST /api/seller/withdraw` - Request withdrawal

### Wallet

- `GET /api/wallet/balance` - Get wallet balance
- `POST /api/wallet/deposit` - Deposit request

### Chat

- `GET /api/chat/[orderId]` - Get chat messages
- `POST /api/chat/[orderId]` - Send message

### Admin

- `GET /api/admin/sellers` - List sellers
- `PATCH /api/admin/sellers` - Approve/Block seller
- `GET /api/admin/users` - List users
- `PATCH /api/admin/users` - Block/Unblock user
- `GET /api/admin/products` - List products
- `PATCH /api/admin/products` - Approve/Disable product
- `GET /api/admin/withdrawals` - List withdrawals
- `PATCH /api/admin/withdrawals` - Approve/Reject withdrawal

## 🚧 TODO / Future Enhancements

- [ ] Complete Socket.IO server integration
- [ ] SSLCommerz payment gateway integration
- [ ] bKash payment gateway integration
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Push notifications
- [ ] Advanced analytics dashboard
- [ ] Rating & Review system
- [ ] Dispute management system
- [ ] Commission management UI
- [ ] Product image upload
- [ ] Seller verification system

## 📝 Notes

- All important code sections have Bengali comments
- Error handling is implemented throughout
- Production-ready code structure
- Role-based access control implemented
- Wallet system with transaction history
- Commission calculation (default 5%)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Built with ❤️ for the Bangladeshi digital marketplace ecosystem.
# multivendor-ecommerce-topupoffer
# multivendor-ecommerce-topupoffer
#   m u l t i v e n d o r - e c o m m e r c e - t o p u p o f f e r  
 