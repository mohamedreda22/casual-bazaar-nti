
const Wishlist = require('../models/wishlist.model');

exports.createWishlist = async (req, res) => {
    try {
        const wishlist = new Wishlist({
            userId: req.body.userId,
            items: req.body.items
        });
        const savedWishlist = await wishlist.save();
        res.status(201).json(savedWishlist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getWishlist = async (req, res) => {
    try {
        const wishlist = await Wishlist.findOne({ userId: req.params.userId }).populate('items.productId');
        if (!wishlist) {
            return res.status(404).json({ message: 'Wishlist not found' });
        }
        res.status(200).json(wishlist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.addItemToWishlist = async (req, res) => {
    try {
        const wishlist = await Wishlist.findOne({ userId: req.params.userId });
        if (!wishlist) {
            return res.status(404).json({ message: 'Wishlist not found' });
        }
        wishlist.items.push({ productId: req.body.productId });
        const updatedWishlist = await wishlist.save();
        res.status(200).json(updatedWishlist);
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