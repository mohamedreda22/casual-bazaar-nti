export interface UserType {
    _id: string;                // Unique identifier for the userType
    name: string;              // Name of the userType (e.g., Admin, Regular)
    description?: string;      // Description of the userType (optional)
    createdAt: string;         // Created at (Timestamp from MongoDB)
    updatedAt: string;         // Updated at (Timestamp from MongoDB)
  }
  