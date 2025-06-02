// Data/testimonials.ts
export interface Testimonial {
    id: string;
    name: string;
    location: string;
    rating: number;
    comment: string;
    avatar: string;
    bundlePurchased: string;
    date: string;
  }
  
  export const testimonials: Testimonial[] = [
    {
      id: "testimonial-1",
      name: "Sarah Johnson",
      location: "Mumbai, Maharashtra",
      rating: 5,
      comment: "The Modern Minimalist bundle completely transformed our living space. Every piece fits perfectly together, and the quality is outstanding. Best investment we've made for our home!",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b332c3ef?w=64&h=64&fit=crop&crop=face",
      bundlePurchased: "Modern Minimalist Living",
      date: "2024-01-15"
    },
    {
      id: "testimonial-2", 
      name: "Michael Chen",
      location: "Bangalore, Karnataka",
      rating: 5,
      comment: "Incredible value for money. Getting all 52 items in one bundle saved us months of shopping around. The delivery was seamless and everything arrived in perfect condition.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face",
      bundlePurchased: "Scandinavian Simplicity",
      date: "2024-01-08"
    },
    {
      id: "testimonial-3",
      name: "Emily Rodriguez",
      location: "Delhi, NCR",
      rating: 5,
      comment: "The Luxury Royal Collection exceeded our expectations. The attention to detail and craftsmanship is remarkable. Our guests always compliment our interior design.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face",
      bundlePurchased: "Luxury Royal Collection",
      date: "2023-12-22"
    }
  ];