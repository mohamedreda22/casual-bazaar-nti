export interface Product {
  _id: string;
  name: string;
  price: number;
  description?: string;
  productImage: string;
  category: string;
  subCategory: string;
  bestSellers: boolean;
  rank: number;
  status: {
    availability: 'available' | 'unavailable';
    stockStatus: 'inStock' | 'outOfStock';
  };
  carousel: boolean;
  // userStatus: 'active' | 'inactive';
  productStatus: string;
  createdAt: string;
  updatedAt: string;
}
