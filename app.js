const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const app = express();

const AppError = require('./utils/appError');
const productRouter = require('./routes/productRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json({ limit: '10kb' }));

// Submit parser
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Coookie parser
app.use(cookieParser());

app.use(express.static(`${__dirname}/public`));

app.use('/api/v1/products', productRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, _, next) => {
  return next(new AppError(`Can't find ${req.originalUrl} resource`, 404));
});

module.exports = app;
