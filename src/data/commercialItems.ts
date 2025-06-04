// commercialItems.ts
import { InspirationItem } from './type';

export const commercialItems: InspirationItem[] = [
  {
    id: '1',
    title: 'Modern Office Workspace',
    imageUrl: '/image/Commercial/modern-office.jpg',
    images: [
      '/image/Commercial/modern-office.jpg',
      '/image/Commercial/modern-office2.jpg',
      '/image/Commercial/modern-office3.jpg'
    ],
    category: 'office',
    tags: ['modern', 'workspace', 'open-plan'],
    description: 'A modern open-plan office with collaborative workspaces and natural lighting.',
    inWishlist: false
  },
  {
    id: '2',
    title: 'Trendy Coffee Shop',
    imageUrl: '/image/Commercial/coffee-shop.jpg',
    images: [
      '/image/Commercial/coffee-shop.jpg',
      '/image/Commercial/coffee-shop2.jpg',
      '/image/Commercial/coffee-shop3.jpg'
    ],
    category: 'cafe',
    tags: ['cafe', 'trendy', 'cozy'],
    description: 'A cozy and trendy coffee shop with unique decor and comfortable seating.',
    inWishlist: false
  },
  {
    id: '3',
    title: 'Retail Storefront',
    imageUrl: '/image/Commercial/retail-store.jpg',
    images: [
      '/image/Commercial/retail-store.jpg',
      '/image/Commercial/retail-store2.jpg',
      '/image/Commercial/retail-store3.jpg'
    ],
    category: 'retail',
    tags: ['retail', 'storefront', 'display'],
    description: 'A stylish retail storefront with modern display windows and inviting entrance.',
    inWishlist: false
  }
];
