'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Store,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  Phone,
  MapPin,
  TrendingUp,
  DollarSign,
  MoreVertical,
  Eye,
  Ban,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface Seller {
  _id: string;
  userId: any;
  storeName: string;
  phone?: string;
  address?: string;
  isApproved: boolean;
  createdAt: string;
  availableBalance: number;
  pendingWithdrawals: number;
}

export default function AdminSellersPage() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [filteredSellers, setFilteredSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'blocked'>('all');
  const [showActionsMenu, setShowActionsMenu] = useState<string | null>(null);

  useEffect(() => {
    fetchSellers();
  }, []);

  useEffect(() => {
    filterSellers();
  }, [searchQuery, statusFilter, sellers]);

  const fetchSellers = async () => {
    try {
      const response = await fetch('/api/admin/sellers');
      const data = await response.json();
      
      if (data.success && data.sellers) {
        setSellers(data.sellers);
        setFilteredSellers(data.sellers);
      } else {
        console.error('Failed to fetch sellers:', data.error);
      }
    } catch (error) {
      console.error('Error fetching sellers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterSellers = () => {
    let filtered = [...sellers];

    if (searchQuery) {
      filtered = filtered.filter(
        (seller) =>
          (seller.userId?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          seller.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (seller.userId?.email || '').toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      if (statusFilter === 'pending') {
        filtered = filtered.filter((s) => !s.isApproved);
      } else if (statusFilter === 'approved') {
        filtered = filtered.filter((s) => s.isApproved);
      } else if (statusFilter === 'blocked') {
        filtered = filtered.filter((s) => !s.isApproved);
      }
    }

    setFilteredSellers(filtered);
  };

  const handleApprove = async (sellerId: string) => {
    try {
      const response = await fetch('/api/admin/sellers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sellerId, action: 'approve' }),
      });
      const data = await response.json();
      
      if (data.success) {
        alert(`✅ ${data.message || 'Seller approved successfully!'}`);
        await fetchSellers();
        setShowActionsMenu(null);
      } else {
        alert(`❌ Error: ${data.error || 'Failed to approve seller'}`);
      }
    } catch (error: any) {
      console.error('Error approving seller:', error);
      alert(`❌ Error: ${error.message || 'Failed to approve seller'}`);
    } finally {
      setShowActionsMenu(null);
    }
  };

  const handleBlock = async (sellerId: string) => {
    if (!confirm('Are you sure you want to block this seller?')) {
      return;
    }
    
    try {
      const response = await fetch('/api/admin/sellers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sellerId, action: 'block' }),
      });
      const data = await response.json();
      
      if (data.success) {
        alert(`✅ ${data.message || 'Seller blocked successfully!'}`);
        await fetchSellers();
        setShowActionsMenu(null);
      } else {
        alert(`❌ Error: ${data.error || 'Failed to block seller'}`);
      }
    } catch (error: any) {
      console.error('Error blocking seller:', error);
      alert(`❌ Error: ${error.message || 'Failed to block seller'}`);
    } finally {
      setShowActionsMenu(null);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center" style={{ minHeight: '400px' }}>
        <div className="text-center">
          <div className="h-12 w-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading sellers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50 dark:bg-gray-950 p-4 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Store className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Sellers Management</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Approve, manage, and monitor all sellers on the platform
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 mb-6 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search sellers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Sellers</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{sellers.length}</p>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
              <Clock className="h-4 w-4" />
              Pending
            </p>
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {sellers.filter((s) => !s.isApproved).length}
            </p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">Approved</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {sellers.filter((s) => s.isApproved).length}
            </p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Balance</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
              <DollarSign className="h-5 w-5" />
              {formatPrice(sellers.reduce((sum, s) => sum + s.availableBalance, 0))}
            </p>
          </div>
        </div>

        {/* Sellers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredSellers.length === 0 ? (
            <div className="col-span-2 text-center py-12 text-gray-500 dark:text-gray-400">
              No sellers found
            </div>
          ) : (
            filteredSellers.map((seller) => (
              <motion.div
                key={seller._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.02, y: -4 }}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-lg bg-blue-500 flex items-center justify-center text-white text-2xl font-bold">
                      {seller.storeName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {seller.storeName}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {seller.userId?.name || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="relative">
                    <button
                      onClick={() =>
                        setShowActionsMenu(showActionsMenu === seller._id ? null : seller._id)
                      }
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <MoreVertical className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    </button>
                    {showActionsMenu === seller._id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                        {!seller.isApproved && (
                          <>
                            <button
                              onClick={() => handleApprove(seller._id)}
                              className="w-full text-left px-4 py-2 text-sm text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 flex items-center gap-2"
                            >
                              <CheckCircle className="h-4 w-4" />
                              Approve
                            </button>
                            <button
                              onClick={() => handleBlock(seller._id)}
                              className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                            >
                              <XCircle className="h-4 w-4" />
                              Reject
                            </button>
                          </>
                        )}
                        {seller.isApproved && (
                          <button
                            onClick={() => handleBlock(seller._id)}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                          >
                            <Ban className="h-4 w-4" />
                            Block Seller
                          </button>
                        )}
                        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
                          <Eye className="h-4 w-4" />
                          View Details
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Mail className="h-4 w-4" />
                    {seller.userId?.email || 'N/A'}
                  </div>
                  {seller.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Phone className="h-4 w-4" />
                      {seller.phone}
                    </div>
                  )}
                  {seller.address && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="h-4 w-4" />
                      {seller.address}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Available Balance</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      {formatPrice(seller.availableBalance)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Pending Withdrawals</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      {formatPrice(seller.pendingWithdrawals)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      !seller.isApproved
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                        : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    }`}
                  >
                    {seller.isApproved ? 'Approved' : 'Pending'}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Joined {new Date(seller.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
