const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");

// Routes for Cart operations
router.post("/", cartController.createCart); // Create a new cart
router.get("/:id", cartController.getCart); // Get a cart by ID
router.get("/user/:userId", cartController.getCartByUser); // Get cart by user ID
router.post("/user/:userId", cartController.addToCart); // Add product to cart
// router.delete("/user/:userId", cartController.clearCart); // Clear the user's cart

module.exports = router;
