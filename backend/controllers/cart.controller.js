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
  // console.log("Request received:", req.params); // Log request details
  try {
    if(!mongoose.Types.ObjectId.isValid(req.params.userId)) {
      return res.status(400).json({ message: "Invalid User ID" });
    }
    const msg = req.params.userId;
    const cart = await CartModel.findOne({ user: req.params.userId });
    if (!cart)
      return res
        .status(404)
        .json({ message: "Cart not found for the specified user.", msg });
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create Cart
exports.createCart = async (req, res) => {
  try {
    const { userId, products } = req.body;
    if (!userId || !products) {
      return res
        .status(400)
        .json({ message: "User ID and products are required" });
    }

    const existingCart = await CartModel.findOne({ user: userId });
    if (existingCart) {
      return res.status(400).json({ message: "User already has a cart" });
    }

    const cart = new CartModel({ user: userId, products });
    await cart.save();
    res.status(201).json({ message: "Cart created successfully", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addToCart = async (req, res) => {
  // console.log("Request received:", req.params, req.body); // Log request details
    const { userId } = req.params;
    const { productId } = req.body;
    console.log("userId:", userId, "productId:", productId); // Debug userId and productId
        if (!userId || !productId) {
          return res
            .status(400)
            .json({ message: "User ID and Product ID are required" });
        }
  try {

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

        const cart = await CartModel.findOne({
          user: new mongoose.Types.ObjectId(userId),
        });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found for the user" });
    }

    const productIndex = cart.products.findIndex(
      (item) => item.product.toString() === productId
    );

    if (productIndex > -1) {
      cart.products[productIndex].quantity += 1;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }

    await cart.save();
    res
      .status(200)
      .json({ message: "Product added to cart successfully", cart });
  } catch (error) {
    console.error("Error in addToCart:", error); // Log detailed error
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

// Clear Cart
/* exports.clearCart = async (req, res) => {
  try {
    const cart = await CartModel.findOne({ user: req.params.userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.products = [];
    await cart.save();
    res.status(200).json({ message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; */

exports.updateCart = async (req, res) => {
  const { userId } = req.params;
  const { productId } = req.body;
  console.log("userId:", userId, "productId:", productId); // Debug userId and productId
  const { quantity } = req.body;
  try {
    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const cart = await CartModel.findOne({
      user: new mongoose.Types.ObjectId(userId),
    });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found for the user" });
    }

    const productIndex = cart.products.findIndex(
      (item) => item.product.toString() === productId
    );

    if (productIndex > -1) {
      cart.products[productIndex].quantity = quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }

    await cart.save();
    res.status(200).json({ message: "Cart updated successfully", cart });
  } catch (error) {
    console.error("Error in updateCart:", error); // Log detailed error
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}
