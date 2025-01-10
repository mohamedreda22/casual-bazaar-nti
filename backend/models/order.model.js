const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    order_id: {
      type: String,
      required: true,
      unique: true, // Ensure order_id is unique
    },
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer", // Reference to Customer collection
      required: true,
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", // Reference to Product collection
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1, // Ensure quantity is at least 1
    },
    total_price: {
      type: Number,
      required: true,
      min: 0, // Ensure total_price is not negative
    },
    order_date: {
      type: Date,
      default: Date.now, // Set default order date
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Shipped", "Completed", "Cancelled"], // Restrict to specific values
      default: "Pending",
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Pre-save hook to generate unique order_id if not provided
orderSchema.pre("save", function (next) {
  if (!this.order_id) {
    this.order_id = `ORD-${Date.now()}`;
  }
  next();
});

module.exports = mongoose.model("Order", orderSchema);
