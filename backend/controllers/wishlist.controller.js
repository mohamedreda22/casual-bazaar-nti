const Wishlist = require('../models/wishlist.model');

exports.addItemToWishlist = async (req, res) => {
  console.log('req.body', req.body);
  console.log('req.params', req.params);
  console.log("req.params.userId", req.params.userId);
  try {
    if (!req.params.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    let wishlist = await Wishlist.findOne({ userId: req.params.userId });
    if (!wishlist) {
      wishlist = new Wishlist({
        userId: req.params.userId,
        items: [{ productId: req.body._id }],
      });
      const newWishlist = await wishlist.save();
      return res.status(201).json(newWishlist);
    }
    const productExists = wishlist.items.some(
      (item) => item.productId.toString() === req.body._id
    );
    if (productExists) {
      return res.status(409).json({ message: 'Product already in wishlist' });
    }
    wishlist.items.push({ productId: req.body._id });
    const updatedWishlist = await wishlist.save();
    res.status(200).json(updatedWishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getWishlist = async (req, res) => {
    try {
        const wishlist = await Wishlist.find({ userId: req.params.userId }).populate('items.productId');
        if (!wishlist) {
            return res.status(404).json({ message: 'Wishlist not found' });
        }
        res.status(200).json(wishlist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.removeItemFromWishlist = async (req, res) => {
    try {
        const wishlist = await Wishlist.findOne({ userId: req.params.userId });
        if (!wishlist) {
            return res.status(404).json({ message: 'Wishlist not found' });
        }
        wishlist.items = wishlist.items.filter(item => item.productId.toString() !== req.params.productId);
        const updatedWishlist = await wishlist.save();
        res.status(200).json(updatedWishlist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};