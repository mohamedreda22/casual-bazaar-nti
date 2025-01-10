export interface Order {
  order_id: string; // Unique identifier for the order
  customer_id: string; // ID of the customer placing the order
  product_id: string; // ID of the product being ordered
  quantity: number; // Quantity of the product ordered
  total_price: number; // Total price for the order
  order_date: Date; // Date when the order was placed
  status: string; // Status of the order (e.g. 'pending', 'shipped', 'delivered')
  createdAt?: Date; // Timestamp of when the order was created (optional)
  updatedAt?: Date; // Timestamp of when the order was last updated (optional)
}
