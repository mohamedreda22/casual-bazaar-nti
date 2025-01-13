export interface WishlistItem {
  productId: string;
//   addedAt: string;
} 

export interface Wishlist {
    _id: string;
    userId: string;
    items: WishlistItem[];
    createdAt: string;
  }