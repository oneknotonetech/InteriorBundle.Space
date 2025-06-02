'use client'

import { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Heart } from "lucide-react";
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

// Define TypeScript types
type BundleStyle = "Rustic" | "Modern" | "Contemporary";

interface Bundle {
  id: number;
  title: string;
  image: string;
  style: BundleStyle;
  area: string;
  description: string;
  price: number;
  favorite: boolean;
}

export default function InteriorBundles() {
  // Sample data for bundles
  const [bundles, setBundles] = useState<Bundle[]>([
    {
      id: 1,
      title: "Cozy Pepperfry Rustic",
      image: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?q=80&w=400&h=300&auto=format&fit=crop",
      style: "Rustic",
      area: "A collection of furniture and decor for a comfortable living room",
      description: "",
      price: 58100,
      favorite: false,
    },
    {
      id: 2,
      title: "Modern Kitchen",
      image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=400&h=300&auto=format&fit=crop",
      style: "Modern",
      area: "Everything you need for a stylish and functional kitchen",
      description: "",
      price: 91300,
      favorite: false,
    },
    {
      id: 3,
      title: "Contemporary Bedroom",
      image: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=400&h=300&auto=format&fit=crop",
      style: "Contemporary",
      area: "Create a serene and stylish bedroom with this bundle",
      description: "",
      price: 70550,
      favorite: false,
    },
    {
      id: 4,
      title: "Modern Dining Room",
      image: "https://images.unsplash.com/photo-1615874959474-d609969a20ed?q=80&w=400&h=300&auto=format&fit=crop",
      style: "Modern",
      area: "Gather around this stylish dining set",
      description: "",
      price: 70550,
      favorite: false,
    },
    {
      id: 5,
      title: "Sleek Modular Kitchen",
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=400&h=300&auto=format&fit=crop",
      style: "Contemporary",
      area: "Upgrade your kitchen with these sleek modular surfaces",
      description: "",
      price: 99600,
      favorite: false,
    },
    {
      id: 6,
      title: "Minimalist Bedroom Wardrobe",
      image: "https://images.unsplash.com/photo-1595520046846-f06c46f5567f?q=80&w=400&h=300&auto=format&fit=crop",
      style: "Contemporary",
      area: "Keep your bedroom organized with this minimalist wardrobe",
      description: "",
      price: 74700,
      favorite: false,
    },
    {
      id: 7,
      title: "Elegant Dining Room Tiles",
      image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?q=80&w=400&h=300&auto=format&fit=crop",
      style: "Contemporary",
      area: "Add an elegant touch to your dining area with these flooring tiles",
      description: "",
      price: 33200,
      favorite: false,
    },
  ]);

  // Toggle favorite status
  const toggleFavorite = (id: number) => {
    setBundles(
      bundles.map((bundle) =>
        bundle.id === id
          ? { ...bundle, favorite: !bundle.favorite }
          : bundle
      )
    );
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
                  className="h-full"
                >
                  <Card className="h-full flex flex-col overflow-hidden border border-gray-200 hover:shadow-md transition-shadow duration-300">
                    <div className="relative">
                      <img
                        src={bundle.image}
                        alt={bundle.title}
                        className="w-full h-48 object-cover"
                      />
                      <button
                        onClick={() => toggleFavorite(bundle.id)}
                        className="absolute top-3 right-3 p-1.5 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors duration-200"
                      >
                        <Heart
                          size={18}
                          className={bundle.favorite ? "fill-red-500 text-red-500" : "text-gray-500"}
                        />
                      </button>
                    </div>
                    <CardHeader className="pb-2">
                      <h3 className="font-semibold text-lg">{bundle.title}</h3>
                    </CardHeader>
                    <CardContent className="pb-2 pt-0 flex-1">
                      <div className="text-sm text-gray-500 mb-1">
                        <span className="font-medium">Style:</span> {bundle.style}
                      </div>
                      <div className="text-sm text-gray-500">
                        <span className="font-medium">Area:</span> {bundle.area}
                      </div>
                    </CardContent>
                    <CardFooter className="border-t border-gray-100 pt-3">
                      <p className="font-bold text-lg">₹{bundle.price.toLocaleString()}</p>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}