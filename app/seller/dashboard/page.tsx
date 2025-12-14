'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { formatPrice } from '@/lib/utils';
import {
  DollarSign,
  Wallet,
  ShoppingCart,
  TrendingUp,
  Power,
  Package,
  MessageSquare,
  ArrowRight,
  CheckCircle,
  Clock,
  XCircle,
  Store,
  Edit,
} from 'lucide-react';

export default function SellerDashboardPage() {
  const [stats, setStats] = useState({
    totalEarnings: 0,
    availableBalance: 0,
    pendingWithdrawals: 0,
    totalOrders: 0,
    completedOrders: 0,
    pendingOrders: 0,
    isOnline: false,
    storeName: '',
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [storeName, setStoreName] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch seller store info
      const storeRes = await fetch('/api/seller/store');
      const storeData = await storeRes.json();

      // Fetch seller stats from orders API
      const ordersRes = await fetch('/api/orders');
      const ordersData = await ordersRes.json();

      if (ordersData.success) {
        const orders = ordersData.orders || [];
        const storeInfo = storeData.success ? storeData.seller : null;
        
        // Check if store exists and is approved
        if (!storeData.success || !storeInfo) {
          // No store found, redirect to create store
          window.location.href = '/seller/create-store';
          return;
        }
        
        if (!storeInfo.storeName) {
          // Store name not set, redirect to create store
          window.location.href = '/seller/create-store';
          return;
        }
        
        if (!storeInfo.isApproved) {
          // Store not approved, redirect to waiting page
          window.location.href = '/seller/waiting-approval';
          return;
        }
        
        setStats({
          totalEarnings: storeInfo?.totalEarnings || 0,
          availableBalance: storeInfo?.availableBalance || 0,
          pendingWithdrawals: 0, // TODO: Fetch from seller API
          totalOrders: orders.length,
          completedOrders: orders.filter((o: any) => o.status === 'completed').length,
          pendingOrders: orders.filter((o: any) => o.status === 'pending').length,
          isOnline: storeInfo?.isOnline || false,
          storeName: storeInfo?.storeName || '',
        });
        setRecentOrders(orders.slice(0, 5));
      }
    } catch (error) {
      console.error('Dashboard fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSetStoreName = async () => {
    if (!storeName.trim() || storeName.trim().length < 3) {
      alert('Store name must be at least 3 characters');
      return;
    }

    try {
      const res = await fetch('/api/seller/store', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storeName: storeName.trim() }),
      });

      const data = await res.json();
      if (data.success) {
        setStats({ ...stats, storeName: data.seller.storeName });
        setShowStoreModal(false);
        setStoreName('');
        alert('Store name set successfully!');
      } else {
        alert(data.error || 'Failed to set store name');
      }
    } catch (error) {
      console.error('Store name update error:', error);
      alert('Failed to set store name');
    }
  };

  const toggleOnlineStatus = async () => {
    try {
      const res = await fetch('/api/seller/online', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isOnline: !stats.isOnline }),
      });

      const data = await res.json();
      if (data.success) {
        setStats({ ...stats, isOnline: data.seller.isOnline });
      }
    } catch (error) {
      console.error('Online status update error:', error);
    }
  };

  const quickActions = [
    {
      title: 'Manage Products',
      description: 'Add or update products',
      href: '/seller/products',
      icon: Package,
      color: 'blue',
    },
    {
      title: 'View Orders',
      description: 'Manage incoming orders',
      href: '/seller/orders',
      icon: ShoppingCart,
      color: 'green',
    },
    {
      title: 'Need Requests',
      description: 'Respond to requests',
      href: '/seller/needs',
      icon: MessageSquare,
      color: 'purple',
    },
    {
      title: 'Earnings',
      description: 'View earnings & withdraw',
      href: '/seller/earnings',
      icon: DollarSign,
      color: 'yellow',
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'assigned':
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
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
          <div className="h-12 w-12 rounded-full border-4 border-green-500 border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50 dark:bg-gray-950 p-4 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header with Online Toggle */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome Back, {stats.storeName}!
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your store and track your performance
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleOnlineStatus}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
              stats.isOnline
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-gray-600'
            }`}
          >
            <Power className={`h-5 w-5 ${stats.isOnline ? 'animate-pulse' : ''}`} />
            {stats.isOnline ? 'Online' : 'Offline'}
          </motion.button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.02, y: -4 }}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30">
                <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Total Earnings
            </h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {formatPrice(stats.totalEarnings)}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            whileHover={{ scale: 1.02, y: -4 }}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <Wallet className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Available Balance
            </h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {formatPrice(stats.availableBalance)}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            whileHover={{ scale: 1.02, y: -4 }}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
                <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Pending Orders
            </h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {stats.pendingOrders}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            whileHover={{ scale: 1.02, y: -4 }}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <CheckCircle className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Completed Orders
            </h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {stats.completedOrders}
            </p>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                >
                  <Link
                    href={action.href}
                    className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 block shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-lg bg-${action.color}-100 dark:bg-${action.color}-900/30`}>
                        <Icon className={`h-6 w-6 text-${action.color}-600 dark:text-${action.color}-400`} />
                      </div>
                      <ArrowRight className="h-5 w-5 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {action.description}
                    </p>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Recent Orders
            </h2>
            <Link
              href="/seller/orders"
              className="text-sm text-green-600 dark:text-green-400 hover:underline flex items-center gap-1"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <ShoppingCart className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No orders yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order, index) => (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {getStatusIcon(order.status)}
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {order.orderNumber}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {order.productId?.name || 'Product'} • {order.operator} - {order.mobileNumber}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {formatPrice(order.totalAmount)}
                    </p>
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs mt-1 ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Store Name Modal */}
      {showStoreModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-md"
          >
            <div className="flex items-center gap-3 mb-4">
              <Store className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {stats.storeName ? 'Update Store Name' : 'Set Your Store Name'}
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {stats.storeName
                ? 'Update your store name that customers will see.'
                : 'Please set your store name to continue. This will be visible to all customers.'}
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Store Name *
              </label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="Enter your store name (min 3 characters)"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSetStoreName}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
              >
                <Store className="h-4 w-4" />
                {stats.storeName ? 'Update' : 'Set Store Name'}
              </button>
              {stats.storeName && (
                <button
                  onClick={() => {
                    setShowStoreModal(false);
                    setStoreName('');
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Cancel
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
