const express = require('express');
const router = express.Router();

const productController = require('../controllers/productController');

router
  .route('/:id')
  .get(productController.getProduct)
  .patch(productController.updateProduct)
  .delete(productController.deleteProduct);

router
  .route('/')
  // .post(productController.uploadProductImages, productController.resizeProductImages, productController.createProduct)
  .post(productController.createProduct)
  .get(productController.getAllProducts);

module.exports = router;
