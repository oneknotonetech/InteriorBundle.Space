// Data/features.ts
export interface Feature {
    id: string;
    icon: string;
    title: string;
    description: string;
    highlight?: boolean;
  }
  
  export const features: Feature[] = [
    {
      id: "complete-bundles",
      icon: "📦",
      title: "Complete Bundles",
      description: "50+ carefully curated products for your entire space transformation",
      highlight: true
    },
    {
      id: "expert-curation",
      icon: "🎨",
      title: "Expert Curation",
      description: "Interior designers hand-pick every item to ensure perfect harmony",
      highlight: true
    },
    {
      id: "premium-quality",
      icon: "⭐",
      title: "Premium Quality",
      description: "Only the finest materials and craftsmanship make it to our bundles"
    },
    {
      id: "nationwide-delivery",
      icon: "🚚",
      title: "Nationwide Delivery",
      description: "Free delivery and professional installation across India"
    },
    {
      id: "design-consultation",
      icon: "💡",
      title: "Design Consultation", 
      description: "Complimentary consultation with our interior design experts"
    },
    {
      id: "warranty-support",
      icon: "🛡️",
      title: "Comprehensive Warranty",
      description: "Extended warranty coverage on all bundle products"
    }
  ];