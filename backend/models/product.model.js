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
    imgURL: {
      type: String,
      required: true,
    },
    category: {
      main: {
        type: String,
        required: true,
      },
      subCategory: {
        type: String,
        required: true,
      },
    },
    bestSellers: {
      type: Boolean,
      required: true,
    },
    rank: {
      type: Number,
      required: true,
    },
    status: {
      availability: {
        type: String,
        required: true,
      },
      stockStatus: {
        type: String,
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
