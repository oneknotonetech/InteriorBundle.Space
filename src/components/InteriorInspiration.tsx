'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Search, Filter } from 'lucide-react';
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
import { InspirationItem } from '@/data/type';
import { roomCategories } from '@/data/roomCategories';
import { inspirationItems } from '@/data/inspirationItems';

interface InteriorInspirationProps {
  wishlistIds: string[];
  toggleWishlist: (id: string) => void;
  setPreviewItem: (item: InspirationItem | null) => void;
  setPreviewIndex: (index: number) => void;
}

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

const InteriorInspiration: React.FC<InteriorInspirationProps> = ({
  wishlistIds,
  toggleWishlist,
  setPreviewItem,
  setPreviewIndex
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('living-room');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredItems, setFilteredItems] = useState<InspirationItem[]>([]);

  useEffect(() => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      setFilteredItems(
        inspirationItems.filter((item: InspirationItem) =>
          item.category === selectedCategory &&
          (item.title.toLowerCase().includes(query) ||
            item.tags?.some((tag: string) => tag.toLowerCase().includes(query)) ||
            item.description?.toLowerCase().includes(query))
        )
      );
    } else {
      setFilteredItems(inspirationItems.filter((item: InspirationItem) => item.category === selectedCategory));
    }
  }, [selectedCategory, searchQuery]);

  return (
    <>
      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
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
      </motion.div>

      {/* Room Categories */}
      <motion.div 
        className="mb-10 overflow-x-auto no-scrollbar"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <motion.div 
          className="flex space-x-2 min-w-full py-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {roomCategories.map((category) => (
            <motion.button
              key={category.id}
              variants={containerVariants}
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
      </motion.div>

      {/* Content Grid */}
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
    </>
  );
};

export default InteriorInspiration;
