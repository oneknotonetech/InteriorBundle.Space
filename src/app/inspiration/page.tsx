'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, ChevronLeft, ChevronRight, Home, Building2, Building } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from 'next/image';
import { InspirationItem } from '@/data/type';
import InteriorInspiration from '@/components/InteriorInspiration';
import ExteriorInspiration from '@/components/ExteriorInspiration';
import CommercialInspiration from '@/components/CommercialInspiration';

const WISHLIST_KEY = 'wishlist';

export default function InspirationPage() {
  const [previewItem, setPreviewItem] = useState<InspirationItem | null>(null);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(WISHLIST_KEY);
      if (stored) return JSON.parse(stored);
    }
    return [];
  });

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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
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
            Discover beautiful design ideas for every space. Save your favorites to your wishlist.
          </p>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="interior" className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm shadow-lg">
              <TabsTrigger value="interior" className="flex items-center gap-2 data-[state=active]:bg-[var(--color-cream)] data-[state=active]:text-[var(--color-black)]">
                <Home className="w-4 h-4" />
                Interior
              </TabsTrigger>
              <TabsTrigger value="exterior" className="flex items-center gap-2 data-[state=active]:bg-[var(--color-cream)] data-[state=active]:text-[var(--color-black)]">
                <Building2 className="w-4 h-4" />
                Exterior
              </TabsTrigger>
              <TabsTrigger value="commercial" className="flex items-center gap-2 data-[state=active]:bg-[var(--color-cream)] data-[state=active]:text-[var(--color-black)]">
                <Building className="w-4 h-4" />
                Commercial
              </TabsTrigger>
            </TabsList>
          </motion.div>

          <AnimatePresence mode="wait">
            <TabsContent value="interior" key="interior">
              <InteriorInspiration 
                wishlistIds={wishlistIds}
                toggleWishlist={toggleWishlist}
                setPreviewItem={setPreviewItem}
                setPreviewIndex={setPreviewIndex}
              />
            </TabsContent>

            <TabsContent value="exterior" key="exterior">
              <ExteriorInspiration 
                wishlistIds={wishlistIds}
                toggleWishlist={toggleWishlist}
                setPreviewItem={setPreviewItem}
                setPreviewIndex={setPreviewIndex}
              />
            </TabsContent>

            <TabsContent value="commercial" key="commercial">
              <CommercialInspiration 
                wishlistIds={wishlistIds}
                toggleWishlist={toggleWishlist}
                setPreviewItem={setPreviewItem}
                setPreviewIndex={setPreviewIndex}
              />
            </TabsContent>
          </AnimatePresence>
        </Tabs>

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