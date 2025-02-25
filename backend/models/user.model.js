const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    retypepassword: {
      type: String,
      required: true,
    },
    userType: {
      type: mongoose.Schema.Types.ObjectId, // what type of data we are referencing
      ref: "userType", //name of what we are referencing
      default: "676beb8d676057a11051a907", // default value for userType is "user"
    },
    userStatus: {
      type: String,
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.virtual("orders", {
  ref: "Order",
  localField: "_id",
  foreignField: "customer_id",
});

module.exports = mongoose.model("User", userSchema);
