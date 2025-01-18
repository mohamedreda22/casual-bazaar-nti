const express = require("express");
const router = express.Router();
const auth = require("../utilis/auth");

const userController = require("../controllers/user.controller");

router.post("/", userController.createUser);
router.get("/", auth.authMW("Admin"), userController.getUsers);
router.get("/:id", auth.authMW("Admin"), userController.getUser);
router.put("/:id", auth.authMW("Admin"), userController.updateUser);
router.delete("/:id", auth.authMW("Admin"), userController.deleteUser);
router.post("/login", userController.loginUser);

module.exports = router;
