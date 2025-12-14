'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Clock, Store, CheckCircle, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function WaitingApprovalPage() {
  const router = useRouter();
  const [storeInfo, setStoreInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkStoreStatus();
    // Check status every 30 seconds
    const interval = setInterval(checkStoreStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkStoreStatus = async () => {
    try {
      const res = await fetch('/api/seller/store');
      const data = await res.json();
      
      if (data.success) {
        setStoreInfo(data.seller);
        
        if (data.seller.isApproved) {
          // Store approved, redirect to dashboard
          setTimeout(() => {
            router.push('/seller/dashboard');
          }, 2000);
        }
      }
    } catch (error) {
      console.error('Error checking store status:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center"
      >
        {storeInfo?.isApproved ? (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-4"
            >
              <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
            </motion.div>
            <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
              Store Approved! 🎉
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Your store <strong>{storeInfo.storeName}</strong> has been approved.
              You can now start selling products!
            </p>
            <Link
              href="/seller/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
            >
              Go to Dashboard
              <Store className="h-5 w-5" />
            </Link>
          </>
        ) : (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 dark:bg-yellow-900/30 mb-4"
            >
              <Clock className="h-10 w-10 text-yellow-600 dark:text-yellow-400" />
            </motion.div>
            <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
              Waiting for Approval
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Your store <strong>{storeInfo?.storeName || 'Store'}</strong> is under review.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
              Our admin team will review your store and notify you once it's approved.
              This usually takes 24-48 hours.
            </p>
            <button
              onClick={checkStoreStatus}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            >
              <RefreshCw className="h-4 w-4" />
              Check Status
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
}


