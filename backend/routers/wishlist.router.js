const express = require("express");
const wishlistController = require("../controllers/wishlist.controller");

const router = express.Router();

// Get a user's wishlist
router.get("/:userId", wishlistController.getWishlist);

// Add an item to a user's wishlist
router.post(
  "/:userId/items",
  wishlistController.addItemToWishlist
);

// Remove an item from a user's wishlist
router.delete(
  "/:userId/items/:productId",
  wishlistController.removeItemFromWishlist
);

module.exports = router;
