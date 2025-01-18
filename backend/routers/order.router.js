const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/order.controller"); // Adjust the path as necessary
const auth = require("../utilis/auth");

// Define routes
router.post("/", /* auth.authMW("User"), */ OrderController.createOrder); // Create an order
router.get("/", /* auth.authMW("Admin"), */ OrderController.getAllOrders); // Get all orders
router.get("/:id", OrderController.getOrderById); // Get an order by ID
router.get(
  "/user/:userId",
  auth.authMW("User"),
  OrderController.getOrdersByCustomer
); // Get all orders by user ID
router.put("/:id", /* auth.authMW("Admin"), */ OrderController.updateOrder); // Update an order
router.delete("/:id", /* auth.authMW("Admin"), */ OrderController.deleteOrder); // Delete an order

module.exports = router;
