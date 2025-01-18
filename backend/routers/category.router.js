const express = require('express');
const router = express.Router();
const auth = require("../utilis/auth");

const categoryController = require('../controllers/category.controller');

router.post("/", auth.authMW("Admin"), categoryController.createCategory);
router.get('/', categoryController.getCategories);
router.get('/:id', categoryController.getCategory);
router.put("/:id", auth.authMW("Admin"), categoryController.updateCategory);
// router.delete("/:id", auth.authMW("Admin"), categoryController.archiveCategory);

module.exports = router;