// Data/bundles.ts
export interface ProductBundle {
    id: string;
    name: string;
    description: string;
    price: number;
    originalPrice: number;
    discount: number;
    rating: number;
    reviews: number;
    image: string;
    category: string;
    isBestseller: boolean;
    isNewArrival: boolean;
    productCount: number;
    tags: string[];
  }
  
  export const productBundles: ProductBundle[] = [
    {
      id: "modern-minimalist",
      name: "Modern Minimalist Living",
      description: "Clean lines and contemporary elegance for the modern home",
      price: 899999,
      originalPrice: 1299999,
      discount: 31,
      rating: 4.8,
      reviews: 124,
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
      category: "Modern",
      isBestseller: true,
      isNewArrival: false,
      productCount: 52,
      tags: ["Contemporary", "Minimal", "Urban"]
    },
    {
      id: "rustic-farmhouse",
      name: "Rustic Farmhouse Charm",
      description: "Warm wood tones and vintage appeal for cozy living",
      price: 759999,
      originalPrice: 1099999,
      discount: 31,
      rating: 4.7,
      reviews: 89,
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
      category: "Rustic",
      isBestseller: true,
      isNewArrival: false,
      productCount: 48,
      tags: ["Farmhouse", "Vintage", "Cozy"]
    },
    {
      id: "luxury-royal",
      name: "Luxury Royal Collection",
      description: "Opulent designs with premium materials for sophisticated spaces",
      price: 1299999,
      originalPrice: 1899999,
      discount: 32,
      rating: 4.9,
      reviews: 67,
      image: "https://images.unsplash.com/photo-1565182999561-18d7dc61c393?w=800&h=600&fit=crop",
      category: "Luxury",
      isBestseller: true,
      isNewArrival: false,
      productCount: 55,
      tags: ["Premium", "Elegant", "Sophisticated"]
    },
    {
      id: "scandinavian-simple",
      name: "Scandinavian Simplicity",
      description: "Light woods and clean Nordic design for peaceful living",
      price: 679999,
      originalPrice: 999999,
      discount: 32,
      rating: 4.6,
      reviews: 156,
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
      category: "Scandinavian",
      isBestseller: false,
      isNewArrival: true,
      productCount: 46,
      tags: ["Nordic", "Light", "Natural"]
    },
    {
      id: "industrial-loft",
      name: "Industrial Loft Style",
      description: "Raw materials with urban sophistication",
      price: 849999,
      originalPrice: 1199999,
      discount: 29,
      rating: 4.5,
      reviews: 78,
      image: "https://images.unsplash.com/photo-1571508601891-ca5e7a713859?w=800&h=600&fit=crop",
      category: "Industrial",
      isBestseller: false,
      isNewArrival: true,
      productCount: 50,
      tags: ["Urban", "Raw", "Contemporary"]
    },
    {
      id: "mediterranean-coastal",
      name: "Mediterranean Coastal",
      description: "Seaside charm with natural textures and coastal vibes",
      price: 729999,
      originalPrice: 1049999,
      discount: 30,
      rating: 4.4,
      reviews: 92,
      image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&h=600&fit=crop",
      category: "Coastal",
      isBestseller: false,
      isNewArrival: false,
      productCount: 49,
      tags: ["Coastal", "Natural", "Relaxed"]
    }
  ];
  