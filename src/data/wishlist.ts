export interface WishlistItem {
    id: number;
    title: string;
    description: string;
    image: string;
    price: string;
    originalPrice: string;
    rating: number;
    downloads: string;
    tags: string[];
    isLiked: boolean;
  }

  
export const wishlistItems = [
      {
        id: 1,
        title: "Modern Dashboard UI Kit",
        description: "Complete dashboard interface with 50+ components, dark/light mode support, and responsive design.",
        price: "$49",
        originalPrice: "$89",
        image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=250&fit=crop",
        rating: 4.8,
        downloads: "2.3k",
        tags: ["Dashboard", "UI Kit", "React"],
        isLiked: true
      },
      {
        id: 2,
        title: "E-commerce Mobile App",
        description: "Full e-commerce mobile app design with shopping cart, payment integration, and user profiles.",
        price: "$65",
        originalPrice: "$120",
        image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=250&fit=crop",
        rating: 4.9,
        downloads: "1.8k",
        tags: ["Mobile", "E-commerce", "Flutter"],
        isLiked: true
      },
      {
        id: 3,
        title: "SaaS Landing Page Bundle",
        description: "Professional landing page templates for SaaS products with conversion-optimized layouts.",
        price: "$35",
        originalPrice: "$70",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop",
        rating: 4.7,
        downloads: "3.1k",
        tags: ["Landing Page", "SaaS", "HTML"],
        isLiked: true
      },
      {
        id: 4,
        title: "Social Media Dashboard",
        description: "Analytics dashboard for social media management with charts, metrics, and real-time data.",
        price: "$55",
        originalPrice: "$95",
        image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=250&fit=crop",
        rating: 4.6,
        downloads: "1.5k",
        tags: ["Dashboard", "Analytics", "Vue"],
        isLiked: true
      }
    ];

