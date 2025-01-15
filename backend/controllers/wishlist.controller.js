const Wishlist = require('../models/wishlist.model');

exports.createWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ userId: req.body.userId });
    if (!wishlist) {
      wishlist = new Wishlist({
        userId: req.body.userId,
        items: req.body.productId ? [{ productId: req.body.productId }] : [],
      });
      await wishlist.save();
    }
    res.status(201).json(wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addItemToWishlist = async (req, res) => {
  try {
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
      return res.status(409).json({ message: "Product already in wishlist" });
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