'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Chat from '@/components/chat';
import {
  ArrowLeft,
  MessageSquare,
  Store,
} from 'lucide-react';

export default function OrderChatPage() {
  const params = useParams();
  const router = useRouter();
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    // Get user ID from token or API
    const token = localStorage.getItem('token');
    if (token) {
      // Decode token to get userId
      // For now, using a placeholder
      setUserId('customer-id');
    }
  }, []);

  if (!params.id) {
    return (
      <div className="w-full bg-gray-50 dark:bg-gray-950 p-4 lg:p-8">
        <div className="mx-auto max-w-4xl text-center py-12">
          <MessageSquare className="h-12 w-12 mx-auto mb-3 text-gray-400 opacity-50" />
          <p className="text-gray-500 dark:text-gray-400 mb-4">Order ID not found</p>
          <Link
            href="/customer/orders"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50 dark:bg-gray-950 p-4 lg:p-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <Link
            href={`/customer/orders/${params.id}`}
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Order Details</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30">
              <MessageSquare className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Chat with Seller
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Order #{params.id}
              </p>
            </div>
          </div>
        </div>

        {/* Chat Component */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden"
        >
          <Chat orderId={params.id as string} userRole="customer" userId={userId} />
        </motion.div>
      </div>
    </div>
  );
}
