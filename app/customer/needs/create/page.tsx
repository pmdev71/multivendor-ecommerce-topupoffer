'use client';

'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  ArrowLeft,
  Phone,
  Package,
  Plus,
  CheckCircle,
  Sparkles,
} from 'lucide-react';

export default function CreateNeedPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [productName, setProductName] = useState('');
  const [formData, setFormData] = useState({
    productId: searchParams.get('productId') || '',
    operator: searchParams.get('operator') || '',
    mobileNumber: '',
    quantity: 1,
  });

  useEffect(() => {
    const name = searchParams.get('name');
    if (name) {
      setProductName(decodeURIComponent(name));
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/needs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        alert(`Need request created! ${data.onlineSellersCount || 0} online seller(s) will be notified.`);
        router.push('/customer/needs');
      } else {
        alert(data.error || 'Failed to create need request');
      }
    } catch (error) {
      console.error('Need create error:', error);
      alert('Failed to create need request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-gray-50 dark:bg-gray-950 p-4 lg:p-8">
      <div className="mx-auto max-w-2xl">
        {/* Back Button */}
        <div className="flex items-center gap-4 mb-6">
          {formData.productId ? (
            <>
              <Link
                href={`/customer/products/${formData.productId}`}
                className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Product</span>
              </Link>
              <span className="text-gray-400">|</span>
            </>
          ) : null}
          <Link
            href="/customer/needs"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Need Requests</span>
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30">
              <Sparkles className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Request Best Price
              </h1>
              {productName && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Product: <span className="font-semibold">{productName}</span>
                </p>
              )}
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Get price offers from all online sellers. Compare and choose the best deal!
          </p>
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Operator */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Package className="h-4 w-4 inline mr-2" />
                Operator
              </label>
              <select
                value={formData.operator}
                onChange={(e) => setFormData({ ...formData, operator: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Select Operator</option>
                <option value="GP">GP (Grameenphone)</option>
                <option value="Robi">Robi</option>
                <option value="Banglalink">Banglalink</option>
                <option value="Airtel">Airtel</option>
                <option value="Teletalk">Teletalk</option>
              </select>
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Phone className="h-4 w-4 inline mr-2" />
                Mobile Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="tel"
                  value={formData.mobileNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, mobileNumber: e.target.value })
                  }
                  placeholder="01XXXXXXXXX"
                  required
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Plus className="h-4 w-4 inline mr-2" />
                Quantity
              </label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: Math.max(1, parseInt(e.target.value) || 1) })
                }
                min="1"
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm text-blue-800 dark:text-blue-400">
                <strong>How it works:</strong> After submitting, all online sellers will receive a
                notification. They can submit their best price offers. You'll be able to compare
                offers and accept the best one.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 font-semibold"
            >
              {loading ? (
                <>
                  <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <CheckCircle className="h-5 w-5" />
                  Create Need Request
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
