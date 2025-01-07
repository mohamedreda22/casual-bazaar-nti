export interface Category {
    id: string;                // Unique identifier for the category
    name: string;              // Name of the category
    subCategories: string[];    // List of subcategories under this category
    show: boolean;             // Whether the category should be shown on the frontend
    createdAt: string;         // Created at (Timestamp from MongoDB)
    updatedAt: string;         // Updated at (Timestamp from MongoDB)
  }
  