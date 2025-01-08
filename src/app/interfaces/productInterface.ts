export interface Product {
  _id: string;
  name: string;
  price: number;
  description?: string;
  imgURL: string;
  category: {
    main: string;
    subCategory: string;
  };
  bestSellers: boolean;
  rank: number;
  status: {
    availability: 'available' | 'unavailable';
    stockStatus: 'inStock' | 'outOfStock';
  };
  createdAt: string;
  updatedAt: string;
}
