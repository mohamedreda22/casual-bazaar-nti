const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");
const auth = require("../utilis/auth");

// Routes for Cart operations
router.get("/:id", /* auth.authMW("User"), */ cartController.getCart); // Get a cart by ID
router.get("/user/:userId",/*  auth.authMW(null),  */cartController.getCartByUser); // Get cart by user ID
router.post(
  "/user/:userId",
   /* auth.authMW("User"), */
  cartController.createOrAddToCart
); // Add product to cart
router.put(
  "/user/:userId",
   auth.authMW("User"),
  cartController.updateCart
); // update product from the cart
router.delete(
  "/user/:userId/:productId",
  auth.authMW("User"),
  cartController.removeItem
); // Delete a product from cart

module.exports = router;
