// types.ts
export interface RoomCategory {
    id: string;
    label: string;
    active?: boolean;
  }
  
  export interface InspirationItem {
    id: string;
    title: string;
    imageUrl?: string;
    images: string[];
    category: string;
    tags?: string[];
    description?: string;
    inWishlist: boolean;
  }
  