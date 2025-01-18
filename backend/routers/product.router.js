const express = require("express");
const router = express.Router();
const auth = require("../utilis/auth");

const productController = require("../controllers/product.controller");

const upload = require("../config/multerConfig");
//upload.single('productImage') is a middleware that will handle the file upload and add the file to the request object as req.file
router.post(
  "/",
  upload.single("productImage"),
  auth.authMW("Admin"),
  productController.createProduct
);
router.get("/", productController.getProducts);
router.get("/:id", productController.getProduct);
router.put(
  "/:id",
  upload.single("productImage"),
  auth.authMW("Admin"),
  productController.updateProduct
);
router.delete("/:id", auth.authMW("Admin"), productController.deleteProduct);

module.exports = router;
