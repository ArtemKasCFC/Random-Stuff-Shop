const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Product = require('../models/productModel');

exports.getOverview = catchAsync(async (req, res, next) => {
  const products = await Product.find();
  res.status(200).render('base', {
    title: 'Just Buy Something',
    products,
  });
});
