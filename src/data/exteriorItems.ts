// exteriorItems.ts
import { InspirationItem } from './type';

export const exteriorItems: InspirationItem[] = [
  {
    id: '1',
    title: 'Modern House Front',
    imageUrl: '/image/Exterior/modern-house-front.jpg',
    images: [
      '/image/Exterior/modern-house-front.jpg',
      '/image/Exterior/modern-house-front.jpg',
      '/image/Exterior/modern-house-front.jpg'
    ],
    category: 'exterior',
    tags: ['modern', 'facade', 'minimalist'],
    description: 'A modern home facade with clean lines and large windows.',
    inWishlist: false
  },
  {
    id: '2',
    title: 'Garden Landscape',
    imageUrl: '/image/Exterior/garden-landscape.jpg',
    images: [
      '/image/Exterior/garden-landscape.jpg',
      '/image/Exterior/garden-landscape.jpg',
      '/image/Exterior/garden-landscape.jpg'
    ],
    category: 'exterior',
    tags: ['greenery', 'garden', 'landscape'],
    description: 'A beautifully landscaped garden with lush greenery and pathways.',
    inWishlist: false
  },
  {
    id: '3',
    title: 'Traditional Villa Exterior',
    imageUrl: '/image/Exterior/traditional-villa.jpg',
    images: [
      '/image/Exterior/traditional-villa.jpg',
      '/image/Exterior/traditional-villa.jpg',
      '/image/Exterior/traditional-villa.jpg'
    ],
    category: 'exterior',
    tags: ['villa', 'traditional', 'grand'],
    description: 'A grand villa exterior with traditional architectural detailing.',
    inWishlist: false
  }
];
