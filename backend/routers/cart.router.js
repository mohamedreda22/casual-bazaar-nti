const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");

router.post("/", cartController.createCart);
router.get("/", cartController.getAllCarts);
router.get("/:id", cartController.getCart);
router.get("/user/:userId/cart", cartController.getCartByUser);
router.post("/:cartId/products", cartController.addToCart);
router.put("/:cartId", cartController.updateCart);
router.delete("/:cartId/products/:productId", cartController.removeFromCart);
router.delete("/:cartId", cartController.clearCart);

module.exports = router;
