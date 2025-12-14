'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { formatPrice } from '@/lib/utils';
import {
  ArrowLeft,
  Package,
  Store,
  Phone,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  MessageSquare,
  ShoppingCart,
} from 'lucide-react';

interface Order {
  _id: string;
  orderNumber: string;
  productId: {
    name: string;
    description?: string;
  };
  sellerId: {
    storeName: string;
  };
  operator: string;
  mobileNumber: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  createdAt: string;
  completedAt?: string;
}

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchOrder();
    }
  }, [params.id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/orders/${params.id}`);
      const data = await res.json();
      if (data.success) {
        setOrder(data.order);
      }
    } catch (error) {
      console.error('Order fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-6 w-6 text-red-500" />;
      case 'assigned':
        return <MessageSquare className="h-6 w-6 text-blue-500" />;
      default:
        return <Clock className="h-6 w-6 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'assigned':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center" style={{ minHeight: '400px' }}>
        <div className="text-center">
          <div className="h-12 w-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="w-full bg-gray-50 dark:bg-gray-950 p-4 lg:p-8">
        <div className="mx-auto max-w-4xl text-center py-12">
          <Package className="h-12 w-12 mx-auto mb-3 text-gray-400 opacity-50" />
          <p className="text-gray-500 dark:text-gray-400 mb-4">Order not found</p>
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
        {/* Back Button */}
        <Link
          href="/customer/orders"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Orders</span>
        </Link>

        {/* Order Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm mb-6"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {order.orderNumber}
              </h1>
              <div className="flex items-center gap-3">
                {getStatusIcon(order.status)}
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                    order.status
                  )}`}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Amount</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {formatPrice(order.totalAmount)}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Order Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Package className="h-5 w-5" />
              Product Information
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Product Name</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {order.productId?.name || 'N/A'}
                </p>
              </div>
              {order.productId?.description && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Description</p>
                  <p className="text-gray-900 dark:text-white">{order.productId.description}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Quantity</p>
                <p className="font-medium text-gray-900 dark:text-white">{order.quantity}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Unit Price</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {formatPrice(order.unitPrice)}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Seller & Delivery Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Store className="h-5 w-5" />
              Seller & Delivery
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Seller</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {order.sellerId?.storeName || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Operator</p>
                <p className="font-medium text-gray-900 dark:text-white">{order.operator}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Mobile Number</p>
                <p className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {order.mobileNumber}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Payment Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm mb-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Payment Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Payment Method</p>
              <p className="font-medium text-gray-900 dark:text-white capitalize">
                {order.paymentMethod}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Payment Status</p>
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                  order.paymentStatus === 'paid'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                }`}
              >
                {order.paymentStatus}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Order Date</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        {order.status === 'assigned' && (
          <div className="flex gap-4">
            <Link
              href={`/customer/orders/${order._id}/chat`}
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 font-semibold"
            >
              <MessageSquare className="h-5 w-5" />
              Chat with Seller
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

