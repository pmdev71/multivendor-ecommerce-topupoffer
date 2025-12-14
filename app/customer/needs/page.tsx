'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { formatPrice } from '@/lib/utils';
import {
  MessageSquare,
  Search,
  Filter,
  Store,
  Star,
  CheckCircle,
  Clock,
  TrendingDown,
  Plus,
  ArrowRight,
  ShoppingCart,
} from 'lucide-react';

interface Offer {
  _id: string;
  sellerId: {
    storeName: string;
    rating: number;
  };
  price: number;
  status: string;
}

interface Need {
  _id: string;
  needNumber: string;
  productId: {
    name: string;
    operator: string;
  };
  operator: string;
  mobileNumber: string;
  quantity: number;
  status: string;
  offers: Offer[];
  offersCount: number;
  createdAt: string;
}

export default function NeedsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [needs, setNeeds] = useState<Need[]>([]);
  const [filteredNeeds, setFilteredNeeds] = useState<Need[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'accepted' | 'completed'>('all');

  useEffect(() => {
    fetchNeeds();
    
    // Check if needId is in URL (from notification click)
    const needId = searchParams.get('needId');
    if (needId) {
      // Scroll to the need if it exists
      setTimeout(() => {
        const element = document.getElementById(`need-${needId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // Highlight the need
          element.classList.add('ring-2', 'ring-green-500');
          setTimeout(() => {
            element.classList.remove('ring-2', 'ring-green-500');
          }, 3000);
        }
      }, 500);
    }
  }, [searchParams]);

  useEffect(() => {
    filterNeeds();
  }, [searchQuery, statusFilter, needs]);

  const fetchNeeds = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/needs');
      const data = await res.json();
      if (data.success) {
        setNeeds(data.needs);
        setFilteredNeeds(data.needs);
      }
    } catch (error) {
      console.error('Needs fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterNeeds = () => {
    let filtered = [...needs];

    if (searchQuery) {
      filtered = filtered.filter(
        (need) =>
          need.needNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          need.productId?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          need.mobileNumber.includes(searchQuery)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((need) => need.status === statusFilter);
    }

    setFilteredNeeds(filtered);
  };

  const handleAcceptOffer = async (needId: string, offerId: string, sellerName: string, price: number) => {
    if (!confirm(`Accept offer from ${sellerName} at ${formatPrice(price)} and create order?`)) return;

    try {
      const res = await fetch(`/api/needs/${needId}/offers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          offerId,
          paymentMethod: 'wallet',
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert(`Order created successfully! Order #${data.order?.orderNumber || 'N/A'}`);
        router.push('/customer/orders');
      } else {
        alert(data.error || 'Failed to accept offer');
      }
    } catch (error) {
      console.error('Offer accept error:', error);
      alert('Failed to accept offer');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'accepted':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'completed':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center" style={{ minHeight: '400px' }}>
        <div className="text-center">
          <div className="h-12 w-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading need requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50 dark:bg-gray-950 p-4 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              My Need Requests
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Compare offers from sellers and get the best price
            </p>
          </div>
          <Link
            href="/customer/needs/create"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Create Request
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 mb-6 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by need number, product, or mobile..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 appearance-none"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="accepted">Accepted</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Needs List */}
        {filteredNeeds.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-12 text-center">
            <MessageSquare className="h-12 w-12 mx-auto mb-3 text-gray-400 opacity-50" />
            <p className="text-gray-500 dark:text-gray-400 mb-4">No need requests found</p>
            <Link
              href="/customer/needs/create"
              className="inline-block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Create Need Request
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredNeeds.map((need, index) => (
              <motion.div
                id={`need-${need._id}`}
                key={need._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`bg-white dark:bg-gray-900 border-2 rounded-xl p-6 shadow-sm hover:shadow-md transition-all ${
                  searchParams.get('needId') === need._id
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'border-gray-200 dark:border-gray-800'
                }`}
              >
                {/* Need Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {need.needNumber}
                      </h2>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          need.status
                        )}`}
                      >
                        {need.status}
                      </span>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      <p>
                        <strong>Product:</strong> {need.productId?.name || 'Product'} - {need.operator}
                      </p>
                      <p>
                        <strong>Mobile:</strong> {need.mobileNumber} | <strong>Qty:</strong> {need.quantity}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        Created {new Date(need.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Offers Received</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {need.offersCount || 0}
                    </p>
                  </div>
                </div>

                {/* Offers List */}
                {need.status === 'active' && need.offers.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-2 mb-4">
                      <TrendingDown className="h-5 w-5 text-green-600 dark:text-green-400" />
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        Offers ({need.offersCount})
                      </h3>
                    </div>
                    <div className="space-y-3">
                      {need.offers
                        .sort((a, b) => a.price - b.price)
                        .map((offer, offerIndex) => (
                          <motion.div
                            key={offer._id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: offerIndex * 0.1 }}
                            className={`flex items-center justify-between p-4 rounded-lg border-2 ${
                              offerIndex === 0
                                ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
                                : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                            }`}
                          >
                            <div className="flex items-center gap-4">
                              <div className="p-2 rounded-lg bg-white dark:bg-gray-900">
                                <Store className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {offer.sellerId.storeName}
                                </p>
                                {offer.sellerId.rating > 0 && (
                                  <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    <span>{offer.sellerId.rating.toFixed(1)}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                {offerIndex === 0 && (
                                  <span className="inline-block mb-1 px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-full text-xs font-semibold">
                                    Best Price
                                  </span>
                                )}
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                  {formatPrice(offer.price)}
                                </p>
                              </div>
                              <button
                                onClick={() => handleAcceptOffer(need._id, offer._id, offer.sellerId.storeName, offer.price)}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 font-semibold"
                              >
                                <ShoppingCart className="h-4 w-4" />
                                Place Order
                              </button>
                            </div>
                          </motion.div>
                        ))}
                    </div>
                  </div>
                )}

                {need.status === 'active' && need.offers.length === 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800 text-center">
                    <Clock className="h-8 w-8 mx-auto mb-2 text-gray-400 opacity-50" />
                    <p className="text-gray-500 dark:text-gray-400">
                      Waiting for seller offers...
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
