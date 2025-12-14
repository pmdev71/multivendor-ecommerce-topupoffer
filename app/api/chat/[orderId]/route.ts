import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Chat from '@/models/Chat';
import Order from '@/models/Order';
import Seller from '@/models/Seller';
import { requireRole } from '@/lib/auth';

/**
 * GET: Order-এর Chat Messages Fetch করা
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { user, error } = await requireRole(['customer', 'seller'])(request);
    if (error || !user) {
      return NextResponse.json({ error: error || 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { orderId } = await params;
    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Authorization Check
    if (user.role === 'customer' && order.customerId.toString() !== user.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (user.role === 'seller') {
      const seller = await Seller.findOne({ userId: user.userId });
      if (!seller || order.sellerId.toString() !== seller._id.toString()) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    // Chat Fetch করা বা Create করা
    let chat = await Chat.findOne({ orderId });
    if (!chat) {
      chat = await Chat.create({
        orderId,
        customerId: order.customerId,
        sellerId: order.sellerId,
        messages: [],
      });
    }

    return NextResponse.json({
      success: true,
      chat,
    });
  } catch (error: any) {
    console.error('Chat Fetch Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch chat' },
      { status: 500 }
    );
  }
}

/**
 * POST: Chat Message Send করা
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { user, error } = await requireRole(['customer', 'seller'])(request);
    if (error || !user) {
      return NextResponse.json({ error: error || 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { orderId } = await params;
    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Order Assigned হওয়ার পরেই Chat Enable হবে
    if (order.status === 'pending') {
      return NextResponse.json(
        { error: 'Chat is only available after order is assigned' },
        { status: 400 }
      );
    }

    // Authorization Check
    if (user.role === 'customer' && order.customerId.toString() !== user.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (user.role === 'seller') {
      const seller = await Seller.findOne({ userId: user.userId });
      if (!seller || order.sellerId.toString() !== seller._id.toString()) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    const body = await request.json();
    const { message } = body;

    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Chat Fetch করা বা Create করা
    let chat = await Chat.findOne({ orderId });
    if (!chat) {
      chat = await Chat.create({
        orderId,
        customerId: order.customerId,
        sellerId: order.sellerId,
        messages: [],
      });
    }

    // Message Add করা
    const newMessage = {
      orderId,
      senderId: user.userId,
      senderRole: user.role,
      message: message.trim(),
      isRead: false,
      createdAt: new Date(),
    };

    chat.messages.push(newMessage as any);
    chat.lastMessageAt = new Date();
    await chat.save();

    // Socket.IO Event Emit করা হবে
    // chat:message event emit হবে

    return NextResponse.json({
      success: true,
      message: newMessage,
      chat,
    });
  } catch (error: any) {
    console.error('Chat Message Send Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send message' },
      { status: 500 }
    );
  }
}

