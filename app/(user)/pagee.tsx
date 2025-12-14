"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/card";
import { Chart } from "@/components/chart";
import { Table } from "@/components/table";
import {
  TrendingUp,
  Users,
  ShoppingCart,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  CreditCard,
  BarChart3,
} from "lucide-react";
import { motion } from "framer-motion";

// Sample data
const revenueChartData = [
  { name: "Jan", value: 4000 },
  { name: "Feb", value: 3000 },
  { name: "Mar", value: 5000 },
  { name: "Apr", value: 4500 },
  { name: "May", value: 6000 },
  { name: "Jun", value: 5500 },
];

const salesChartData = [
  { name: "Mon", value: 120 },
  { name: "Tue", value: 190 },
  { name: "Wed", value: 300 },
  { name: "Thu", value: 280 },
  { name: "Fri", value: 189 },
  { name: "Sat", value: 239 },
  { name: "Sun", value: 349 },
];

interface RecentOrder {
  id: string;
  customer: string;
  product: string;
  amount: number;
  status: string;
  date: string;
}

const recentOrders: RecentOrder[] = [
  {
    id: "1",
    customer: "John Doe",
    product: "Premium Plan",
    amount: 299,
    status: "Completed",
    date: "2024-01-15",
  },
  {
    id: "2",
    customer: "Jane Smith",
    product: "Basic Plan",
    amount: 99,
    status: "Pending",
    date: "2024-01-14",
  },
  {
    id: "3",
    customer: "Bob Johnson",
    product: "Pro Plan",
    amount: 499,
    status: "Completed",
    date: "2024-01-13",
  },
  {
    id: "4",
    customer: "Alice Brown",
    product: "Premium Plan",
    amount: 299,
    status: "Failed",
    date: "2024-01-12",
  },
  {
    id: "5",
    customer: "Charlie Wilson",
    product: "Basic Plan",
    amount: 99,
    status: "Completed",
    date: "2024-01-11",
  },
];

const orderColumns = [
  { key: "customer" as const, header: "Customer" },
  { key: "product" as const, header: "Product" },
  {
    key: "amount" as const,
    header: "Amount",
    render: (value: string | number) => `$${Number(value).toFixed(2)}`,
  },
  {
    key: "status" as const,
    header: "Status",
    render: (value: string | number) => {
      const status = String(value);
      const statusColors: Record<string, string> = {
        Completed:
          "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
        Pending:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
        Failed: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
      };
      return (
        <span
          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
            statusColors[status] || "bg-gray-100 text-gray-800"
          }`}
        >
          {status}
        </span>
      );
    },
  },
  { key: "date" as const, header: "Date" },
];

const stats = [
  {
    title: "Total Revenue",
    value: "$45,231",
    change: "+20.1%",
    trend: "up",
    icon: DollarSign,
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-900/20",
  },
  {
    title: "Active Users",
    value: "12,345",
    change: "+12.5%",
    trend: "up",
    icon: Users,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
  },
  {
    title: "Total Orders",
    value: "1,234",
    change: "-2.4%",
    trend: "down",
    icon: ShoppingCart,
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
  },
  {
    title: "Conversion Rate",
    value: "3.2%",
    change: "+0.5%",
    trend: "up",
    icon: TrendingUp,
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
  },
];

export default function DashboardPage() {
  return (
    <>
      {/* Page Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
          Welcome back! Here&apos;s what&apos;s happening with your business
          today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="mb-4 sm:mb-6 grid gap-2.5 sm:gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">
                        {stat.title}
                      </p>
                      <p className="mt-1 sm:mt-2 text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                        {stat.value}
                      </p>
                      <div className="mt-1 sm:mt-2 flex items-center gap-1 text-xs flex-wrap">
                        {stat.trend === "up" ? (
                          <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3 sm:h-4 sm:w-4 text-red-500 flex-shrink-0" />
                        )}
                        <span
                          className={
                            stat.trend === "up"
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
                          }
                        >
                          {stat.change}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400 hidden sm:inline">
                          from last month
                        </span>
                        <span className="text-gray-500 dark:text-gray-400 sm:hidden">
                          vs last month
                        </span>
                      </div>
                    </div>
                    <div
                      className={`rounded-lg p-2 sm:p-3 ${stat.bgColor} flex-shrink-0`}
                    >
                      <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="mb-4 sm:mb-6 grid gap-3 sm:gap-4 grid-cols-1 lg:grid-cols-2">
        <Card className="overflow-hidden">
          <CardHeader className="p-4 sm:p-6 pb-3 sm:pb-4">
            <CardTitle className="text-base sm:text-lg md:text-xl truncate">
              Revenue Overview
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm truncate">
              Monthly revenue trends
            </CardDescription>
          </CardHeader>
          <CardContent className="p-2 sm:p-4 md:p-6 pt-0 sm:pt-0">
            <div className="w-full overflow-x-auto">
              <Chart type="area" data={revenueChartData} dataKey="value" />
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="p-4 sm:p-6 pb-3 sm:pb-4">
            <CardTitle className="text-base sm:text-lg md:text-xl truncate">
              Sales Activity
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm truncate">
              Weekly sales performance
            </CardDescription>
          </CardHeader>
          <CardContent className="p-2 sm:p-4 md:p-6 pt-0 sm:pt-0">
            <div className="w-full overflow-x-auto">
              <Chart type="bar" data={salesChartData} dataKey="value" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card className="mb-4 sm:mb-6 overflow-hidden">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-base sm:text-lg md:text-xl">
            Recent Orders
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Latest customer orders and transactions
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          <div className="overflow-x-auto -mx-3 sm:mx-0">
            <div className="px-3 sm:px-0">
              <Table data={recentOrders} columns={orderColumns} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="mt-4 sm:mt-6 grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 sm:gap-3 rounded-lg border border-gray-200 bg-white p-3 sm:p-4 text-left transition-colors hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800"
        >
          <div className="rounded-lg bg-blue-50 p-2 dark:bg-blue-900/20 flex-shrink-0">
            <Package className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="min-w-0">
            <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
              Add Product
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Create new item
            </p>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 sm:gap-3 rounded-lg border border-gray-200 bg-white p-3 sm:p-4 text-left transition-colors hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800"
        >
          <div className="rounded-lg bg-green-50 p-2 dark:bg-green-900/20 flex-shrink-0">
            <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400" />
          </div>
          <div className="min-w-0">
            <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
              Process Payment
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Handle transaction
            </p>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 sm:gap-3 rounded-lg border border-gray-200 bg-white p-3 sm:p-4 text-left transition-colors hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800"
        >
          <div className="rounded-lg bg-purple-50 p-2 dark:bg-purple-900/20 flex-shrink-0">
            <Users className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="min-w-0">
            <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
              Invite User
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Add team member
            </p>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 sm:gap-3 rounded-lg border border-gray-200 bg-white p-3 sm:p-4 text-left transition-colors hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800"
        >
          <div className="rounded-lg bg-orange-50 p-2 dark:bg-orange-900/20 flex-shrink-0">
            <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 dark:text-orange-400" />
          </div>
          <div className="min-w-0">
            <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
              View Reports
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Analytics & insights
            </p>
          </div>
        </motion.button>
      </div>
    </>
  );
}
