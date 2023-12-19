const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.isLoggedIn);

router.route('/').post(authController.protect, viewController.addToCart).get(viewController.getOverview);

router.get('/login', viewController.getLoginForm);

module.exports = router;
