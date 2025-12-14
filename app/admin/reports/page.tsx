'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Download,
  FileSpreadsheet,
  File,
  FileJson,
  TrendingUp,
  DollarSign,
  ShoppingCart,
} from 'lucide-react';

export default function AdminReportsPage() {
  const [reportType, setReportType] = useState<'sales' | 'users' | 'sellers' | 'orders'>('sales');
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'custom'>('30d');
  const [format, setFormat] = useState<'csv' | 'pdf' | 'json'>('csv');

  const reportTemplates = [
    {
      id: 'sales',
      title: 'Sales Report',
      description: 'Revenue, orders, and transaction details',
      icon: DollarSign,
      color: 'blue',
    },
    {
      id: 'users',
      title: 'Users Report',
      description: 'User registration, activity, and demographics',
      icon: TrendingUp,
      color: 'green',
    },
    {
      id: 'sellers',
      title: 'Sellers Report',
      description: 'Seller performance, earnings, and statistics',
      icon: FileText,
      color: 'purple',
    },
    {
      id: 'orders',
      title: 'Orders Report',
      description: 'Order details, status, and fulfillment',
      icon: ShoppingCart,
      color: 'yellow',
    },
  ];

  const handleGenerateReport = () => {
    // Generate report logic
    console.log('Generating report:', { reportType, dateRange, format });
    alert(`Report generation started!\nType: ${reportType}\nRange: ${dateRange}\nFormat: ${format.toUpperCase()}\n\nIn production, this would download the report.`);
    // In real app, this would call API to generate and download report
  };

  return (
    <div className="w-full bg-gray-50 dark:bg-gray-950 p-4 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reports & Exports</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Generate and download comprehensive platform reports
          </p>
        </div>

        {/* Report Type Selection */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Select Report Type
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {reportTemplates.map((template) => {
              const Icon = template.icon;
              const isSelected = reportType === template.id;
              return (
                <motion.button
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setReportType(template.id as any)}
                  className={`p-6 rounded-xl border-2 transition-all text-left ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-700'
                  }`}
                >
                  <div
                    className={`p-3 rounded-lg w-fit mb-3 ${
                      isSelected
                        ? `bg-blue-100 dark:bg-blue-900/30`
                        : `bg-gray-100 dark:bg-gray-800`
                    }`}
                  >
                    <Icon
                      className={`h-6 w-6 ${
                        isSelected
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-gray-600 dark:text-gray-400'
                      }`}
                    />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {template.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{template.description}</p>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Report Configuration */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Report Configuration
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date Range
              </label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as any)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>

            {/* Export Format */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Export Format
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setFormat('csv')}
                  className={`flex-1 px-4 py-2 rounded-lg border-2 transition-all ${
                    format === 'csv'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-300 dark:border-gray-700'
                  }`}
                >
                  <FileSpreadsheet className="h-5 w-5 mx-auto" />
                  <span className="text-xs mt-1">CSV</span>
                </button>
                <button
                  onClick={() => setFormat('pdf')}
                  className={`flex-1 px-4 py-2 rounded-lg border-2 transition-all ${
                    format === 'pdf'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-300 dark:border-gray-700'
                  }`}
                >
                  <File className="h-5 w-5 mx-auto" />
                  <span className="text-xs mt-1">PDF</span>
                </button>
                <button
                  onClick={() => setFormat('json')}
                  className={`flex-1 px-4 py-2 rounded-lg border-2 transition-all ${
                    format === 'json'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-300 dark:border-gray-700'
                  }`}
                >
                  <FileJson className="h-5 w-5 mx-auto" />
                  <span className="text-xs mt-1">JSON</span>
                </button>
              </div>
            </div>

            {/* Generate Button */}
            <div className="flex items-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGenerateReport}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Download className="h-5 w-5" />
                Generate & Download
              </motion.button>
            </div>
          </div>
        </div>

        {/* Recent Reports */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Reports
          </h2>
          <div className="space-y-3">
            {[
              {
                name: 'Sales Report - December 2024',
                type: 'Sales',
                format: 'CSV',
                date: '2024-12-20',
                size: '2.5 MB',
              },
              {
                name: 'Users Report - Q4 2024',
                type: 'Users',
                format: 'PDF',
                date: '2024-12-18',
                size: '1.8 MB',
              },
              {
                name: 'Orders Report - November 2024',
                type: 'Orders',
                format: 'CSV',
                date: '2024-12-15',
                size: '3.2 MB',
              },
            ].map((report, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                    <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{report.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {report.type} • {report.format} • {report.size} • {report.date}
                    </p>
                  </div>
                </div>
                <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                  <Download className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
