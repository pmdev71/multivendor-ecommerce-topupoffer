'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, Store, ArrowRight, CheckCircle } from 'lucide-react';

export default function SelectAccountTypePage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<'customer' | 'seller' | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const handleSelectType = async (type: 'customer' | 'seller') => {
    setSelectedType(type);
    setLoading(true);

    try {
      if (type === 'seller') {
        // Redirect to store creation page
        router.push('/seller/create-store');
      } else {
        // Update user role to customer and redirect
        const response = await fetch('/api/auth/set-account-type', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ accountType: 'customer' }),
        });

        const data = await response.json();
        if (data.success) {
          router.push('/customer/products');
        } else {
          alert(data.error || 'Failed to set account type');
          setLoading(false);
        }
      }
    } catch (error) {
      console.error('Error setting account type:', error);
      alert('Failed to set account type');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
            Choose Your Account Type
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Select how you want to use our platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Customer Option */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelectType('customer')}
            disabled={loading}
            className={`p-6 rounded-xl border-2 transition-all text-left ${
              selectedType === 'customer'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <User className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              {selectedType === 'customer' && (
                <CheckCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              )}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Customer
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Browse and purchase digital products, internet packages, and services from sellers.
            </p>
            <ul className="text-xs text-gray-500 dark:text-gray-500 space-y-1">
              <li>• Browse products</li>
              <li>• Place orders</li>
              <li>• Request best prices</li>
              <li>• Track orders</li>
            </ul>
          </motion.button>

          {/* Seller Option */}
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelectType('seller')}
            disabled={loading}
            className={`p-6 rounded-xl border-2 transition-all text-left ${
              selectedType === 'seller'
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30">
                <Store className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              {selectedType === 'seller' && (
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              )}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Seller
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Sell digital products and services. Create your store and start selling.
            </p>
            <ul className="text-xs text-gray-500 dark:text-gray-500 space-y-1">
              <li>• Create your store</li>
              <li>• Add products</li>
              <li>• Manage orders</li>
              <li>• Earn money</li>
            </ul>
          </motion.button>
        </div>

        {loading && (
          <div className="text-center">
            <div className="inline-block h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {selectedType === 'seller' ? 'Redirecting to store creation...' : 'Setting up your account...'}
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}


