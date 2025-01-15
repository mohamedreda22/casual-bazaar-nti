const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema(
  {
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    items: [
      {
        product_id: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
    total_price: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Completed", "Cancelled"],
      required: true,
    },
    orderDetails: {
      type: {
        fullName: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        government: { type: String, required: true },
        extraPhone: { type: String },
        payment: { type: String, required: true },
      },
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);