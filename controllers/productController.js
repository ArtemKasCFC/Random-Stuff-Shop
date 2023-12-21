const multer = require('multer');
const sharp = require('sharp');
const Product = require('../models/productModel');
const crudHandlers = require('./crudHandlers');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const slugify = require('slugify');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  file.mimetype.startsWith('image')
    ? cb(null, true)
    : cb(new AppError('Not an image. Please upload only images', 400), false);
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadProductImages = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'images', maxCount: 4 },
]);

exports.resizeProductImages = catchAsync(async (req, res, next) => {
  if (!req.files.image || !req.files.images) return next();

  const slug = slugify(req.body.title, { lower: true });

  // Cover Image
  req.body.image = `product-${slug}-cover.jpg`;
  await sharp(req.files.image[0].buffer)
    .resize(300, 300)
    .toFormat('jpg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/products/${req.body.image}`);

  // Images
  req.body.images = [];

  await Promise.all(
    req.files.images.map(async (file, ind) => {
      const filename = `product-${slug}-${ind + 1}.jpg`;

      // Or file.buffer
      await sharp(file.buffer)
        .resize(506, 252)
        .toFormat('jpg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/products/${filename}`);

      req.body.images.push(filename);
    })
  );

  next();
});

exports.createProduct = crudHandlers.createOne(Product);

exports.getProduct = crudHandlers.getOne(Product, { path: 'reviews' });

exports.getAllProducts = crudHandlers.getAll(Product);

exports.updateProduct = crudHandlers.updateOne(Product);

exports.deleteProduct = crudHandlers.deleteOne(Product);
