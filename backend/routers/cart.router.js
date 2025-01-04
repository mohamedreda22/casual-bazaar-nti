const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");
const { findCart } = require("../utilis/cart");

// Routes for Cart operations
router.post("/", cartController.createCart); // Create a new cart
router.get("/:id", cartController.getCart); // Get a cart by ID
router.get("/user/:userId", cartController.getCartByUser); // Get cart by user ID
router.post("/user/:userId", findCart, cartController.addToCart); // Add product to cart
router.put("/user/:userId", findCart, cartController.updateCart); // Add product to cart

module.exports = router;
