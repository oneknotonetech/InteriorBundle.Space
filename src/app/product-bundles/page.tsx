'use client'

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Heart, Star, Package, ShoppingBag } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Define TypeScript types
type BundleStyle = "Rustic" | "Modern" | "Contemporary";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  category: string;
  inStock: boolean;
}

interface Bundle {
  id: number;
  title: string;
  image: string;
  style: BundleStyle;
  area: string;
  description: string;
  price: number;
  originalPrice: number;
  favorite: boolean;
  products: Product[];
}

// Product Bundle Modal Component
const ProductCard: React.FC<{ product: Product; index: number }> = ({ product, index }) => {
  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
    >
      <div className="relative">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        {discountPercentage > 0 && (
          <Badge className="absolute top-2 left-2 bg-red-500 text-white">
            -{discountPercentage}%
          </Badge>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-semibold bg-red-600 px-3 py-1 rounded">
              Out of Stock
            </span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 text-sm leading-tight">
            {product.name}
          </h3>
          <Badge variant="secondary" className="ml-2 text-xs">
            {product.category}
          </Badge>
        </div>
        
        <div className="flex items-center mb-3">
          <div className="flex items-center">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm text-gray-600 ml-1">
              {product.rating} ({product.reviewCount})
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-lg text-gray-900">
              ₹{product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                ₹{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ProductBundleModal: React.FC<{ 
  bundle: Bundle | null; 
  isOpen: boolean; 
  onClose: () => void; 
}> = ({ bundle, isOpen, onClose }) => {
  if (!bundle) return null;

  const totalSavings = bundle.originalPrice - bundle.price;
  const savingsPercentage = Math.round((totalSavings / bundle.originalPrice) * 100);
  const inStockCount = bundle.products.filter(p => p.inStock).length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="border-b border-gray-200 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <ShoppingBag className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-gray-900">
                  {bundle.title}
                </DialogTitle>
                <p className="text-gray-600 text-sm">
                  {bundle.products.length} items • {inStockCount} in stock • {bundle.style} Style
                </p>
              </div>
            </div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 mt-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-4">
                  <div className="text-2xl font-bold text-gray-900">
                    ₹{bundle.price.toLocaleString()}
                  </div>
                  <div className="text-lg text-gray-500 line-through">
                    ₹{bundle.originalPrice.toLocaleString()}
                  </div>
                  <Badge className="bg-green-500 text-white text-sm">
                    Save {savingsPercentage}%
                  </Badge>
                </div>
                <p className="text-green-600 font-semibold text-sm mt-1">
                  You save ₹{totalSavings.toLocaleString()}!
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Bundle Price</p>
                <p className="text-lg font-semibold text-gray-900">
                  ₹{Math.round(bundle.price / bundle.products.length).toLocaleString()} avg per item
                </p>
              </div>
            </div>
          </motion.div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {bundle.products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </motion.div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="border-t border-gray-200 pt-4 flex items-center justify-between"
        >
          <div className="text-sm text-gray-600">
            {inStockCount < bundle.products.length && (
              <span className="text-amber-600 font-medium">
                ⚠️ {bundle.products.length - inStockCount} item(s) currently out of stock
              </span>
            )}
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Add Bundle to Cart
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default function InteriorBundles() {
  // Enhanced sample data with products for each bundle
  const [bundles, setBundles] = useState<Bundle[]>([
    {
      id: 1,
      title: "Cozy Pepperfry Rustic",
      image: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?q=80&w=400&h=300&auto=format&fit=crop",
      style: "Rustic",
      area: "A collection of furniture and decor for a comfortable living room",
      description: "",
      price: 58100,
      originalPrice: 75000,
      favorite: false,
      products: [
        {
          id: "r1",
          name: "Rustic Wood Coffee Table",
          price: 15000,
          originalPrice: 18000,
          image: "https://images.unsplash.com/photo-1549497538-303791108f95?w=300&h=300&fit=crop",
          rating: 4.7,
          reviewCount: 124,
          category: "Furniture",
          inStock: true
        },
        {
          id: "r2",
          name: "Vintage Leather Armchair",
          price: 22000,
          originalPrice: 28000,
          image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop",
          rating: 4.8,
          reviewCount: 89,
          category: "Seating",
          inStock: true
        },
        {
          id: "r3",
          name: "Rustic Floor Lamp",
          price: 8500,
          originalPrice: 12000,
          image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
          rating: 4.5,
          reviewCount: 156,
          category: "Lighting",
          inStock: false
        },
        {
          id: "r4",
          name: "Woven Storage Basket",
          price: 3200,
          originalPrice: 4500,
          image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop",
          rating: 4.6,
          reviewCount: 78,
          category: "Storage",
          inStock: true
        },
        {
          id: "r5",
          name: "Rustic Wall Art Set",
          price: 9400,
          originalPrice: 12500,
          image: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=300&h=300&fit=crop",
          rating: 4.4,
          reviewCount: 92,
          category: "Decor",
          inStock: true
        }
      ]
    },
    {
      id: 2,
      title: "Modern Kitchen",
      image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=400&h=300&auto=format&fit=crop",
      style: "Modern",
      area: "Everything you need for a stylish and functional kitchen",
      description: "",
      price: 91300,
      originalPrice: 120000,
      favorite: false,
      products: [
        {
          id: "k1",
          name: "Modern Kitchen Island",
          price: 35000,
          originalPrice: 45000,
          image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop",
          rating: 4.9,
          reviewCount: 234,
          category: "Furniture",
          inStock: true
        },
        {
          id: "k2",
          name: "Smart Appliance Set",
          price: 28000,
          originalPrice: 35000,
          image: "https://images.unsplash.com/photo-1556909275-ebb19e5ba9a9?w=300&h=300&fit=crop",
          rating: 4.7,
          reviewCount: 167,
          category: "Appliances",
          inStock: true
        },
        {
          id: "k3",
          name: "Designer Bar Stools",
          price: 12000,
          originalPrice: 16000,
          image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop",
          rating: 4.6,
          reviewCount: 98,
          category: "Seating",
          inStock: true
        },
        {
          id: "k4",
          name: "Modern Pendant Lights",
          price: 8500,
          originalPrice: 12000,
          image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
          rating: 4.8,
          reviewCount: 145,
          category: "Lighting",
          inStock: true
        },
        {
          id: "k5",
          name: "Kitchen Storage Solutions",
          price: 7800,
          originalPrice: 12000,
          image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop",
          rating: 4.5,
          reviewCount: 76,
          category: "Storage",
          inStock: false
        }
      ]
    },
    {
      id: 3,
      title: "Contemporary Bedroom",
      image: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=400&h=300&auto=format&fit=crop",
      style: "Contemporary",
      area: "Create a serene and stylish bedroom with this bundle",
      description: "",
      price: 70550,
      originalPrice: 95000,
      favorite: false,
      products: [
        {
          id: "b1",
          name: "Platform Bed Frame",
          price: 25000,
          originalPrice: 32000,
          image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=300&h=300&fit=crop",
          rating: 4.8,
          reviewCount: 189,
          category: "Furniture",
          inStock: true
        },
        {
          id: "b2",
          name: "Memory Foam Mattress",
          price: 18000,
          originalPrice: 25000,
          image: "https://images.unsplash.com/photo-1541558869434-2840d308329a?w=300&h=300&fit=crop",
          rating: 4.9,
          reviewCount: 267,
          category: "Bedding",
          inStock: true
        },
        {
          id: "b3",
          name: "Bedside Tables Set",
          price: 12000,
          originalPrice: 16000,
          image: "https://images.unsplash.com/photo-1549497538-303791108f95?w=300&h=300&fit=crop",
          rating: 4.6,
          reviewCount: 134,
          category: "Furniture",
          inStock: true
        },
        {
          id: "b4",
          name: "Contemporary Wardrobe",
          price: 15550,
          originalPrice: 22000,
          image: "https://images.unsplash.com/photo-1595520046846-f06c46f5567f?w=300&h=300&fit=crop",
          rating: 4.7,
          reviewCount: 156,
          category: "Storage",
          inStock: true
        }
      ]
    },
    {
      id: 4,
      title: "Modern Dining Room",
      image: "https://images.unsplash.com/photo-1615874959474-d609969a20ed?q=80&w=400&h=300&auto=format&fit=crop",
      style: "Modern",
      area: "Gather around this stylish dining set",
      description: "",
      price: 70550,
      originalPrice: 90000,
      favorite: false,
      products: [
        {
          id: "d1",
          name: "Modern Dining Table",
          price: 28000,
          originalPrice: 35000,
          image: "https://images.unsplash.com/photo-1549497538-303791108f95?w=300&h=300&fit=crop",
          rating: 4.8,
          reviewCount: 178,
          category: "Furniture",
          inStock: true
        },
        {
          id: "d2",
          name: "Designer Dining Chairs",
          price: 24000,
          originalPrice: 30000,
          image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop",
          rating: 4.7,
          reviewCount: 145,
          category: "Seating",
          inStock: true
        },
        {
          id: "d3",
          name: "Statement Chandelier",
          price: 12000,
          originalPrice: 15000,
          image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
          rating: 4.9,
          reviewCount: 89,
          category: "Lighting",
          inStock: true
        },
        {
          id: "d4",
          name: "Dining Room Sideboard",
          price: 6550,
          originalPrice: 10000,
          image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop",
          rating: 4.5,
          reviewCount: 67,
          category: "Storage",
          inStock: false
        }
      ]
    },
    {
      id: 5,
      title: "Sleek Modular Kitchen",
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=400&h=300&auto=format&fit=crop",
      style: "Contemporary",
      area: "Upgrade your kitchen with these sleek modular surfaces",
      description: "",
      price: 99600,
      originalPrice: 130000,
      favorite: false,
      products: [
        {
          id: "mk1",
          name: "Modular Kitchen Cabinets",
          price: 45000,
          originalPrice: 60000,
          image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop",
          rating: 4.9,
          reviewCount: 234,
          category: "Cabinets",
          inStock: true
        },
        {
          id: "mk2",
          name: "Quartz Countertops",
          price: 25000,
          originalPrice: 32000,
          image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=300&h=300&fit=crop",
          rating: 4.8,
          reviewCount: 167,
          category: "Surfaces",
          inStock: true
        },
        {
          id: "mk3",
          name: "Built-in Appliances",
          price: 18000,
          originalPrice: 24000,
          image: "https://images.unsplash.com/photo-1556909275-ebb19e5ba9a9?w=300&h=300&fit=crop",
          rating: 4.7,
          reviewCount: 145,
          category: "Appliances",
          inStock: true
        },
        {
          id: "mk4",
          name: "Smart Storage Solutions",
          price: 11600,
          originalPrice: 14000,
          image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop",
          rating: 4.6,
          reviewCount: 98,
          category: "Storage",
          inStock: true
        }
      ]
    },
    {
      id: 6,
      title: "Minimalist Bedroom Wardrobe",
      image: "https://images.unsplash.com/photo-1595520046846-f06c46f5567f?q=80&w=400&h=300&auto=format&fit=crop",
      style: "Contemporary",
      area: "Keep your bedroom organized with this minimalist wardrobe",
      description: "",
      price: 74700,
      originalPrice: 95000,
      favorite: false,
      products: [
        {
          id: "w1",
          name: "Walk-in Wardrobe System",
          price: 35000,
          originalPrice: 45000,
          image: "https://images.unsplash.com/photo-1595520046846-f06c46f5567f?w=300&h=300&fit=crop",
          rating: 4.8,
          reviewCount: 189,
          category: "Storage",
          inStock: true
        },
        {
          id: "w2",
          name: "Sliding Mirror Doors",
          price: 18000,
          originalPrice: 23000,
          image: "https://images.unsplash.com/photo-1549497538-303791108f95?w=300&h=300&fit=crop",
          rating: 4.7,
          reviewCount: 134,
          category: "Doors",
          inStock: true
        },
        {
          id: "w3",
          name: "Interior Organization",
          price: 12500,
          originalPrice: 16000,
          image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop",
          rating: 4.6,
          reviewCount: 98,
          category: "Organization",
          inStock: true
        },
        {
          id: "w4",
          name: "LED Wardrobe Lighting",
          price: 9200,
          originalPrice: 11000,
          image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
          rating: 4.9,
          reviewCount: 76,
          category: "Lighting",
          inStock: false
        }
      ]
    },
    {
      id: 7,
      title: "Elegant Dining Room Tiles",
      image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?q=80&w=400&h=300&auto=format&fit=crop",
      style: "Contemporary",
      area: "Add an elegant touch to your dining area with these flooring tiles",
      description: "",
      price: 33200,
      originalPrice: 45000,
      favorite: false,
      products: [
        {
          id: "t1",
          name: "Marble Effect Tiles",
          price: 15000,
          originalPrice: 20000,
          image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=300&h=300&fit=crop",
          rating: 4.8,
          reviewCount: 145,
          category: "Flooring",
          inStock: true
        },
        {
          id: "t2",
          name: "Designer Border Tiles",
          price: 8000,
          originalPrice: 12000,
          image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=300&h=300&fit=crop",
          rating: 4.6,
          reviewCount: 89,
          category: "Accent",
          inStock: true
        },
        {
          id: "t3",
          name: "Premium Grout & Sealant",
          price: 5200,
          originalPrice: 7000,
          image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop",
          rating: 4.5,
          reviewCount: 67,
          category: "Materials",
          inStock: true
        },
        {
          id: "t4",
          name: "Installation Kit",
          price: 5000,
          originalPrice: 6000,
          image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop",
          rating: 4.4,
          reviewCount: 45,
          category: "Tools",
          inStock: true
        }
      ]
    }
  ]);

  // Modal state
  const [selectedBundle, setSelectedBundle] = useState<Bundle | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Toggle favorite status
  const toggleFavorite = (id: number, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent card click
    setBundles(
      bundles.map((bundle) =>
        bundle.id === id
          ? { ...bundle, favorite: !bundle.favorite }
          : bundle
      )
    );
  };

  // Handle bundle click
  const handleBundleClick = (bundle: Bundle) => {
    setSelectedBundle(bundle);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBundle(null);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="w-full md:w-64 shrink-0">
            <div className="sticky top-4 border border-gray-200 rounded-lg p-4 bg-white">
              <h2 className="font-bold text-lg mb-4">Filters</h2>
              <p className="text-sm text-gray-500 mb-4">Filter product bundles</p>

              <div className="space-y-4">
                <div>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="kitchen">Kitchen</SelectItem>
                      <SelectItem value="bedroom">Bedroom</SelectItem>
                      <SelectItem value="living">Living Room</SelectItem>
                      <SelectItem value="dining">Dining Room</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Price Range (₹)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Prices</SelectItem>
                      <SelectItem value="0-50000">₹0 - ₹50,000</SelectItem>
                      <SelectItem value="50000-75000">₹50,000 - ₹75,000</SelectItem>
                      <SelectItem value="75000-100000">₹75,000 - ₹100,000</SelectItem>
                      <SelectItem value="100000+">₹100,000+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Styles</SelectItem>
                      <SelectItem value="rustic">Rustic</SelectItem>
                      <SelectItem value="modern">Modern</SelectItem>
                      <SelectItem value="contemporary">Contemporary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Area" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Areas</SelectItem>
                      <SelectItem value="kitchen">Kitchen</SelectItem>
                      <SelectItem value="bedroom">Bedroom</SelectItem>
                      <SelectItem value="living">Living Room</SelectItem>
                      <SelectItem value="dining">Dining Room</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Brand" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Brands</SelectItem>
                      <SelectItem value="pepperfry">Pepperfry</SelectItem>
                      <SelectItem value="ikea">IKEA</SelectItem>
                      <SelectItem value="urban">Urban Ladder</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Designer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Designers</SelectItem>
                      <SelectItem value="contemporary">Contemporary Designs</SelectItem>
                      <SelectItem value="minimalist">Minimalist Designs</SelectItem>
                      <SelectItem value="traditional">Traditional Designs</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                className="pl-10 bg-gray-50 border border-gray-200"
                placeholder="Search bundles..."
              />
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bundles.map((bundle) => (
                <motion.div
                  key={bundle.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ y: -5 }}
                  className="h-full cursor-pointer"
                  onClick={() => handleBundleClick(bundle)}
                >
                  <Card className="h-full flex flex-col overflow-hidden border border-gray-200 hover:shadow-md transition-shadow duration-300">
                    <div className="relative">
                      <img
                        src={bundle.image}
                        alt={bundle.title}
                        className="w-full h-48 object-cover"
                      />
                      <button
                        onClick={(e) => toggleFavorite(bundle.id, e)}
                        className="absolute top-3 right-3 p-1.5 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors duration-200"
                      >
                        <Heart
                          size={18}
                          className={bundle.favorite ? "fill-red-500 text-red-500" : "text-gray-500"}
                        />
                      </button>
                      <div className="absolute bottom-3 left-3">
                        <Badge className="bg-blue-600 text-white">
                          <Package className="w-3 h-3 mr-1" />
                          {bundle.products.length} items
                        </Badge>
                      </div>
                    </div>
                    <CardHeader className="pb-2">
                      <h3 className="font-semibold text-lg">{bundle.title}</h3>
                    </CardHeader>
                    <CardContent className="pb-2 pt-0 flex-1">
                      <div className="text-sm text-gray-500 mb-1">
                        <span className="font-medium">Style:</span> {bundle.style}
                      </div>
                      <div className="text-sm text-gray-500 mb-3">
                        <span className="font-medium">Area:</span> {bundle.area}
                      </div>
                      <div className="flex items-center text-sm">
                        <span className="text-green-600 font-semibold">
                          Save ₹{(bundle.originalPrice - bundle.price).toLocaleString()}
                        </span>
                        <span className="text-gray-400 ml-2">
                          ({Math.round(((bundle.originalPrice - bundle.price) / bundle.originalPrice) * 100)}% off)
                        </span>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t border-gray-100 pt-3">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center space-x-2">
                          <p className="font-bold text-lg">₹{bundle.price.toLocaleString()}</p>
                          <p className="text-sm text-gray-500 line-through">₹{bundle.originalPrice.toLocaleString()}</p>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            handleBundleClick(bundle);
                          }}
                        >
                          View Details
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Product Bundle Modal */}
      <ProductBundleModal 
        bundle={selectedBundle}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
}