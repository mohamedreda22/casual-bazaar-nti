const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");

// Routes for Cart operations
router.get("/:id", cartController.getCart); // Get a cart by ID
router.get("/user/:userId", cartController.getCartByUser); // Get cart by user ID
router.post("/user/:userId", cartController.createOrAddToCart); // Add product to cart
router.put("/user/:userId", cartController.updateCart); // update product from the cart
router.delete("/user/:userId/:productId", cartController.removeItem); // Delete a product from cart

module.exports = router;
