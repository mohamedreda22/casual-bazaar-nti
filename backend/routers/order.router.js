const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/order.controller"); // Adjust the path as necessary

// Define routes
router.post("/", OrderController.createOrder); // Create an order
router.get("/", OrderController.getAllOrders); // Get all orders
router.get("/:id", OrderController.getOrderById); // Get an order by ID
router.get("/user/:userId", OrderController.getOrdersByCustomer); // Get all orders by user ID
router.put("/:id", OrderController.updateOrder); // Update an order
router.delete("/:id", OrderController.deleteOrder); // Delete an order

module.exports = router;
