import { Product } from "./productInterface";

/* export interface Wishlist {
  _id: string;
  userId: string;
  items: {
    product: Product;
    addedAt: string;
  }[];
  createdAt: Date;
} */
interface WishlistItem {
  productId: Product;
  addedAt: string;
  _id: string;
}

export interface Wishlist {
  _id: string;
  userId: string;
  items: WishlistItem[];
}

