/**
 * Script to convert a user to seller
 * Usage: npx tsx scripts/make-seller.ts topupofferbd@gmail.com
 */

import mongoose from 'mongoose';
import connectDB from '../lib/mongodb';
import User from '../models/User';
import Seller from '../models/Seller';

async function makeSeller(email: string) {
  try {
    await connectDB();
    console.log('✅ Database connected');

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.error(`❌ User not found with email: ${email}`);
      process.exit(1);
    }

    console.log(`📧 Found user: ${user.name} (${user.email})`);
    console.log(`👤 Current role: ${user.role}`);

    // Update user role to seller
    user.role = 'seller';
    await user.save();
    console.log('✅ User role updated to seller');

    // Check if seller profile already exists
    let seller = await Seller.findOne({ userId: user._id });
    
    if (!seller) {
      // Create seller profile
      seller = await Seller.create({
        userId: user._id,
        storeName: `${user.name}'s Store`,
        isApproved: true,
        isOnline: false,
        availableBalance: 0,
        totalEarnings: 0,
        completedOrders: 0,
        totalOrders: 0,
        rating: 0,
        approvedBy: user._id, // Self-approved for testing
        approvedAt: new Date(),
      });
      console.log('✅ Seller profile created');
    } else {
      // Update existing seller profile
      seller.isApproved = true;
      await seller.save();
      console.log('✅ Seller profile updated');
    }

    console.log('\n🎉 Success! User converted to seller:');
    console.log(`   User ID: ${user._id}`);
    console.log(`   Seller ID: ${seller._id}`);
    console.log(`   Store Name: ${seller.storeName}`);
    console.log(`   Approved: ${seller.isApproved}`);
    console.log(`\n📝 Login with: ${email}`);

    process.exit(0);
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Get email from command line argument
const email = process.argv[2];
if (!email) {
  console.error('❌ Please provide an email address');
  console.log('Usage: npx tsx scripts/make-seller.ts <email>');
  process.exit(1);
}

makeSeller(email);

