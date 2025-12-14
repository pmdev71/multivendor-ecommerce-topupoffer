'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  ShoppingCart,
  DollarSign,
  Store,
  Package,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export default function AdminAnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: { value: 0, change: 0, trend: 'up' as 'up' | 'down' },
    totalOrders: { value: 0, change: 0, trend: 'up' as 'up' | 'down' },
    totalUsers: { value: 0, change: 0, trend: 'up' as 'up' | 'down' },
    totalSellers: { value: 0, change: 0, trend: 'up' as 'up' | 'down' },
    avgOrderValue: { value: 0, change: 0, trend: 'up' as 'up' | 'down' },
    conversionRate: { value: 0, change: 0, trend: 'up' as 'up' | 'down' },
  });

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/stats');
      const data = await response.json();
      
      if (data.success && data.stats) {
        // Calculate average order value
        const avgOrderValue = data.stats.totalOrders > 0 
          ? data.stats.totalRevenue / data.stats.totalOrders 
          : 0;
        
        setStats({
          totalRevenue: { value: data.stats.totalRevenue || 0, change: 12.5, trend: 'up' },
          totalOrders: { value: data.stats.totalOrders || 0, change: 8.3, trend: 'up' },
          totalUsers: { value: data.stats.totalUsers || 0, change: -2.1, trend: 'down' },
          totalSellers: { value: data.stats.totalSellers || 0, change: 15.2, trend: 'up' },
          avgOrderValue: { value: avgOrderValue, change: 5.7, trend: 'up' },
          conversionRate: { value: 3.2, change: 0.8, trend: 'up' },
        });
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const chartData = [
    { month: 'Jan', revenue: 80000, orders: 250 },
    { month: 'Feb', revenue: 95000, orders: 280 },
    { month: 'Mar', revenue: 110000, orders: 320 },
    { month: 'Apr', revenue: 105000, orders: 310 },
    { month: 'May', revenue: 120000, orders: 350 },
    { month: 'Jun', revenue: 125000, orders: 370 },
  ];

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center" style={{ minHeight: '400px' }}>
        <div className="text-center">
          <div className="h-12 w-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50 dark:bg-gray-950 p-4 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
            </div>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="1y">Last Year</option>
            </select>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Platform performance metrics and insights
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.02, y: -4 }}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <DollarSign className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              {stats.totalRevenue.trend === 'up' ? (
                <TrendingUp className="h-5 w-5 text-green-500" />
              ) : (
                <TrendingDown className="h-5 w-5 text-red-500" />
              )}
            </div>
            <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Revenue</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {formatPrice(stats.totalRevenue.value)}
            </p>
            <div className="flex items-center gap-1 text-sm">
              {stats.totalRevenue.trend === 'up' ? (
                <ArrowUp className="h-4 w-4 text-green-500" />
              ) : (
                <ArrowDown className="h-4 w-4 text-red-500" />
              )}
              <span
                className={stats.totalRevenue.trend === 'up' ? 'text-green-500' : 'text-red-500'}
              >
                {Math.abs(stats.totalRevenue.change)}%
              </span>
              <span className="text-gray-500 dark:text-gray-400">vs last period</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            whileHover={{ scale: 1.02, y: -4 }}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <ShoppingCart className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              {stats.totalOrders.trend === 'up' ? (
                <TrendingUp className="h-5 w-5 text-green-500" />
              ) : (
                <TrendingDown className="h-5 w-5 text-red-500" />
              )}
            </div>
            <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Orders</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {stats.totalOrders.value.toLocaleString()}
            </p>
            <div className="flex items-center gap-1 text-sm">
              {stats.totalOrders.trend === 'up' ? (
                <ArrowUp className="h-4 w-4 text-green-500" />
              ) : (
                <ArrowDown className="h-4 w-4 text-red-500" />
              )}
              <span
                className={stats.totalOrders.trend === 'up' ? 'text-green-500' : 'text-red-500'}
              >
                {Math.abs(stats.totalOrders.change)}%
              </span>
              <span className="text-gray-500 dark:text-gray-400">vs last period</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            whileHover={{ scale: 1.02, y: -4 }}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30">
                <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              {stats.totalUsers.trend === 'up' ? (
                <TrendingUp className="h-5 w-5 text-green-500" />
              ) : (
                <TrendingDown className="h-5 w-5 text-red-500" />
              )}
            </div>
            <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Users</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {stats.totalUsers.value.toLocaleString()}
            </p>
            <div className="flex items-center gap-1 text-sm">
              {stats.totalUsers.trend === 'up' ? (
                <ArrowUp className="h-4 w-4 text-green-500" />
              ) : (
                <ArrowDown className="h-4 w-4 text-red-500" />
              )}
              <span
                className={stats.totalUsers.trend === 'up' ? 'text-green-500' : 'text-red-500'}
              >
                {Math.abs(stats.totalUsers.change)}%
              </span>
              <span className="text-gray-500 dark:text-gray-400">vs last period</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            whileHover={{ scale: 1.02, y: -4 }}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <Store className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              {stats.totalSellers.trend === 'up' ? (
                <TrendingUp className="h-5 w-5 text-green-500" />
              ) : (
                <TrendingDown className="h-5 w-5 text-red-500" />
              )}
            </div>
            <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Sellers</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {stats.totalSellers.value}
            </p>
            <div className="flex items-center gap-1 text-sm">
              {stats.totalSellers.trend === 'up' ? (
                <ArrowUp className="h-4 w-4 text-green-500" />
              ) : (
                <ArrowDown className="h-4 w-4 text-red-500" />
              )}
              <span
                className={stats.totalSellers.trend === 'up' ? 'text-green-500' : 'text-red-500'}
              >
                {Math.abs(stats.totalSellers.change)}%
              </span>
              <span className="text-gray-500 dark:text-gray-400">vs last period</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            whileHover={{ scale: 1.02, y: -4 }}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
                <DollarSign className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              {stats.avgOrderValue.trend === 'up' ? (
                <TrendingUp className="h-5 w-5 text-green-500" />
              ) : (
                <TrendingDown className="h-5 w-5 text-red-500" />
              )}
            </div>
            <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-1">Avg Order Value</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {formatPrice(stats.avgOrderValue.value)}
            </p>
            <div className="flex items-center gap-1 text-sm">
              {stats.avgOrderValue.trend === 'up' ? (
                <ArrowUp className="h-4 w-4 text-green-500" />
              ) : (
                <ArrowDown className="h-4 w-4 text-red-500" />
              )}
              <span
                className={stats.avgOrderValue.trend === 'up' ? 'text-green-500' : 'text-red-500'}
              >
                {Math.abs(stats.avgOrderValue.change)}%
              </span>
              <span className="text-gray-500 dark:text-gray-400">vs last period</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            whileHover={{ scale: 1.02, y: -4 }}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                <TrendingUp className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              {stats.conversionRate.trend === 'up' ? (
                <TrendingUp className="h-5 w-5 text-green-500" />
              ) : (
                <TrendingDown className="h-5 w-5 text-red-500" />
              )}
            </div>
            <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-1">Conversion Rate</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {stats.conversionRate.value}%
            </p>
            <div className="flex items-center gap-1 text-sm">
              {stats.conversionRate.trend === 'up' ? (
                <ArrowUp className="h-4 w-4 text-green-500" />
              ) : (
                <ArrowDown className="h-4 w-4 text-red-500" />
              )}
              <span
                className={stats.conversionRate.trend === 'up' ? 'text-green-500' : 'text-red-500'}
              >
                {Math.abs(stats.conversionRate.change)}%
              </span>
              <span className="text-gray-500 dark:text-gray-400">vs last period</span>
            </div>
          </motion.div>
        </div>

        {/* Chart Section */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Revenue & Orders Trend
          </h2>
          <div className="h-64 flex items-end justify-between gap-2">
            {chartData.map((data, index) => {
              const maxRevenue = Math.max(...chartData.map((d) => d.revenue));
              const maxOrders = Math.max(...chartData.map((d) => d.orders));
              const revenueHeight = (data.revenue / maxRevenue) * 100;
              const ordersHeight = (data.orders / maxOrders) * 100;

              return (
                <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex gap-1 justify-center h-full items-end">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${revenueHeight}%` }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      className="w-full bg-blue-500 rounded-t"
                    />
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${ordersHeight}%` }}
                      transition={{ delay: index * 0.1 + 0.1, duration: 0.5 }}
                      className="w-full bg-purple-500 rounded-t"
                    />
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">{data.month}</span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Revenue</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-500 rounded" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Orders</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
