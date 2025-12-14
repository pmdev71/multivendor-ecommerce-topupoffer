'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { formatPrice } from '@/lib/utils';
import {
  Package,
  Store,
  Star,
  ShoppingCart,
  MessageSquare,
  ArrowLeft,
  CheckCircle,
  Phone,
  TrendingDown,
  Clock,
} from 'lucide-react';

interface Seller {
  _id?: string; // sellerProductId
  sellerId: {
    _id: string;
    storeName: string;
    isOnline: boolean;
    rating: number;
  };
  price: number;
  stock?: number;
}

interface Product {
  _id: string;
  name: string;
  description?: string;
  operator: string;
  category: string;
  sellers: Seller[];
  lowestPrice: number | null;
}

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileNumber, setMobileNumber] = useState('');
  const [selectedSeller, setSelectedSeller] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/products/${params.id}`);
      const data = await res.json();
      
      if (res.ok && data.success) {
        setProduct(data.product);
        if (data.product.sellers && data.product.sellers.length > 0) {
          setSelectedSeller(data.product.sellers[0].sellerId._id);
        }
      } else {
        // Product not found or error
        console.error('Product fetch error:', data.error || 'Unknown error');
        setProduct(null);
      }
    } catch (error) {
      console.error('Product fetch error:', error);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  const handleOrder = async () => {
    if (!mobileNumber) {
      alert('Please enter mobile number');
      return;
    }

    if (!selectedSeller) {
      alert('Please select a seller');
      return;
    }

    // Find the sellerProductId from the selected seller
    const selectedSellerProduct = sortedSellers.find((s) => s.sellerId._id === selectedSeller);
    if (!selectedSellerProduct || !selectedSellerProduct._id) {
      alert('Seller product not found. Please try again.');
      return;
    }

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sellerProductId: selectedSellerProduct._id,
          operator: product?.operator,
          mobileNumber,
          quantity,
          paymentMethod: 'wallet',
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert('Order created successfully!');
        router.push('/customer/orders');
      } else {
        alert(data.error || 'Failed to create order');
      }
    } catch (error) {
      console.error('Order create error:', error);
      alert('Failed to create order');
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center" style={{ minHeight: '400px' }}>
        <div className="text-center">
          <div className="h-12 w-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="w-full bg-gray-50 dark:bg-gray-950 p-4 lg:p-8">
        <div className="mx-auto max-w-7xl text-center py-12">
          <Package className="h-12 w-12 mx-auto mb-3 text-gray-400 opacity-50" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Product Not Found
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            The product you're looking for doesn't exist or is not available.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/customer/products"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to Products
            </Link>
            <Link
              href="/customer/dashboard"
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const sortedSellers = product.sellers ? [...product.sellers].sort((a, b) => a.price - b.price) : [];
  const selectedSellerData = sortedSellers.find((s) => s.sellerId?._id === selectedSeller);

  return (
    <div className="w-full bg-gray-50 dark:bg-gray-950 p-4 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Back Button */}
        <Link
          href="/customer/products"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Products</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Product Info */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm mb-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {product.name}
                  </h1>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded-full text-sm font-semibold">
                      {product.operator}
                    </span>
                    <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 rounded-full text-sm">
                      {product.category}
                    </span>
                  </div>
                </div>
                {product.lowestPrice && (
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-1">
                      <TrendingDown className="h-5 w-5" />
                      <span className="text-sm font-medium">Lowest Price</span>
                    </div>
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                      {formatPrice(product.lowestPrice)}
                    </p>
                  </div>
                )}
              </div>

              {product.description && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Description
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">{product.description}</p>
                </div>
              )}

              {/* Mobile Number Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Mobile Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </motion.div>

            {/* Sellers List */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Available Sellers ({product.sellers?.length || 0})
              </h2>

              {sortedSellers.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Store className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No sellers available for this product</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sortedSellers.map((seller, index) => (
                    <motion.div
                      key={seller.sellerId._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`border-2 rounded-xl p-4 transition-all ${
                        selectedSeller === seller.sellerId._id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {seller.sellerId.storeName}
                            </h3>
                            <span
                              className={`w-2 h-2 rounded-full ${
                                seller.sellerId.isOnline ? 'bg-green-500' : 'bg-gray-400'
                              }`}
                            />
                            <span className="text-xs text-gray-500 dark:text-gray-500">
                              {seller.sellerId.isOnline ? 'Online' : 'Offline'}
                            </span>
                          </div>
                          {seller.sellerId.rating > 0 && (
                            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span>{seller.sellerId.rating.toFixed(1)}</span>
                            </div>
                          )}
                          {seller.stock !== undefined && (
                            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                              Stock: {seller.stock}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {formatPrice(seller.price)}
                          </p>
                          {index === 0 && (
                            <span className="inline-block mt-1 px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-full text-xs font-semibold">
                              Best Price
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedSeller(seller.sellerId._id);
                        }}
                        className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                          selectedSeller === seller.sellerId._id
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                      >
                        {selectedSeller === seller.sellerId._id ? (
                          <span className="flex items-center justify-center gap-2">
                            <CheckCircle className="h-4 w-4" />
                            Selected
                          </span>
                        ) : (
                          'Select Seller'
                        )}
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Need Request Section */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <MessageSquare className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-green-900 dark:text-green-300 mb-1">
                        Want the Best Price?
                      </h4>
                      <p className="text-sm text-green-800 dark:text-green-400">
                        Create a need request and get price offers from all online sellers. Compare and choose the best deal!
                      </p>
                    </div>
                  </div>
                </div>
                <Link
                  href={`/customer/needs/create?productId=${product._id}&operator=${product.operator}&name=${encodeURIComponent(product.name)}`}
                  className="block w-full text-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 font-semibold"
                >
                  <MessageSquare className="h-5 w-5" />
                  Request Best Price from All Sellers
                </Link>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm sticky top-4"
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Order Summary
              </h2>

              {selectedSellerData ? (
                <>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Product</span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {product.name}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Seller</span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {selectedSellerData.sellerId.storeName}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Quantity</span>
                      <span className="text-gray-900 dark:text-white font-medium">{quantity}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Unit Price</span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {formatPrice(selectedSellerData.price)}
                      </span>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-800 pt-3">
                      <div className="flex justify-between">
                        <span className="text-lg font-semibold text-gray-900 dark:text-white">
                          Total
                        </span>
                        <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {formatPrice(selectedSellerData.price * quantity)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleOrder}
                    disabled={!mobileNumber || !selectedSeller}
                    className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    Place Order
                  </button>
                </>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Select a seller to see order summary</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
