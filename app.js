const express = require('express');
const morgan = require('morgan');
const app = express();

const AppError = require('./utils/appError');
const productRouter = require('./routes/productRoutes');

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json({ limit: '10kb' }));

app.use(express.static(`${__dirname}/public`));

app.use('/api/v1/products', productRouter);

app.all('*', (req, _, next) => {
  return next(new AppError(`Can't find ${req.originalUrl} resource`, 404));
});

module.exports = app;
