const express = require("express");
const wishlistController = require("../controllers/wishlist.controller");
const auth = require("../utilis/auth");

const router = express.Router();

// Get a user's wishlist
router.get("/:userId", auth.authMW("User"), wishlistController.getWishlist);

// Add an item to a user's wishlist
router.post(
  "/:userId/items",
  auth.authMW("User"),
  wishlistController.addItemToWishlist
);

// Remove an item from a user's wishlist
router.delete(
  "/:userId/items/:productId",
  auth.authMW("User"),
  wishlistController.removeItemFromWishlist
);

module.exports = router;
