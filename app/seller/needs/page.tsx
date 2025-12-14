'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { formatPrice } from '@/lib/utils';
import { useSocket } from '@/lib/socket-client';
import {
  MessageSquare,
  Search,
  Filter,
  Package,
  Phone,
  DollarSign,
  Send,
  Clock,
  CheckCircle,
} from 'lucide-react';

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
  createdAt: string;
}

export default function SellerNeedsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [needs, setNeeds] = useState<Need[]>([]);
  const [filteredNeeds, setFilteredNeeds] = useState<Need[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNeed, setSelectedNeed] = useState<string | null>(null);
  const [offerPrice, setOfferPrice] = useState('');
  const [submittingOffer, setSubmittingOffer] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const { socket, isConnected } = useSocket(token);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
  }, []);

  useEffect(() => {
    fetchNeeds();
    
    // Check if needId is in URL (from notification click)
    const needId = searchParams.get('needId');
    if (needId) {
      setSelectedNeed(needId);
      // Scroll to the need if it exists
      setTimeout(() => {
        const element = document.getElementById(`need-${needId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 500);
    }
  }, [searchParams]);

  // Listen for new need requests via Socket.IO
  useEffect(() => {
    if (!socket || !isConnected) return;

    socket.on('need:new', (data: any) => {
      console.log('📬 New need request received:', data);
      // Refresh needs list
      fetchNeeds();
    });

    return () => {
      socket.off('need:new');
    };
  }, [socket, isConnected]);

  useEffect(() => {
    filterNeeds();
  }, [searchQuery, needs]);

  const fetchNeeds = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/seller/needs');
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

    setFilteredNeeds(filtered);
  };

  const handleSubmitOffer = async (needId: string) => {
    if (!offerPrice || parseFloat(offerPrice) <= 0) {
      alert('Please enter a valid price');
      return;
    }

    try {
      setSubmittingOffer(true);
      const res = await fetch('/api/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          needId,
          price: parseFloat(offerPrice),
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert('Offer submitted successfully!');
        setOfferPrice('');
        setSelectedNeed(null);
        fetchNeeds();
      } else {
        alert(data.error || 'Failed to submit offer');
      }
    } catch (error) {
      console.error('Offer submit error:', error);
      alert('Failed to submit offer');
    } finally {
      setSubmittingOffer(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center" style={{ minHeight: '400px' }}>
        <div className="text-center">
          <div className="h-12 w-12 rounded-full border-4 border-green-500 border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading need requests...</p>
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
            Need Requests
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Respond to customer requests with your best price offers
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 mb-6 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search need requests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Needs List */}
        {filteredNeeds.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-12 text-center">
            <MessageSquare className="h-12 w-12 mx-auto mb-3 text-gray-400 opacity-50" />
            <p className="text-gray-500 dark:text-gray-400 mb-2">No active need requests</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              When customers create need requests, they will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNeeds.map((need, index) => (
              <motion.div
                id={`need-${need._id}`}
                key={need._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`bg-white dark:bg-gray-900 border-2 rounded-xl p-6 shadow-sm hover:shadow-md transition-all ${
                  selectedNeed === need._id
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'border-gray-200 dark:border-gray-800'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Need Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {need.needNumber}
                      </h2>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          need.status === 'active'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                        }`}
                      >
                        {need.status}
                      </span>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        <span>{need.productId?.name || 'Product'} - {need.operator}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        <span>{need.mobileNumber} | Qty: {need.quantity}</span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-500">
                        Requested {new Date(need.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* Offer Form */}
                  <div className="flex items-center gap-4">
                    {selectedNeed === need._id ? (
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="number"
                            value={offerPrice}
                            onChange={(e) => setOfferPrice(e.target.value)}
                            placeholder="Enter price"
                            min="1"
                            step="0.01"
                            className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent w-32"
                          />
                        </div>
                        <button
                          onClick={() => handleSubmitOffer(need._id)}
                          disabled={submittingOffer}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                          {submittingOffer ? (
                            <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                          ) : (
                            <Send className="h-4 w-4" />
                          )}
                          Submit
                        </button>
                        <button
                          onClick={() => {
                            setSelectedNeed(null);
                            setOfferPrice('');
                          }}
                          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelectedNeed(need._id)}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                      >
                        <DollarSign className="h-5 w-5" />
                        Submit Offer
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

