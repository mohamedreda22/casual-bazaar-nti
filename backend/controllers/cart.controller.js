const CartModel = require("../models/cart.model");
const mongoose = require("mongoose");

// Get Cart by ID
exports.getCart = async (req, res) => {
  try {
    const cart = await CartModel.findById(req.params.id);
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Cart by User ID
exports.getCartByUser = async (req, res) => {
  try {
    const msg=req.params.userId;
    const cart = await CartModel.findOne({ user: req.params.userId });
    if (!cart) return res.status(404).json({ message: msg });
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create Cart
exports.createCart = async (req, res) => {
  try {
    const { userId, products } = req.body;
    if (!userId || !products)
      return res
        .status(400)
        .json({ message: "User ID and products are required" });

    const cart = new CartModel({ user: userId, products });
    await cart.save();
    res.status(201).json({ message: "Cart created successfully", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add Product to Cart
exports.addToCart = async (req, res) => {
  try {
    const userId = req.params.userId;
    const productId = req.body.productId;
    const cart = await CartModel.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const productIndex = cart.products.findIndex(
      (item) => item.product.toString() === productId
    );
    if (productIndex > -1) {
      cart.products[productIndex].quantity += 1;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }

    await cart.save();
    res.status(200).json({ message: "Product added to cart" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Clear Cart
exports.clearCart = async (req, res) => {
  try {
    const cart = await CartModel.findOne({ user: req.params.userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.products = [];
    await cart.save();
    res.status(200).json({ message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
