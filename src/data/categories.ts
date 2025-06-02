// Data/categories.ts
export interface Category {
    id: string;
    name: string;
    description: string;
    image: string;
    bundleCount: number;
    icon: string;
  }
  
  export const categories: Category[] = [
    {
      id: "modern",
      name: "Modern",
      description: "Contemporary designs for the modern lifestyle",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
      bundleCount: 12,
      icon: "🏢"
    },
    {
      id: "rustic",
      name: "Rustic",
      description: "Warm, vintage-inspired countryside charm",
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
      bundleCount: 8,
      icon: "🏡"
    },
    {
      id: "luxury",
      name: "Luxury",
      description: "Premium materials and sophisticated elegance",
      image: "https://images.unsplash.com/photo-1565182999561-18d7dc61c393?w=400&h=300&fit=crop",
      bundleCount: 6,
      icon: "👑"
    },
    {
      id: "scandinavian",
      name: "Scandinavian",
      description: "Minimalist Nordic design with natural elements",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
      bundleCount: 10,
      icon: "🌲"
    },
    {
      id: "industrial",
      name: "Industrial",
      description: "Urban loft style with raw materials",
      image: "https://images.unsplash.com/photo-1571508601891-ca5e7a713859?w=400&h=300&fit=crop",
      bundleCount: 7,
      icon: "🏭"
    },
    {
      id: "coastal",
      name: "Coastal",
      description: "Relaxed seaside living with natural textures",
      image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=300&fit=crop",
      bundleCount: 5,
      icon: "🌊"
    }
  ];