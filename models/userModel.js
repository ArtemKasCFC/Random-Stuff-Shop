const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name'],
    minlength: [2, 'A name must have at least 2 characters'],
    maxlength: [50, 'A name must have less than or equal to 50 characters'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: {
    type: String,
    default: 'default.jpg',
  },
  password: {
    type: String,
    required: [true, 'A user must have a password'],
    minlength: [8, 'A password must have at least 8 characters'],
    maxlength: [50, 'A password must have less than or equal to 50 characters'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'A user must have a password'],
    validate: {
      validator: function (passConfirm) {
        return passConfirm === this.password;
      },
      message: 'Password is not confirmed',
    },
  },
});
