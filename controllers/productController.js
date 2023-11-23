const multer = require('multer');
const Product = require('../models/productModel');
const crudHandlers = require('./crudHandlers');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  file.mimetype.startsWith('image')
    ? cb(null, true)
    : cb(new AppError('Not an image. Please upload only images', 400), false);
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadProductImages = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'images', maxCount: 3 },
]);

exports.resizeProductImages = catchAsync(async (req, res, next) => {
  console.log(req.file);
  if (!req.files.image || !req.files.images) return next();

  // Cover Image
  req.body.image = `product-${req.params.id}-${Date.now()}-cover.jpeg`;
  await sharp(req.files.image[0].buffer)
    .resize(333, 333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/products/${req.body.image}`);

  // Images
  await Promise.all(
    req.files.images.map(async (file, ind) => {
      req.body.images = [];
      const filename = `product-${req.params.id}-${Date.now()}-${ind + 1}.jpeg`;

      // Or file.buffer
      await sharp(req.files.images[ind].buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
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
