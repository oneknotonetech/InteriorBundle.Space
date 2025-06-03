'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Search, Filter, Sparkles, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Image from 'next/image';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { inspirationItems } from '@/data/inspirationItems';
import { InspirationItem } from '@/data/type';
import { roomCategories } from '@/data/roomCategories';

const WISHLIST_KEY = 'wishlist';

export default function InspirationPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('living-room');
  const [filteredItems, setFilteredItems] = useState<InspirationItem[]>([]);
  const items = inspirationItems;
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [previewItem, setPreviewItem] = useState<InspirationItem | null>(null);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(WISHLIST_KEY);
      if (stored) return JSON.parse(stored);
    }
    return [];
  });

  useEffect(() => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      setFilteredItems(
        items.filter(item => 
          (item.category === selectedCategory) && 
          (item.title.toLowerCase().includes(query) || 
           item.tags?.some(tag => tag.toLowerCase().includes(query)) ||
           item.description?.toLowerCase().includes(query))
        )
      );
    } else {
      setFilteredItems(items.filter(item => item.category === selectedCategory));
    }
  }, [selectedCategory, items, searchQuery]);

  // Sync wishlistIds to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlistIds));
    }
  }, [wishlistIds]);

  // Listen for storage changes (sync across tabs/pages)
  useEffect(() => {
    const onStorage = () => {
      const stored = localStorage.getItem(WISHLIST_KEY);
      if (stored) setWishlistIds(JSON.parse(stored));
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const toggleWishlist = (id: string) => {
    setWishlistIds(prev => {
      let updated: string[];
      if (prev.includes(id)) {
        updated = prev.filter(wid => wid !== id);
      } else {
        updated = [...prev, id];
      }
      return updated;
    });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  // Modal navigation handlers
  const handlePrev = () => {
    if (!previewItem) return;
    setPreviewIndex((prev) => (prev === 0 ? previewItem.images.length - 1 : prev - 1));
  };
  const handleNext = () => {
    if (!previewItem) return;
    setPreviewIndex((prev) => (prev === previewItem.images.length - 1 ? 0 : prev + 1));
  };
  const handleClose = () => {
    setPreviewItem(null);
    setPreviewIndex(0);
  };

  return (
    <div 
      className="min-h-screen bg-gradient-to-b from-gray-50 to-white"
      style={{ fontFamily: 'Poppins, sans-serif' }}
    >
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header Section */}
        <motion.div 
          className="mb-12 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="inline-flex items-center justify-center gap-2 mb-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Sparkles className="text-amber-500" size={24} />
            <h1 className="text-4xl font-bold">Find Your Inspiration</h1>
            <Sparkles className="text-amber-500" size={24} />
          </motion.div>
          <p className="text-gray-500 max-w-xl mx-auto">
            Discover beautiful design ideas for every room in your home. Save your favorites to your wishlist.
          </p>
        </motion.div>

        {/* Search and Filter */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              className="pl-12 py-6 rounded-full shadow-sm"
              placeholder="Search for inspiration by name, style, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                  >
                    <Filter className="text-gray-400" size={18} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Advanced Filters</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Room Categories */}
        <div className="mb-10 overflow-x-auto no-scrollbar">
          <motion.div 
            className="flex space-x-2 min-w-full py-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {roomCategories.map((category) => (
              <motion.button
                key={category.id}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className={`px-6 py-3 rounded-full whitespace-nowrap cursor-pointer text-sm font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'bg-black text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.label}
              </motion.button>
            ))}
          </motion.div>
        </div>

        {/* Inspiration Items Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <motion.div 
                  key={item.id} 
                  variants={itemVariants}
                  whileHover={{ y: -8 }}
                  className="h-full"
                >
                  <Card className="h-full flex flex-col overflow-hidden rounded-xl border-none shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
                    onClick={() => { setPreviewItem(item); setPreviewIndex(0); }}
                  >
                    <div className="relative h-[300px] w-full overflow-hidden">
                      <Image
                        src={item.imageUrl || item.images[0]}
                        alt={item.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        loading="lazy"
                        width={400}
                        height={300}
                      />
                      <div className="absolute top-3 right-3 z-10">
                        <motion.button
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={e => { e.stopPropagation(); toggleWishlist(item.id); }}
                          className={`p-2 rounded-full ${
                            wishlistIds.includes(item.id)
                              ? 'bg-red-50 text-red-500'
                              : 'bg-white/80 text-gray-500 hover:text-red-500'
                          } backdrop-blur-sm shadow-sm`}
                        >
                          <Heart 
                            size={16} 
                            className={wishlistIds.includes(item.id) ? "fill-red-500" : ""} 
                          />
                        </motion.button>
                      </div>
                    </div>
                    <CardContent className="pt-4 pb-2">
                      <h3 className="font-medium text-lg">{item.title}</h3>
                      {item.tags && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {item.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="pt-0 mt-auto">
                      <Button 
                        variant="outline" 
                        className="w-full flex items-center justify-center gap-2"
                        onClick={e => { e.stopPropagation(); toggleWishlist(item.id); }}
                      >
                        <Heart 
                          size={16} 
                          className={wishlistIds.includes(item.id) ? "fill-red-500 text-red-500" : ""} 
                        />
                        {wishlistIds.includes(item.id) ? 'Added to Wishlist' : 'Add to Wishlist'}
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))
            ) : (
              <motion.div 
                className="col-span-full text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p className="text-gray-500">No inspiration found. Try adjusting your search.</p>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Preview Modal */}
        <AnimatePresence>
          {previewItem && (
            <>
              {/* Backdrop */}
              <motion.div
                className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleClose}
              />
              {/* Modal Panel */}
              <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.98, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: 40 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 p-0 overflow-hidden flex flex-col">
                  {/* Close Button */}
                  <button
                    className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white hover:bg-gray-100 border border-gray-200"
                    onClick={handleClose}
                    aria-label="Close preview"
                  >
                    <X className="w-5 h-5 text-black" />
                  </button>
                  {/* Carousel */}
                  <div className="relative w-full h-[350px] bg-black flex items-center justify-center">
                    {/* Left Arrow */}
                    {previewItem.images.length > 1 && (
                      <button
                        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/80 hover:bg-white border border-gray-200"
                        onClick={e => { e.stopPropagation(); handlePrev(); }}
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="w-6 h-6 text-black" />
                      </button>
                    )}
                    {/* Image */}
                    <Image
                      src={previewItem.images[previewIndex]}
                      alt={previewItem.title}
                      width={600}
                      height={350}
                      className="object-contain max-h-[340px] w-auto mx-auto rounded"
                      style={{ background: 'var(--color-white)' }}
                    />
                    {/* Right Arrow */}
                    {previewItem.images.length > 1 && (
                      <button
                        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/80 hover:bg-white border border-gray-200"
                        onClick={e => { e.stopPropagation(); handleNext(); }}
                        aria-label="Next image"
                      >
                        <ChevronRight className="w-6 h-6 text-black" />
                      </button>
                    )}
                    {/* Image Indicators */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                      {previewItem.images.map((img, idx) => (
                        <button
                          key={img}
                          className={`w-2.5 h-2.5 rounded-full border border-black transition-all ${
                            idx === previewIndex ? 'bg-black' : 'bg-white'
                          }`}
                          onClick={e => { e.stopPropagation(); setPreviewIndex(idx); }}
                          aria-label={`Go to image ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                  {/* Details */}
                  <div className="p-6">
                    <h2 className="text-2xl font-bold mb-2 text-black">{previewItem.title}</h2>
                    <p className="text-gray-700 mb-2">{previewItem.description}</p>
                    {previewItem.tags && (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {previewItem.tags.map((tag, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}