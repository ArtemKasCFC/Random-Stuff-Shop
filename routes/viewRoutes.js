const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.isLoggedIn);

router.route('/').post(authController.protect, viewController.addToCart).get(viewController.getOverview);
router
  .route('/product/:slug')
  .post(authController.protect, viewController.addToCart)
  .get(viewController.getProductPage);

router.get('/login', viewController.getLoginForm);

router
  .route('/cart')
  .post(authController.protect, viewController.createCheckoutSession)
  .get(authController.protect, viewController.getCart)
  .patch(authController.protect, viewController.updateCart);

router.route('/account').get(authController.protect, viewController.getAccountPage);

module.exports = router;
