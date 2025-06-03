'use client'

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Trash2 } from 'lucide-react';
import { inspirationItems as allInspirations } from '@/data/inspirationItems';

const WISHLIST_KEY = 'wishlist';

export default function WishlistPage() {
  // Initialize wishlist from localStorage or from data
  const [wishlistItems, setWishlistItems] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(WISHLIST_KEY);
      if (stored) {
        const ids = JSON.parse(stored);
        return allInspirations.filter(item => ids.includes(item.id));
      }
    }
    return allInspirations.filter(item => item.inWishlist);
  });

  // Sync wishlist to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlistItems.map(item => item.id)));
    }
  }, [wishlistItems]);

  // Remove from wishlist (local state and demo update to data array)
  const removeFromWishlist = (id: string) => {
    setWishlistItems(prev => prev.filter(item => item.id !== id));
    // Demo: update inWishlist in the data array (not persistent)
    const idx = allInspirations.findIndex(item => item.id === id);
    if (idx !== -1) allInspirations[idx].inWishlist = false;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      x: -100,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white border-b border-gray-200"
      >
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-black mb-2">
                Shortlisted Themes
              </h1>
              <p className="text-gray-600">
                {wishlistItems.length} {wishlistItems.length === 1 ? 'theme' : 'themes'} saved for later
              </p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Heart className="w-4 h-4 text-black" />
              <span>Your favorites</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {wishlistItems.length === 0 ? (
          // Empty State
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16"
          >
            <div className="bg-white rounded-xl border border-gray-200 p-12 max-w-md mx-auto">
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-black mb-2">
                No themes shortlisted yet
              </h3>
              <p className="text-gray-600 mb-6">
                Start exploring our theme collection and save your favorites here!
              </p>
              <button className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors">
                Browse Themes
              </button>
            </div>
          </motion.div>
        ) : (
          // Wishlist Grid
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {wishlistItems.map((item) => (
                <motion.div
                  key={item.id}
                  variants={cardVariants}
                  exit="exit"
                  layout
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:cursor-pointer shadow-md transition-all duration-300"
                >
                  {/* Image Container */}
                  <div className="relative group bg-gray-100">
                    <img
                      src={item.imageUrl || (item.images && item.images[0]) || '/vercel.svg'}
                      alt={item.title}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = '/vercel.svg'; }}
                    />
                    <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="absolute top-3 right-3 p-2 rounded-full bg-white/80 text-gray-600 hover:text-black backdrop-blur-sm transition-colors"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-black line-clamp-2">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {item.description}
                    </p>
                    {/* Tags */}
                    {item.tags && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {item.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Footer Actions */}
        {wishlistItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 text-center"
          >
            <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-black mb-3">
                Ready to purchase?
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Add all shortlisted themes to your cart with one click
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-black cursor-pointer text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-all duration-300 font-medium"
              >
                Add All to Cart
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}