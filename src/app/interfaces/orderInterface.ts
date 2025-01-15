export interface OrderItem {
  product_id: string; // ID of the product
  quantity: number; // Quantity of the product
}

export interface Order {
  _id: string;
  // order_id: string; // Unique identifier for the order
  customer_id: string; // ID of the customer placing the order
  items: OrderItem[]; // Array of items in the order
  total_price: number; // Total price for the order
  // order_date: Date; // Date when the order was placed
  status: 'Pending' | 'Shipped' | 'Completed' | 'Cancelled'; // Status of the order
  orderDetails: {
    fullName: string; // Full name of the customer
    address: string; // Address for delivery
    city: string; // City for delivery
    government: string; // Government for delivery
    extraPhone: string; // Extra phone number for contact
    payment: string; // Payment method
  };
  createdAt?: Date; // Timestamp of when the order was created (optional)
  updatedAt?: Date; // Timestamp of when the order was last updated (optional)

}