/**
 * Database Seed Script
 * Dummy data database-এ add করার জন্য
 */

import connectDB from '../lib/mongodb';
import User from '../models/User';
import Seller from '../models/Seller';
import Product from '../models/Product';
import SellerProduct from '../models/SellerProduct';
import Order from '../models/Order';
import Withdrawal from '../models/Withdrawal';

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // MongoDB Connect
    await connectDB();
    console.log('✅ Connected to MongoDB');

    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Seller.deleteMany({});
    await Product.deleteMany({});
    await SellerProduct.deleteMany({});
    await Order.deleteMany({});
    await Withdrawal.deleteMany({});
    console.log('✅ Existing data cleared');

    // Create Admin User
    console.log('👤 Creating admin user...');
    const adminUser = await User.create({
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'admin',
      wallet: { balance: 0, transactions: [] },
      isBlocked: false,
    });
    console.log('✅ Admin user created');

    // Create Users (Customers)
    console.log('👥 Creating users...');
    const users = await User.insertMany([
      {
        email: 'john.doe@example.com',
        name: 'John Doe',
        role: 'customer',
        wallet: { balance: 5000, transactions: [] },
        isBlocked: false,
      },
      {
        email: 'jane.smith@example.com',
        name: 'Jane Smith',
        role: 'customer',
        wallet: { balance: 2500, transactions: [] },
        isBlocked: false,
      },
      {
        email: 'bob.wilson@example.com',
        name: 'Bob Wilson',
        role: 'customer',
        wallet: { balance: 10000, transactions: [] },
        isBlocked: false,
      },
      {
        email: 'alice.brown@example.com',
        name: 'Alice Brown',
        role: 'customer',
        wallet: { balance: 750, transactions: [] },
        isBlocked: false,
      },
      {
        email: 'blocked.user@example.com',
        name: 'Blocked User',
        role: 'customer',
        wallet: { balance: 0, transactions: [] },
        isBlocked: true,
      },
      {
        email: 'charlie.davis@example.com',
        name: 'Charlie Davis',
        role: 'customer',
        wallet: { balance: 3000, transactions: [] },
        isBlocked: false,
      },
      {
        email: 'diana.miller@example.com',
        name: 'Diana Miller',
        role: 'customer',
        wallet: { balance: 1500, transactions: [] },
        isBlocked: false,
      },
      {
        email: 'edward.garcia@example.com',
        name: 'Edward Garcia',
        role: 'customer',
        wallet: { balance: 8000, transactions: [] },
        isBlocked: false,
      },
    ]);
    console.log(`✅ Created ${users.length} users`);

    // Create Seller Users
    console.log('🏪 Creating seller users...');
    const sellerUsers = await User.insertMany([
      {
        email: 'seller1@techstore.com',
        name: 'John Seller',
        role: 'seller',
        wallet: { balance: 0, transactions: [] },
        isBlocked: false,
      },
      {
        email: 'seller2@digital.com',
        name: 'Jane Merchant',
        role: 'seller',
        wallet: { balance: 0, transactions: [] },
        isBlocked: false,
      },
      {
        email: 'seller3@services.com',
        name: 'Tech Store BD',
        role: 'seller',
        wallet: { balance: 0, transactions: [] },
        isBlocked: false,
      },
      {
        email: 'seller4@mobile.com',
        name: 'Digital Services',
        role: 'seller',
        wallet: { balance: 0, transactions: [] },
        isBlocked: false,
      },
      {
        email: 'seller5@pending.com',
        name: 'Pending Seller',
        role: 'seller',
        wallet: { balance: 0, transactions: [] },
        isBlocked: false,
      },
      {
        email: 'seller6@blocked.com',
        name: 'Blocked Seller',
        role: 'seller',
        wallet: { balance: 0, transactions: [] },
        isBlocked: true,
      },
    ]);
    console.log(`✅ Created ${sellerUsers.length} seller users`);

    // Create Sellers
    console.log('🏬 Creating sellers...');
    const sellers = await Seller.insertMany([
      {
        userId: sellerUsers[0]._id,
        storeName: 'Tech Store BD',
        isApproved: true,
        isOnline: true,
        totalEarnings: 125000,
        availableBalance: 50000,
        pendingWithdrawals: 5000,
        rating: 4.5,
        totalOrders: 145,
        completedOrders: 140,
      },
      {
        userId: sellerUsers[1]._id,
        storeName: 'Digital Services',
        isApproved: true,
        isOnline: true,
        totalEarnings: 89000,
        availableBalance: 35000,
        pendingWithdrawals: 12000,
        rating: 4.2,
        totalOrders: 98,
        completedOrders: 95,
      },
      {
        userId: sellerUsers[2]._id,
        storeName: 'Mobile Data Hub',
        isApproved: true,
        isOnline: false,
        totalEarnings: 156000,
        availableBalance: 75000,
        pendingWithdrawals: 0,
        rating: 4.8,
        totalOrders: 203,
        completedOrders: 200,
      },
      {
        userId: sellerUsers[3]._id,
        storeName: 'Internet Packages Pro',
        isApproved: true,
        isOnline: true,
        totalEarnings: 67000,
        availableBalance: 25000,
        pendingWithdrawals: 8000,
        rating: 4.0,
        totalOrders: 78,
        completedOrders: 75,
      },
      {
        userId: sellerUsers[4]._id,
        storeName: 'Pending Store',
        isApproved: false,
        isOnline: false,
        totalEarnings: 0,
        availableBalance: 0,
        pendingWithdrawals: 0,
        rating: 0,
        totalOrders: 0,
        completedOrders: 0,
      },
      {
        userId: sellerUsers[5]._id,
        storeName: 'Blocked Store',
        isApproved: false,
        isOnline: false,
        totalEarnings: 15000,
        availableBalance: 0,
        pendingWithdrawals: 0,
        rating: 2.1,
        totalOrders: 23,
        completedOrders: 20,
      },
    ]);
    console.log(`✅ Created ${sellers.length} sellers`);

    // Create Products
    console.log('📦 Creating products...');
    const products = await Product.insertMany([
      {
        name: 'GP 1GB Data Package',
        description: 'Grameenphone 1GB data package valid for 7 days',
        category: 'Mobile Data',
        operator: 'GP',
        packageSize: '1GB',
        validity: '7 Days',
        status: 'active',
        createdBy: adminUser._id,
        isApproved: true,
        approvedBy: adminUser._id,
        approvedAt: new Date(),
      },
      {
        name: 'Robi 2GB Data Package',
        description: 'Robi 2GB data package valid for 15 days',
        category: 'Mobile Data',
        operator: 'Robi',
        packageSize: '2GB',
        validity: '15 Days',
        status: 'active',
        createdBy: adminUser._id,
        isApproved: true,
        approvedBy: adminUser._id,
        approvedAt: new Date(),
      },
      {
        name: 'Banglalink 5GB Data',
        description: 'Banglalink 5GB data package valid for 30 days',
        category: 'Mobile Data',
        operator: 'Banglalink',
        packageSize: '5GB',
        validity: '30 Days',
        status: 'active',
        createdBy: adminUser._id,
        isApproved: true,
        approvedBy: adminUser._id,
        approvedAt: new Date(),
      },
      {
        name: 'Airtel 3GB Data Package',
        description: 'Airtel 3GB data package valid for 20 days',
        category: 'Mobile Data',
        operator: 'Airtel',
        packageSize: '3GB',
        validity: '20 Days',
        status: 'active',
        createdBy: adminUser._id,
        isApproved: true,
        approvedBy: adminUser._id,
        approvedAt: new Date(),
      },
      {
        name: 'GP 10GB Data Package',
        description: 'Grameenphone 10GB data package valid for 30 days',
        category: 'Mobile Data',
        operator: 'GP',
        packageSize: '10GB',
        validity: '30 Days',
        status: 'active',
        createdBy: adminUser._id,
        isApproved: true,
        approvedBy: adminUser._id,
        approvedAt: new Date(),
      },
      {
        name: 'Internet Package 100GB',
        description: 'Home internet package 100GB monthly',
        category: 'Internet',
        operator: 'GP',
        packageSize: '100GB',
        validity: '30 Days',
        status: 'inactive',
        createdBy: adminUser._id,
        isApproved: true,
        approvedBy: adminUser._id,
        approvedAt: new Date(),
      },
      {
        name: 'Robi 500MB Data',
        description: 'Robi 500MB data package valid for 3 days',
        category: 'Mobile Data',
        operator: 'Robi',
        packageSize: '500MB',
        validity: '3 Days',
        status: 'pending',
        createdBy: sellerUsers[4]._id,
        isApproved: false,
      },
      {
        name: 'Banglalink 20GB Data',
        description: 'Banglalink 20GB data package valid for 30 days',
        category: 'Mobile Data',
        operator: 'Banglalink',
        packageSize: '20GB',
        validity: '30 Days',
        status: 'pending',
        createdBy: sellerUsers[4]._id,
        isApproved: false,
      },
    ]);
    console.log(`✅ Created ${products.length} products`);

    // Create Seller Products
    console.log('🏷️  Creating seller products...');
    const sellerProducts = [];
    
    // Tech Store BD products
    sellerProducts.push(
      await SellerProduct.create({
        sellerId: sellers[0]._id,
        productId: products[0]._id,
        price: 50,
        stock: 100,
        isActive: true,
      }),
      await SellerProduct.create({
        sellerId: sellers[0]._id,
        productId: products[2]._id,
        price: 200,
        stock: 50,
        isActive: true,
      }),
      await SellerProduct.create({
        sellerId: sellers[0]._id,
        productId: products[4]._id,
        price: 450,
        stock: 30,
        isActive: true,
      })
    );

    // Digital Services products
    sellerProducts.push(
      await SellerProduct.create({
        sellerId: sellers[1]._id,
        productId: products[1]._id,
        price: 80,
        stock: 80,
        isActive: true,
      }),
      await SellerProduct.create({
        sellerId: sellers[1]._id,
        productId: products[3]._id,
        price: 150,
        stock: 60,
        isActive: true,
      })
    );

    // Mobile Data Hub products
    sellerProducts.push(
      await SellerProduct.create({
        sellerId: sellers[2]._id,
        productId: products[0]._id,
        price: 48,
        stock: 200,
        isActive: true,
      }),
      await SellerProduct.create({
        sellerId: sellers[2]._id,
        productId: products[1]._id,
        price: 78,
        stock: 150,
        isActive: true,
      }),
      await SellerProduct.create({
        sellerId: sellers[2]._id,
        productId: products[2]._id,
        price: 195,
        stock: 100,
        isActive: true,
      })
    );

    // Internet Packages Pro products
    sellerProducts.push(
      await SellerProduct.create({
        sellerId: sellers[3]._id,
        productId: products[0]._id,
        price: 52,
        stock: 90,
        isActive: true,
      }),
      await SellerProduct.create({
        sellerId: sellers[3]._id,
        productId: products[5]._id,
        price: 500,
        stock: 20,
        isActive: true,
      })
    );

    console.log(`✅ Created ${sellerProducts.length} seller products`);

    // Create Orders
    console.log('🛒 Creating orders...');
    const orders = await Order.insertMany([
      {
        orderNumber: 'ORD-2024-001',
        customerId: users[0]._id,
        sellerId: sellers[0]._id,
        productId: products[0]._id,
        sellerProductId: sellerProducts[0]._id,
        operator: 'GP',
        mobileNumber: '01712345678',
        quantity: 1,
        unitPrice: 50,
        totalAmount: 50,
        commission: 2.5,
        sellerAmount: 47.5,
        status: 'completed',
        paymentMethod: 'wallet',
        paymentStatus: 'paid',
        paymentTransactionId: 'TXN-001',
        assignedAt: new Date('2024-12-15'),
        completedAt: new Date('2024-12-15'),
      },
      {
        orderNumber: 'ORD-2024-002',
        customerId: users[1]._id,
        sellerId: sellers[1]._id,
        productId: products[1]._id,
        sellerProductId: sellerProducts[3]._id,
        operator: 'Robi',
        mobileNumber: '01812345679',
        quantity: 2,
        unitPrice: 80,
        totalAmount: 160,
        commission: 8,
        sellerAmount: 152,
        status: 'assigned',
        paymentMethod: 'bkash',
        paymentStatus: 'paid',
        paymentTransactionId: 'TXN-002',
        assignedAt: new Date('2024-12-18'),
      },
      {
        orderNumber: 'ORD-2024-003',
        customerId: users[2]._id,
        sellerId: sellers[0]._id,
        productId: products[2]._id,
        sellerProductId: sellerProducts[1]._id,
        operator: 'Banglalink',
        mobileNumber: '01912345680',
        quantity: 1,
        unitPrice: 200,
        totalAmount: 200,
        commission: 10,
        sellerAmount: 190,
        status: 'pending',
        paymentMethod: 'sslcommerz',
        paymentStatus: 'paid',
        paymentTransactionId: 'TXN-003',
      },
      {
        orderNumber: 'ORD-2024-004',
        customerId: users[3]._id,
        sellerId: sellers[1]._id,
        productId: products[0]._id,
        sellerProductId: sellerProducts[0]._id,
        operator: 'GP',
        mobileNumber: '01712345681',
        quantity: 1,
        unitPrice: 50,
        totalAmount: 50,
        commission: 2.5,
        sellerAmount: 47.5,
        status: 'cancelled',
        paymentMethod: 'wallet',
        paymentStatus: 'refunded',
        cancelledAt: new Date('2024-12-17'),
        cancelledBy: 'customer',
        cancellationReason: 'Changed mind',
      },
      {
        orderNumber: 'ORD-2024-005',
        customerId: users[5]._id,
        sellerId: sellers[2]._id,
        productId: products[0]._id,
        sellerProductId: sellerProducts[5]._id,
        operator: 'GP',
        mobileNumber: '01712345682',
        quantity: 1,
        unitPrice: 48,
        totalAmount: 48,
        commission: 2.4,
        sellerAmount: 45.6,
        status: 'completed',
        paymentMethod: 'wallet',
        paymentStatus: 'paid',
        paymentTransactionId: 'TXN-005',
        assignedAt: new Date('2024-12-16'),
        completedAt: new Date('2024-12-16'),
      },
      {
        orderNumber: 'ORD-2024-006',
        customerId: users[6]._id,
        sellerId: sellers[3]._id,
        productId: products[1]._id,
        sellerProductId: sellerProducts[3]._id,
        operator: 'Robi',
        mobileNumber: '01812345683',
        quantity: 1,
        unitPrice: 80,
        totalAmount: 80,
        commission: 4,
        sellerAmount: 76,
        status: 'assigned',
        paymentMethod: 'bkash',
        paymentStatus: 'paid',
        paymentTransactionId: 'TXN-006',
        assignedAt: new Date('2024-12-19'),
      },
    ]);
    console.log(`✅ Created ${orders.length} orders`);

    // Create Withdrawals
    console.log('💰 Creating withdrawals...');
    const withdrawals = await Withdrawal.insertMany([
      {
        withdrawalNumber: 'WD-2024-001',
        sellerId: sellers[0]._id,
        amount: 5000,
        method: 'bkash',
        accountNumber: '01712345678',
        accountName: 'John Seller',
        status: 'pending',
      },
      {
        withdrawalNumber: 'WD-2024-002',
        sellerId: sellers[1]._id,
        amount: 12000,
        method: 'bank',
        accountNumber: 'AC-1234567890',
        accountName: 'Jane Merchant',
        status: 'approved',
        approvedBy: adminUser._id,
        approvedAt: new Date('2024-12-16'),
      },
      {
        withdrawalNumber: 'WD-2024-003',
        sellerId: sellers[2]._id,
        amount: 25000,
        method: 'nagad',
        accountNumber: '01798765432',
        accountName: 'Tech Store BD',
        status: 'completed',
        approvedBy: adminUser._id,
        approvedAt: new Date('2024-12-11'),
      },
      {
        withdrawalNumber: 'WD-2024-004',
        sellerId: sellers[3]._id,
        amount: 8000,
        method: 'rocket',
        accountNumber: '01711111111',
        accountName: 'Internet Packages Pro',
        status: 'rejected',
        rejectionReason: 'Insufficient balance',
      },
      {
        withdrawalNumber: 'WD-2024-005',
        sellerId: sellers[0]._id,
        amount: 15000,
        method: 'bank',
        accountNumber: 'AC-9876543210',
        accountName: 'John Seller',
        status: 'pending',
      },
    ]);
    console.log(`✅ Created ${withdrawals.length} withdrawals`);

    console.log('\n✅ Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Users: ${users.length + sellerUsers.length + 1} (${users.length} customers, ${sellerUsers.length} sellers, 1 admin)`);
    console.log(`   - Sellers: ${sellers.length}`);
    console.log(`   - Products: ${products.length}`);
    console.log(`   - Seller Products: ${sellerProducts.length}`);
    console.log(`   - Orders: ${orders.length}`);
    console.log(`   - Withdrawals: ${withdrawals.length}`);
    console.log('\n🎉 You can now test the admin dashboard UI!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();

