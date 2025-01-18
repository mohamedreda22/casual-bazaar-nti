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
  if (!req.params.userId) {
    return res.status(401).json({ message: "Unauthorized: User ID is required" });
  }
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
      return res.status(400).json({ message: "Invalid User ID" });
    }
    const cart = await CartModel.findOne({ user: req.params.userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found for the specified user." });
    }
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createOrAddToCart = async (req, res) => {
  const { userId } = req.params;
  const { productId, products } = req.body;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized: User ID is required" });
  }

  if (!productId && !products) {
    return res.status(400).json({
      message: "Either Product ID or products are required",
    });
  }

  try {
    let cart = await CartModel.findOne({
      user: new mongoose.Types.ObjectId(userId),
    });

    if (!cart) {
      // If no cart exists, create a new one
      const newProducts = products
        ? products
        : [{ product: productId, quantity: 1 }];
      cart = new CartModel({
        user: new mongoose.Types.ObjectId(userId),
        products: newProducts,
      });

      await cart.save();
      return res.status(201).json({
        message: "Cart created and product(s) added successfully",
        cart,
      });
    }

    // If the cart exists, add/update the product
    if (productId) {
      const productIndex = cart.products.findIndex(
        (item) => item.product.toString() === productId
      );

      if (productIndex > -1) {
        // Increment quantity if product exists
        cart.products[productIndex].quantity += 1;
      } else {
        // Add the product to the cart
        cart.products.push({ product: productId, quantity: 1 });
      }
    } else if (products) {
      // Add multiple products to the cart
      products.forEach(({ product, quantity }) => {
        const productIndex = cart.products.findIndex(
          (item) => item.product.toString() === product
        );

        if (productIndex > -1) {
          cart.products[productIndex].quantity += quantity || 1;
        } else {
          cart.products.push({ product, quantity: quantity || 1 });
        }
      });
    }

    await cart.save();
    res.status(200).json({
      message: "Product(s) added to cart successfully",
      cart,
    });
  } catch (error) {
    console.error("Error in createOrAddToCart:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

exports.updateCart = async (req, res) => {
  const { userId } = req.params;
  const { productId, quantity } = req.body; // Fix destructuring issue
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
};

exports.removeItem = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const cart = await CartModel.findOneAndUpdate(
      { user: userId },
      { $pull: { products: { product: productId } } },
      { new: true }
    );
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await CartModel.findOneAndUpdate(
      { user: userId },
      { $set: { products: [] } },
      { new: true }
    );
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    res.status(200).json({ message: "Cart cleared", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
