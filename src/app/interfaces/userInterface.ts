export interface User {
    id: string;                // Unique identifier for the user
    username: string;          // Username of the user
    email: string;             // Email of the user
    password: string;          // Password (hashed, not stored as plain text)
    userType: string;          // ID reference to the UserType (e.g., Admin, Regular)
    createdAt: string;         // Created at (Timestamp from MongoDB)
    updatedAt: string;         // Updated at (Timestamp from MongoDB)
  }
  