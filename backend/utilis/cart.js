const CartModel = require("../models/cart.model");
const findCart = async (req, res, next) => {
  try {
    const cart = await CartModel.findOne({ user: req.params.userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    req.cart = cart;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { findCart };