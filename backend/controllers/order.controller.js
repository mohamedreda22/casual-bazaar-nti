const Order = require("../models/order.model"); // Adjust the path as necessary

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const {
      order_id,
      customer_id,
      product_id,
      quantity,
      total_price,
      order_date,
    } = req.body;

    // Validate request body
    if (
      !order_id ||
      !customer_id ||
      !product_id ||
      !quantity ||
      !total_price ||
      !order_date
    ) {
      console.log(req.body);
      return res.status(400).json({ message: "All fields are required." });
    }

    const newOrder = new Order({
      order_id,
      customer_id,
      product_id,
      quantity,
      total_price,
      order_date,
    });

    const savedOrder = await newOrder.save();
    res
      .status(201)
      .json({ message: "Order created successfully.", order: savedOrder });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating order.", error: error.message });
  }
};

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching orders.", error: error.message });
  }
};

// Get a single order by ID
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.status(200).json(order);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching order.", error: error.message });
  }
};

// Update an order
exports.updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedOrder = await Order.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found." });
    }

    res
      .status(200)
      .json({ message: "Order updated successfully.", order: updatedOrder });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating order.", error: error.message });
  }
};

// Delete an order
exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.status(200).json({ message: "Order deleted successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting order.", error: error.message });
  }
};
