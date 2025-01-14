const Order = require("../models/order.model"); // Adjust the path as necessary
const mongoose = require("mongoose");

// Create a new order

exports.createOrder = async function (req, res) {
  try {
    const { customer_id, total_price, items } = req.body;

    const newOrder = new Order({
      customer_id,
      total_price,
      items,
    });

    await newOrder.save();
    res
      .status(201)
      .json({ message: "Order created successfully", order: newOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Error creating order.", error });
  }
}



// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate(
      "customer_id",
      "username  email"
    ).then((orders) => {
    // console.log("Orders with customer details:", orders);
    res.status(200).json(orders);
    });
    // res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res
      .status(500)
      .json({ message: "Error fetching orders.", error: error.message });
  }
};


// Get a single order by ID
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id).populate("orders").then((user)=>{
          res.status(200).json(order);

      // console.log("Orders with customer details:", user);
    })

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching order.", error: error.message });
  }
};

exports.getOrdersByCustomer = async (req, res) => {
  try {
    const customer_id  = req.params.userId;
    // console.log("customer_id", customer_id);

    if (!customer_id) {
      return res
        .status(400)
        .json({ message: "Invalid Customer ID." });
    }

    const orders = await Order.find({ customer_id });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders for customer:", error);
    res
      .status(500)
      .json({ message: "Error fetching orders.", error: error.message });
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

    if (!id) {
      return res.status(400).json({ message: "Order ID is required." });
    }

    const deletedOrder = await Order.findByIdAndDelete(id);
    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.status(200).json({ message: "Order deleted successfully." });
  } catch (error) {
    console.error("Error deleting order:", error);
    res
      .status(500)
      .json({ message: "Error deleting order.", error: error.message });
  }
};

