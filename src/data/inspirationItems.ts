// inspirationItems.ts
import { InspirationItem } from './type';

export const inspirationItems: InspirationItem[] = [
  {
    id: '1',
    title: 'Modern Living Room',
    imageUrl: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=800&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80',
      'https://images.unsplash.com/photo-1460518451285-97b6aa326961?w=800&q=80'
    ],
    category: 'living-room',
    tags: ['modern', 'minimalist', 'contemporary'],
    description: 'A sleek, contemporary living room with minimal decor and clean lines.',
    inWishlist: false
  },
  {
    id: '2',
    title: 'Cozy Living Area',
    imageUrl: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=800&q=80',
      'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&q=80',
      'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=800&q=80'
    ],
    category: 'living-room',
    tags: ['cozy', 'warm', 'traditional'],
    description: 'A warm and inviting living space with comfortable furnishings.',
    inWishlist: false
  },
  {
    id: '3',
    title: 'Bright Living Space',
    imageUrl: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=800&q=80',
      'https://images.unsplash.com/photo-1464983953574-0892a716854b?w=800&q=80',
      'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&q=80'
    ],
    category: 'living-room',
    tags: ['bright', 'airy', 'scandinavian'],
    description: 'A light-filled living area with Scandinavian-inspired design elements.',
    inWishlist: false
  },
  {
    id: '4',
    title: 'Master Bedroom Retreat',
    imageUrl: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&q=80',
      'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=800&q=80',
      'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?w=800&q=80'
    ],
    category: 'master-bedroom',
    tags: ['luxurious', 'master bedroom', 'retreat'],
    description: 'A luxurious master bedroom designed for ultimate relaxation.',
    inWishlist: false
  },
  {
    id: '5',
    title: 'Minimalist Bedroom',
    imageUrl: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=800&q=80',
      'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?w=800&q=80',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&q=80'
    ],
    category: 'guest-bedroom',
    tags: ['minimalist', 'calm', 'contemporary'],
    description: 'A serene bedroom with minimalist aesthetics for peaceful rest.',
    inWishlist: false
  },
  {
    id: '6',
    title: 'Kids Bedroom',
    imageUrl: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=800&q=80',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&q=80',
      'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?w=800&q=80'
    ],
    category: 'kids-bedroom',
    tags: ['kids', 'playful', 'colorful'],
    description: 'A fun and functional bedroom perfect for children.',
    inWishlist: false
  },
  {
    id: '7',
    title: 'Modern Kitchen',
    imageUrl: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&q=80',
      'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=800&q=80',
      'https://images.unsplash.com/photo-1464983953574-0892a716854b?w=800&q=80'
    ],
    category: 'main-kitchen',
    tags: ['modern', 'functional', 'sleek'],
    description: 'A state-of-the-art kitchen with modern appliances and clean design.',
    inWishlist: false
  },
  {
    id: '8',
    title: 'Luxury Bathroom',
    imageUrl: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?w=800&q=80',
      'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=800&q=80',
      'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=800&q=80'
    ],
    category: 'master-bathroom',
    tags: ['luxury', 'spa-like', 'elegant'],
    description: 'A spa-inspired bathroom design for ultimate relaxation.',
    inWishlist: false
  },
  {
    id: '9',
    title: 'Compact Bathroom',
    imageUrl: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=800&q=80',
      'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=800&q=80',
      'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?w=800&q=80'
    ],
    category: 'guest-bathroom',
    tags: ['compact', 'efficient', 'modern'],
    description: 'A well-designed compact bathroom that maximizes space.',
    inWishlist: false
  },
  {
    id: '10',
    title: 'Urban Balcony Garden',
    imageUrl: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1464983953574-0892a716854b?w=800&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80',
      'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=800&q=80'
    ],
    category: 'main-balcony',
    tags: ['outdoor', 'garden', 'urban'],
    description: 'A green urban oasis perfect for relaxation and entertaining.',
    inWishlist: false
  },
  {
    id: '11',
    title: 'Contemporary Living Room',
    imageUrl: 'https://placehold.co/400x300',
    images: [
      'https://placehold.co/400x300',
      'https://placehold.co/400x300?text=Contemporary+View+1',
      'https://placehold.co/400x300?text=Contemporary+View+2'
    ],
    category: 'living-room',
    tags: ['contemporary', 'artistic', 'bold'],
    description: 'A bold and artistic living space with contemporary design elements.',
    inWishlist: false
  },
  {
    id: '12',
    title: 'Luxury Master Suite',
    imageUrl: 'https://placehold.co/400x300',
    images: [
      'https://placehold.co/400x300',
      'https://placehold.co/400x300?text=Luxury+Master+View+1',
      'https://placehold.co/400x300?text=Luxury+Master+View+2'
    ],
    category: 'master-bedroom',
    tags: ['luxury', 'spacious', 'elegant'],
    description: 'An elegant master suite with premium finishes and ample space.',
    inWishlist: false
  },
  {
    id: '13',
    title: 'Comfortable Guest Room',
    imageUrl: 'https://placehold.co/400x300',
    images: [
      'https://placehold.co/400x300',
      'https://placehold.co/400x300?text=Comfortable+View+1',
      'https://placehold.co/400x300?text=Comfortable+View+2'
    ],
    category: 'guest-bedroom',
    tags: ['comfortable', 'welcoming', 'neutral'],
    description: 'A welcoming guest room with neutral tones and comfortable amenities.',
    inWishlist: false
  },
  {
    id: '14',
    title: 'Adventure Kids Room',
    imageUrl: 'https://placehold.co/400x300',
    images: [
      'https://placehold.co/400x300',
      'https://placehold.co/400x300?text=Adventure+View+1',
      'https://placehold.co/400x300?text=Adventure+View+2'
    ],
    category: 'kids-bedroom',
    tags: ['adventure', 'creative', 'themed'],
    description: 'A themed bedroom that sparks creativity and adventure for children.',
    inWishlist: false
  },
  {
    id: '15',
    title: 'Gourmet Kitchen',
    imageUrl: 'https://placehold.co/400x300',
    images: [
      'https://placehold.co/400x300',
      'https://placehold.co/400x300?text=Gourmet+View+1',
      'https://placehold.co/400x300?text=Gourmet+View+2'
    ],
    category: 'main-kitchen',
    tags: ['gourmet', 'professional', 'spacious'],
    description: 'A professional-grade kitchen perfect for culinary enthusiasts.',
    inWishlist: false
  },
  {
    id: '16',
    title: 'Spa Master Bathroom',
    imageUrl: 'https://placehold.co/400x300',
    images: [
      'https://placehold.co/400x300',
      'https://placehold.co/400x300?text=Spa+View+1',
      'https://placehold.co/400x300?text=Spa+View+2'
    ],
    category: 'master-bathroom',
    tags: ['spa', 'luxury', 'wellness'],
    description: 'A wellness-focused master bathroom with spa-like features.',
    inWishlist: false
  },
  {
    id: '17',
    title: 'Modern Guest Bathroom',
    imageUrl: 'https://placehold.co/400x300',
    images: [
      'https://placehold.co/400x300',
      'https://placehold.co/400x300?text=Modern+Guest+View+1',
      'https://placehold.co/400x300?text=Modern+Guest+View+2'
    ],
    category: 'guest-bathroom',
    tags: ['modern', 'clean', 'functional'],
    description: 'A clean and functional guest bathroom with modern fixtures.',
    inWishlist: false
  },
  {
    id: '18',
    title: 'Entertainment Balcony',
    imageUrl: 'https://placehold.co/400x300',
    images: [
      'https://placehold.co/400x300',
      'https://placehold.co/400x300?text=Entertainment+View+1',
      'https://placehold.co/400x300?text=Entertainment+View+2'
    ],
    category: 'main-balcony',
    tags: ['entertainment', 'outdoor', 'modern'],
    description: 'A modern balcony space perfect for outdoor entertainment.',
    inWishlist: false
  }
];