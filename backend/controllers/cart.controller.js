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
    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
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

exports.createOrAddToCart = async (req, res) => {
  const { userId } = req.params;
  const { productId, products } = req.body;

  if (!userId || (!productId && !products)) {
    return res.status(400).json({
      message: "User ID and either Product ID or products are required",
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
  // console.log("userId:", userId, "productId:", productId, "quantity", quantity); // Debug userId, productId, quantity
  // console.log("Request received: params", req.params);
  // console.log("Request received:: body", req.body);
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


// Clear all items in the cart for a user
exports.clearCart = async (req, res) => {
  try {
    const cart = await CartModel.findOne({ user: req.params.userId });
    if (!cart) {
      return res
        .status(404)
        .json({ message: `Cart not found for userId: ${req.params.userId}` });
    }

    cart.products = [];
    await cart.save();
    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res
      .status(500)
      .json({ message: "Failed to clear cart", error: error.message });
  }
};
