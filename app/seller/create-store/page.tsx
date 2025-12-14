'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Store, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';

export default function CreateStorePage() {
  const router = useRouter();
  const [storeName, setStoreName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is logged in and is seller
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    // Check if user already has a store
    checkExistingStore();
  }, [router]);

  const checkExistingStore = async () => {
    try {
      const res = await fetch('/api/seller/store');
      const data = await res.json();
      
      if (data.success && data.seller.storeName) {
        // Store already exists, redirect to dashboard
        if (data.seller.isApproved) {
          router.push('/seller/dashboard');
        } else {
          router.push('/seller/waiting-approval');
        }
      }
    } catch (error) {
      console.error('Error checking store:', error);
    }
  };

  const handleCreateStore = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!storeName.trim() || storeName.trim().length < 3) {
      setError('Store name must be at least 3 characters');
      return;
    }

    setLoading(true);

    try {
      // First, ensure user role is seller
      const typeRes = await fetch('/api/auth/set-account-type', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountType: 'seller' }),
      });

      const typeData = await typeRes.json();
      if (!typeData.success) {
        throw new Error(typeData.error || 'Failed to set account type');
      }

      // Update token in localStorage
      if (typeData.token) {
        localStorage.setItem('token', typeData.token);
      }

      // Create store
      const storeRes = await fetch('/api/auth/register-seller', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storeName: storeName.trim() }),
      });

      const storeData = await storeRes.json();
      
      if (storeData.success) {
        // Redirect to waiting approval page
        router.push('/seller/waiting-approval');
      } else {
        throw new Error(storeData.error || 'Failed to create store');
      }
    } catch (error: any) {
      console.error('Store creation error:', error);
      setError(error.message || 'Failed to create store');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
            <Store className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
            Create Your Store
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Set up your store name to start selling products
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg flex items-center gap-2"
          >
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleCreateStore} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Store Name *
            </label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              placeholder="Enter your store name"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
              minLength={3}
              disabled={loading}
              autoFocus
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              This name will be visible to all customers. Minimum 3 characters.
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div className="text-sm text-blue-800 dark:text-blue-300">
                <p className="font-semibold mb-1">Admin Approval Required</p>
                <p>
                  After creating your store, it will be reviewed by our admin team. 
                  You'll be notified once your store is approved and can start selling.
                </p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !storeName.trim()}
            className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold transition-colors"
          >
            {loading ? (
              <>
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating Store...
              </>
            ) : (
              <>
                Create Store
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}


