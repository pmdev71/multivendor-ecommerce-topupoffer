'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { formatPrice } from '@/lib/utils';
import {
  Users,
  Store,
  ShoppingCart,
  DollarSign,
  AlertCircle,
  Package,
  Wallet,
  TrendingUp,
  ArrowRight,
  Activity,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSellers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingSellers: 0,
    pendingProducts: 0,
    pendingWithdrawals: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setError(null);
      const response = await fetch('/api/admin/stats');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.stats) {
        setStats({
          totalUsers: data.stats.totalUsers || 0,
          totalSellers: data.stats.totalSellers || 0,
          totalOrders: data.stats.totalOrders || 0,
          totalRevenue: data.stats.totalRevenue || 0,
          pendingSellers: data.stats.pendingSellers || 0,
          pendingProducts: data.stats.pendingProducts || 0,
          pendingWithdrawals: data.stats.pendingWithdrawals || 0,
        });
      } else {
        throw new Error(data.error || 'Failed to fetch stats');
      }
    } catch (error: any) {
      console.error('Stats fetch error:', error);
      setError(error.message || 'Failed to load dashboard data');
      // Set default values on error
      setStats({
        totalUsers: 0,
        totalSellers: 0,
        totalOrders: 0,
        totalRevenue: 0,
        pendingSellers: 0,
        pendingProducts: 0,
        pendingWithdrawals: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'blue',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      iconColor: 'text-blue-600 dark:text-blue-400',
      borderColor: 'border-blue-200 dark:border-blue-800',
    },
    {
      title: 'Total Sellers',
      value: stats.totalSellers,
      icon: Store,
      color: 'green',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      iconColor: 'text-green-600 dark:text-green-400',
      borderColor: 'border-green-200 dark:border-green-800',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'purple',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      iconColor: 'text-purple-600 dark:text-purple-400',
      borderColor: 'border-purple-200 dark:border-purple-800',
    },
    {
      title: 'Total Revenue',
      value: formatPrice(stats.totalRevenue),
      icon: DollarSign,
      color: 'yellow',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      iconColor: 'text-yellow-600 dark:text-yellow-400',
      borderColor: 'border-yellow-200 dark:border-yellow-800',
    },
  ];

  const pendingActions = [
    {
      title: 'Pending Sellers',
      value: stats.pendingSellers,
      href: '/admin/sellers?isApproved=false',
      icon: AlertCircle,
      color: 'yellow',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      textColor: 'text-yellow-600 dark:text-yellow-400',
      borderColor: 'border-yellow-300 dark:border-yellow-700',
    },
    {
      title: 'Pending Products',
      value: stats.pendingProducts,
      href: '/admin/products?isApproved=false',
      icon: Package,
      color: 'blue',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-600 dark:text-blue-400',
      borderColor: 'border-blue-300 dark:border-blue-700',
    },
    {
      title: 'Pending Withdrawals',
      value: stats.pendingWithdrawals,
      href: '/admin/withdrawals?status=pending',
      icon: Wallet,
      color: 'green',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      textColor: 'text-green-600 dark:text-green-400',
      borderColor: 'border-green-300 dark:border-green-700',
    },
  ];

  const quickActions = [
    {
      title: 'Manage Users',
      description: 'View and manage all users',
      href: '/admin/users',
      icon: Users,
    },
    {
      title: 'Manage Sellers',
      description: 'Approve and manage sellers',
      href: '/admin/sellers',
      icon: Store,
    },
    {
      title: 'Manage Products',
      description: 'Approve and manage products',
      href: '/admin/products',
      icon: Package,
    },
    {
      title: 'View Orders',
      description: 'Monitor all orders',
      href: '/admin/orders',
      icon: ShoppingCart,
    },
  ];

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center" style={{ minHeight: '400px' }}>
        <div className="text-center">
          <div className="h-12 w-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center p-8" style={{ minHeight: '400px' }}>
        <div className="text-center max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={fetchStats}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50 dark:bg-gray-950 p-4 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back! Here's what's happening with your platform today.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.02, y: -4 }}
                className={`${card.bgColor} ${card.borderColor} border rounded-xl p-6 shadow-sm`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${card.bgColor}`}>
                    <Icon className={`h-6 w-6 ${card.iconColor}`} />
                  </div>
                  <TrendingUp className={`h-5 w-5 ${card.iconColor} opacity-50`} />
                </div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  {card.title}
                </h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {card.value}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Pending Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {pendingActions.map((action) => {
            const Icon = action.icon;
            return (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.02, y: -4 }}
              >
                <Link
                  href={action.href}
                  className={`${action.bgColor} ${action.borderColor} border-2 rounded-xl p-6 block shadow-sm hover:shadow-md transition-all`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <Icon className={`h-8 w-8 ${action.textColor}`} />
                    <ArrowRight className={`h-5 w-5 ${action.textColor} opacity-50`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {action.title}
                  </h3>
                  <p className={`text-3xl font-bold ${action.textColor} mb-2`}>
                    {action.value}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Need attention
                  </p>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                >
                  <Link
                    href={action.href}
                    className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 block shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800">
                        <Icon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
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

        {/* Recent Activity Section */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Recent Activity
            </h2>
          </div>
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No recent activity</p>
          </div>
        </div>
      </div>
    </div>
  );
}
