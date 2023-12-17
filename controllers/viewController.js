const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Product = require('../models/productModel');

exports.getOverview = catchAsync(async (req, res, next) => {
  const products = await Product.find();
  res.status(200).render('overview', {
    title: 'Just Buy Something',
    products,
  });
});

exports.getLoginForm = (req, res, next) => {
  res.status(200).render('login', {
    title: 'Login Form',
  });
};
