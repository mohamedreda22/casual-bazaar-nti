export interface Product {
    id: string;                    // Unique identifier for the product
    name: string;                  // Name of the product
    price: number;                 // Price of the product
    description: string;           // Product description
    imgURL: string;                // Image URL for the product
    category: string;              // Category of the product (e.g. Electronics, Clothing, etc.)
    subCategory: string;           // Subcategory of the product (e.g. Audio, Mobile, etc.)
    bestSellers: boolean;          // Indicates if it's a bestseller
    rank: number;                  // Rank of the product (1 for top product)
    availability: 'available' | 'unavailable';  // Product availability
    stockStatus: 'inStock' | 'outOfStock';     // Current stock status
    createdAt: string;             // Created at (Timestamp from MongoDB)
    updatedAt: string;             // Updated at (Timestamp from MongoDB)
  }
  