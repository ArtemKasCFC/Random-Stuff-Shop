const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: [2, 'A title must have at least 2 characters'],
    maxlength: [50, 'A title must have less than or equal to 50 characters'],
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
});
