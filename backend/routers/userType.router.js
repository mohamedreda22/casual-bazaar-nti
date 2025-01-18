const express = require("express");
const router = express.Router();
const userTypeController = require("../controllers/userType.controller");
const auth = require("../utilis/auth");

router.post("/", auth.authMW("Admin"), userTypeController.createUserType);
router.get("/", auth.authMW("Admin"), userTypeController.getUserTypes);
router.get("/:id", auth.authMW("Admin"), userTypeController.getUserType);
router.put("/:id", auth.authMW("Admin"), userTypeController.updateUserType);
router.delete("/:id", auth.authMW, userTypeController.deleteUserType);

module.exports = router;
