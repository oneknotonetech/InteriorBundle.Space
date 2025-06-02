'use client'

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Star, Download, Eye, Trash2 } from 'lucide-react';
import { wishlistItems as initialWishlistItems } from '@/data/wishlist';

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<typeof initialWishlistItems[0][]>(initialWishlistItems);

  const removeFromWishlist = (id: number) => {
    setWishlistItems(prev => prev.filter(item => item.id !== id));
  };

  const toggleLike = (id: number) => {
    setWishlistItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, isLiked: !item.isLiked } : item
      )
    );
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

  const heartVariants = {
    liked: { 
      scale: [1, 1.3, 1], 
      transition: { duration: 0.3 } 
    },
    unliked: { 
      scale: 1,
      transition: { duration: 0.2 } 
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
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-black transition-colors duration-300"
                >
                  {/* Image Container */}
                  <div className="relative group">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
                    
                    {/* Action buttons overlay */}
                    <div className="absolute top-3 right-3 flex space-x-2">
                      <motion.button
                        variants={heartVariants}
                        animate={item.isLiked ? "liked" : "unliked"}
                        onClick={() => toggleLike(item.id)}
                        className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                          item.isLiked 
                            ? 'bg-black text-white' 
                            : 'bg-white/80 text-gray-600 hover:text-black'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${item.isLiked ? 'fill-current' : ''}`} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => removeFromWishlist(item.id)}
                        className="p-2 rounded-full bg-white/80 text-gray-600 hover:text-black backdrop-blur-sm transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>

                    {/* Quick action buttons */}
                    <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex space-x-2">
                        <button className="p-2 bg-white/90 rounded-full text-gray-700 hover:bg-white transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 bg-black rounded-full text-white hover:bg-gray-800 transition-colors">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
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

                    {/* Stats */}
                    <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-gray-400 text-gray-400" />
                        <span>{item.rating}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Download className="w-4 h-4" />
                        <span>{item.downloads}</span>
                      </div>
                    </div>

                    {/* Price and CTA */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-black">
                          {item.price}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          {item.originalPrice}
                        </span>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
                      >
                        Add to Cart
                      </motion.button>
                    </div>
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
                className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-all duration-300 font-medium"
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