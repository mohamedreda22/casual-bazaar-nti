const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
    },
    productImage: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    subCategory: {
      type: String,
      required: true,
    },
    bestSellers: {
      type: Boolean,
      // required: true,
    },
    rank: {
      type: Number,
    },
    status: {
      availability: {
        type: String,
        default: "available",
        required: true,
      },
      stockStatus: {
        type: String,
        default: "inStock",
        required: true,
      },
    },
    carousel: {
      type: Boolean,
      default: false,
    },
    productStatus: {
      type: String,
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
