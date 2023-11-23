const mongoose = require('mongoose');
const Product = require('./productModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty'],
    },
    rating: {
      type: Number,
      required: true,
      min: [1, 'Rating can not be below 1'],
      max: [5, 'Rating can not be above 5'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
      required: [true, 'Review must have a product'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must have a user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.index({ product: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  this.populate({ path: 'user', select: 'name photo' });
  next();
});

reviewSchema.statics.calcAvgRating = async function (productID) {
  const stats = await this.aggregate([
    { $match: { product: productID } },
    { $group: { _id: '$product', numRating: { $sum: 1 }, avgRating: { $avg: '$rating' } } },
  ]);
  stats.length > 0
    ? await Product.findByIdAndUpdate(productID, {
        ratingsQuantity: stats[0].numRating,
        ratingsAverage: stats[0].avgRating,
      })
    : await Product.findByIdAndUpdate(productID, { ratingsQuantity: 0, ratingsAverage: 3 });
};

reviewSchema.post('save', async function () {
  await this.constructor.calcAvgRating(this.product);
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.clone().findOne();
  next();
});

reviewSchema.post(/^findOneAnd/, function () {
  this.r.constructor.calcAvgRating(this.r.product);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
