const userTypeModel = require("../models/userType.model");
const auth = require("../utilis/auth");

exports.getUserType = async (req, res) => {
  try {
    const userType = await userTypeModel.findById(req.params.id);
    if (!userType) {
      return res.status(404).json({ message: "UserType not found" });
    }
    res.status(200).json(userType);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createUserType = async (req, res) => {
  try {
    const userType = await userTypeModel.create(req.body);
    res.status(201).json(userType);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserTypes = async (req, res) => {
  try {
    const userTypes = await userTypeModel.find();
    res.status(200).json(userTypes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateUserType = async (req, res) => {
  try {
    const updatedUserType = await userTypeModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedUserType) {
      return res.status(404).json({ message: "UserType not found" });
    }
    res
      .status(200)
      .json({ message: "UserType updated successfully", updatedUserType });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// don't delete the userType but archive it instead by setting the status to "inactive"
exports.deleteUserType = async (req, res) => {
  try {
    const deletedUserType = await userTypeModel.findByIdAndUpdate(
      req.params.id,
      { status: "inactive" },
      { new: true }
    );
    if (!deletedUserType) {
      return res.status(404).json({ message: "UserType not found" });
    }
    res.status(200).json({ message: "UserType archived successfully" });
  } catch (error) {
    res.status(500).json({ message: error
    .message });
  }
};
