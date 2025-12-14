'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { formatPrice } from '@/lib/utils';
import {
  DollarSign,
  TrendingUp,
  Wallet,
  ArrowDown,
  History,
  Plus,
  CheckCircle,
  Clock,
  XCircle,
} from 'lucide-react';

interface Withdrawal {
  _id: string;
  amount: number;
  method: string;
  accountNumber: string;
  status: string;
  createdAt: string;
}

export default function SellerEarningsPage() {
  const [stats, setStats] = useState({
    totalEarnings: 0,
    availableBalance: 0,
    pendingWithdrawals: 0,
  });
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawForm, setWithdrawForm] = useState({
    amount: '',
    method: 'bkash',
    accountNumber: '',
    accountName: '',
  });

  useEffect(() => {
    fetchEarningsData();
  }, []);

  const fetchEarningsData = async () => {
    try {
      setLoading(true);
      // TODO: Fetch from seller earnings API
      setStats({
        totalEarnings: 50000,
        availableBalance: 25000,
        pendingWithdrawals: 5000,
      });
      setWithdrawals([]);
    } catch (error) {
      console.error('Earnings fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawForm.amount || parseFloat(withdrawForm.amount) < 500) {
      alert('Minimum withdrawal amount is 500 BDT');
      return;
    }

    if (!withdrawForm.accountNumber) {
      alert('Account number is required');
      return;
    }

    try {
      const res = await fetch('/api/seller/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(withdrawForm),
      });

      const data = await res.json();
      if (data.success) {
        alert('Withdrawal request submitted successfully!');
        setShowWithdrawModal(false);
        setWithdrawForm({ amount: '', method: 'bkash', accountNumber: '', accountName: '' });
        fetchEarningsData();
      } else {
        alert(data.error || 'Failed to submit withdrawal request');
      }
    } catch (error) {
      console.error('Withdraw error:', error);
      alert('Failed to submit withdrawal request');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center" style={{ minHeight: '400px' }}>
        <div className="text-center">
          <div className="h-12 w-12 rounded-full border-4 border-green-500 border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading earnings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50 dark:bg-gray-950 p-4 lg:p-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Earnings & Withdrawals
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Track your earnings and request withdrawals
            </p>
          </div>
          <button
            onClick={() => setShowWithdrawModal(true)}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 font-semibold"
          >
            <Plus className="h-5 w-5" />
            Request Withdrawal
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-green-600 to-green-800 rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-full bg-white/20">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="text-white/80 text-sm mb-1">Total Earnings</p>
                <p className="text-3xl font-bold text-white">{formatPrice(stats.totalEarnings)}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-full bg-white/20">
                <Wallet className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="text-white/80 text-sm mb-1">Available Balance</p>
                <p className="text-3xl font-bold text-white">{formatPrice(stats.availableBalance)}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-yellow-600 to-yellow-800 rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-full bg-white/20">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="text-white/80 text-sm mb-1">Pending Withdrawals</p>
                <p className="text-3xl font-bold text-white">{formatPrice(stats.pendingWithdrawals)}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Withdrawals History */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <History className="h-5 w-5" />
              Withdrawal History
            </h2>
          </div>

          {withdrawals.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <ArrowDown className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No withdrawal requests yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {withdrawals.map((withdrawal, index) => (
                <motion.div
                  key={withdrawal._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {getStatusIcon(withdrawal.status)}
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {withdrawal.method.toUpperCase()} - {withdrawal.accountNumber}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-500">
                        {new Date(withdrawal.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {formatPrice(withdrawal.amount)}
                      </p>
                      <div className="flex items-center justify-end gap-1 mt-1">
                        {getStatusIcon(withdrawal.status)}
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                            withdrawal.status
                          )}`}
                        >
                          {withdrawal.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Withdraw Modal */}
        {showWithdrawModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-900 rounded-xl p-6 max-w-md w-full shadow-xl"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Request Withdrawal
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Amount (Minimum: 500 BDT)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="number"
                      value={withdrawForm.amount}
                      onChange={(e) => setWithdrawForm({ ...withdrawForm, amount: e.target.value })}
                      placeholder="Enter amount"
                      min="500"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Payment Method
                  </label>
                  <select
                    value={withdrawForm.method}
                    onChange={(e) => setWithdrawForm({ ...withdrawForm, method: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                  >
                    <option value="bkash">bKash</option>
                    <option value="nagad">Nagad</option>
                    <option value="rocket">Rocket</option>
                    <option value="bank">Bank Transfer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Account Number
                  </label>
                  <input
                    type="text"
                    value={withdrawForm.accountNumber}
                    onChange={(e) => setWithdrawForm({ ...withdrawForm, accountNumber: e.target.value })}
                    placeholder="Enter account number"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Account Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={withdrawForm.accountName}
                    onChange={(e) => setWithdrawForm({ ...withdrawForm, accountName: e.target.value })}
                    placeholder="Enter account name"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowWithdrawModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleWithdraw}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Submit Request
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}

