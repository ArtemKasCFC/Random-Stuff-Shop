const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'A product must have a title'],
      unique: true,
      trim: true,
      minlength: [2, 'A title must have at least 2 characters'],
      maxlength: [50, 'A title must have less than or equal to 50 characters'],
    },
    slug: String,
    category: {
      type: String,
      enum: ['books', 'candy', 'mugs and glasses', 'toys', 'socks', 'other'],
      default: 'other',
    },
    stock: {
      type: Number,
      default: 1,
    },
    summary: {
      type: String,
      required: [true, 'A product must have a summary'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    ratingsAverage: {
      type: Number,
      default: 3,
      max: [5, 'Rating must be below 5.0'],
      min: [1, 'Rating must be above 1.0'],
      set: val => val.toFixed(1),
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A product must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // this only points to current doc on NEW document creation
          return val <= this.price;
        },
        message: 'Discount ({VALUE}) must be less or equal then price',
      },
      default: 0,
    },
    image: {
      type: String,
      required: [true, 'A product must have an image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now,
      select: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

productSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'product',
  localField: '_id',
});

productSchema.pre('save', function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
