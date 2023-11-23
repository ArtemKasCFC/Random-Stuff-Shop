const crudHandler = require('./crudHandlers');
const Review = require('../models/reviewModel');

exports.setTourUserIDs = (req, res, next) => {
  if (!req.body.product) req.body.product = req.params.productID;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.createReview = crudHandler.createOne(Review);

exports.getReview = crudHandler.getOne(Review);

exports.getAllReviews = crudHandler.getAll(Review);

exports.updateReview = crudHandler.updateOne(Review);

exports.deleteReview = crudHandler.deleteOne(Review);
