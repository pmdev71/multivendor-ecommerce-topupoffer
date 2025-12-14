'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatPrice } from '@/lib/utils';
import {
  Package,
  Search,
  Filter,
  Plus,
  Edit,
  CheckCircle,
  XCircle,
  DollarSign,
  X,
  Save,
} from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  description?: string;
  operator: string;
  category: string;
}

interface SellerProduct {
  _id: string;
  productId: {
    _id: string;
    name: string;
    operator: string;
    category: string;
  };
  price: number;
  stock?: number;
  isActive: boolean;
}

export default function SellerProductsPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [sellerProducts, setSellerProducts] = useState<SellerProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [operatorFilter, setOperatorFilter] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchQuery, operatorFilter, allProducts]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // First check store status
      const storeRes = await fetch('/api/seller/store');
      const storeData = await storeRes.json();
      
      if (!storeData.success) {
        // No store found, redirect to create store
        window.location.href = '/seller/create-store';
        return;
      }
      
      if (!storeData.seller.storeName) {
        // Store name not set, redirect to create store
        window.location.href = '/seller/create-store';
        return;
      }
      
      if (!storeData.seller.isApproved) {
        // Store not approved, redirect to waiting page
        window.location.href = '/seller/waiting-approval';
        return;
      }
      
      const [allRes, sellerRes] = await Promise.all([
        fetch('/api/products/all'),
        fetch('/api/seller/products'),
      ]);

      const allData = await allRes.json();
      const sellerData = await sellerRes.json();

      console.log('Products API Response:', { allData, sellerData });

      if (allData.success) {
        setAllProducts(allData.products || []);
        setFilteredProducts(allData.products || []);
        console.log('Products loaded:', allData.products?.length || 0);
      } else {
        console.error('Failed to fetch products:', allData.error);
      }

      if (sellerData.success) {
        setSellerProducts(sellerData.products || []);
        console.log('Seller products loaded:', sellerData.products?.length || 0);
      } else {
        console.error('Failed to fetch seller products:', sellerData.error);
      }
    } catch (error) {
      console.error('Data fetch error:', error);
      alert('Failed to load products. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...allProducts];

    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (operatorFilter) {
      filtered = filtered.filter((product) => product.operator === operatorFilter);
    }

    setFilteredProducts(filtered);
  };

  const getSellerProduct = (productId: string): SellerProduct | undefined => {
    return sellerProducts.find((sp) => sp.productId._id === productId);
  };

  const handleAddProduct = (product: Product) => {
    const existing = getSellerProduct(product._id);
    setSelectedProduct(product);
    setPrice(existing ? existing.price.toString() : '');
    setStock(existing?.stock?.toString() || '');
    setShowAddModal(true);
  };

  const handleSavePrice = async () => {
    if (!selectedProduct || !price || parseFloat(price) < 0) {
      alert('Please enter a valid price');
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch('/api/seller/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: selectedProduct._id,
          price: parseFloat(price),
          stock: stock ? parseInt(stock) : undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert('Product price set successfully!');
        setShowAddModal(false);
        setSelectedProduct(null);
        setPrice('');
        setStock('');
        fetchData();
      } else {
        alert(data.error || 'Failed to set price');
      }
    } catch (error) {
      console.error('Price save error:', error);
      alert('Failed to set price');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (sellerProductId: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/seller/products/${sellerProductId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      const data = await res.json();
      if (data.success) {
        fetchData();
      } else {
        alert(data.error || 'Failed to update product');
      }
    } catch (error) {
      console.error('Product update error:', error);
      alert('Failed to update product');
    }
  };

  const uniqueOperators = Array.from(new Set(allProducts.map((p) => p.operator)));

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center" style={{ minHeight: '400px' }}>
        <div className="text-center">
          <div className="h-12 w-12 rounded-full border-4 border-green-500 border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading products...</p>
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
            All Products
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Set your prices for any product. Products you've added are marked with a check.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 mb-6 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={operatorFilter}
                onChange={(e) => setOperatorFilter(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 appearance-none"
              >
                <option value="">All Operators</option>
                {uniqueOperators.map((op) => (
                  <option key={op} value={op}>
                    {op}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Products</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{allProducts.length}</p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">Your Products</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {sellerProducts.length}
            </p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">Active Products</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {sellerProducts.filter((sp) => sp.isActive).length}
            </p>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-12 text-center">
            <Package className="h-12 w-12 mx-auto mb-3 text-gray-400 opacity-50" />
            <p className="text-gray-500 dark:text-gray-400">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product, index) => {
              const sellerProduct = getSellerProduct(product._id);
              const hasPrice = !!sellerProduct;

              return (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                  className={`bg-white dark:bg-gray-900 border-2 rounded-xl p-6 shadow-sm hover:shadow-md transition-all ${
                    hasPrice
                      ? 'border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/10'
                      : 'border-gray-200 dark:border-gray-800'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                          {product.name}
                        </h2>
                        {hasPrice && (
                          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded-full text-xs font-semibold">
                          {product.operator}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 rounded-full text-xs">
                          {product.category}
                        </span>
                      </div>
                      {product.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          {product.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {hasPrice && sellerProduct ? (
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Your Price</span>
                        {sellerProduct.isActive && (
                          <span className="ml-auto px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-full text-xs">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                        {formatPrice(sellerProduct.price)}
                      </p>
                      {sellerProduct.stock !== undefined && (
                        <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                          Stock: {sellerProduct.stock}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="mb-4">
                      <p className="text-sm text-gray-500 dark:text-gray-500">
                        No price set yet
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddProduct(product)}
                      className={`flex-1 px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                        hasPrice
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      {hasPrice ? (
                        <>
                          <Edit className="h-4 w-4" />
                          Edit Price
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4" />
                          Set Price
                        </>
                      )}
                    </button>
                    {hasPrice && sellerProduct && (
                      <button
                        onClick={() => handleToggleActive(sellerProduct._id, sellerProduct.isActive)}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          sellerProduct.isActive
                            ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                            : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                      >
                        {sellerProduct.isActive ? (
                          <XCircle className="h-4 w-4" />
                        ) : (
                          <CheckCircle className="h-4 w-4" />
                        )}
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Add/Edit Price Modal */}
        <AnimatePresence>
          {showAddModal && selectedProduct && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-gray-900 rounded-xl p-6 max-w-md w-full shadow-xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {getSellerProduct(selectedProduct._id) ? 'Edit Price' : 'Set Price'}
                  </h3>
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      setSelectedProduct(null);
                      setPrice('');
                      setStock('');
                    }}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {selectedProduct.name}
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded-full text-xs">
                      {selectedProduct.operator}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 rounded-full text-xs">
                      {selectedProduct.category}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Price (BDT) *
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="Enter price"
                        min="0"
                        step="0.01"
                        required
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Stock (Optional)
                    </label>
                    <input
                      type="number"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      placeholder="Enter stock quantity"
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      setSelectedProduct(null);
                      setPrice('');
                      setStock('');
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSavePrice}
                    disabled={submitting || !price}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save Price
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
