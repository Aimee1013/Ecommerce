const Product = require('../models/productModel')
const asyncHandler = require('express-async-handler');
const slugify = require("slugify");
const User = require('../models/userModel')
const validateMongodbId = require('../utils/validateMongodbId')
const { cloudinaryUploadImg, cloudinaryDeleteImg } = require('../utils/cloudinary')
const fs = require('fs')


// create a product
const createProduct = asyncHandler(async (req, res) => {
  try {
    // slugify可以将地址、信息转换为一个符合网址要求的字符串
    if (req.body.title) {
      req.body.slug = slugify(req.body.title)
    }
    const newProduct = await Product.create(req.body);
    res.json(newProduct)
  } catch (error) {
    throw new Error(error)
  }
})


// update product
const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title)
    }
    const updateProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    })
    res.json(updateProduct)
  } catch (error) {
    throw new Error(error)
  }
})


// delete product
const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params
  try {
    const deleteProduct = await Product.findByIdAndDelete(id)
    res.json(deleteProduct)
  } catch (error) {
    throw new Error(error)
  }
})


// get a product
const getaProduct = asyncHandler(async (req, res) => {
  const { id } = req.params
  try {
    const findaProduct = await Product.findById(id)
    res.json(findaProduct)
  } catch (error) {
    throw new Error(error)
  }
})


// get all products
const getAllProducts = asyncHandler(async (req, res) => {
  try {
    // Filtering
    const queryObj = { ...req.query };
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach((el) => delete queryObj[el])

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    // console.log(JSON.parse(queryStr))

    let query = Product.find(JSON.parse(queryStr))

    // Sortig
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ')
      query = query.sort(sortBy)
    } else {
      query = query.sort('-createAt')
    }

    // limiting the fields
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ')
      query = query.select(fields)
    } else {
      query = query.select('-__v')
    }

    // pagination
    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    console.log(page, limit, skip)
    if (req.query.page) {
      const productCount = await Product.countDocuments();
      if (skip >= productCount) throw new Error('This page does not exists')
    }

    const product = await query
    res.json(product)
  } catch (error) {
    throw new Error(error)
  }
})


// add wishlist
const addToWishlist = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { prodId } = req.body;
  try {
    const user = await User.findById(_id);
    const alreadyAdded = user.wishlist.find(id => id.toString() === prodId)
    if (alreadyAdded) {
      let user = await User.findByIdAndUpdate(_id, { $pull: { wishlist: prodId } }, { new: true });
      res.json(user);
    } else {
      let user = await User.findByIdAndUpdate(_id, { $push: { wishlist: prodId } }, { new: true });
      res.json(user);
    }
  } catch (error) {
    throw new Error(error)
  }
})


// rating
const rating = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { star, prodId, comment } = req.body;
  try {
    const product = await Product.findById(prodId);
    let alreadyRated = product.ratings.find(userId => userId.postedby.toString() === _id.toString());
    if (alreadyRated) {
      const updateRating = await Product.updateOne(
        { ratings: { $elemMatch: alreadyRated } },
        { $set: { "ratings.$.star": star, "ratings.$.comment": comment } },
        { new: true }
      );
      // res.json(updateRating)
    } else {
      const rateProduct = await Product.findByIdAndUpdate(prodId,
        {
          $push: {
            ratings: { star: star, comment: comment, postedby: _id, }
          }
        }, {
        new: true,
      });
      // res.json(rateProduct);
    }
    const getAllRatings = await Product.findById(prodId);
    let totalRating = getAllRatings.ratings.length;
    let ratingSum = getAllRatings.ratings.map(item => item.star).reduce((prev, curr) => prev + curr, 0);
    let actualRating = Math.round(ratingSum / totalRating)
    let finalProduct = await Product.findByIdAndUpdate(prodId, {
      totalrating: actualRating
    }, {
      new: true
    });
    res.json({ finalProduct })
  } catch (error) {
    throw new Error(error)
  }
});


// upload product images
const uploadImages = asyncHandler(async (req, res) => {
  // console.log(req.files)
  try {
    const uploader = path => cloudinaryUploadImg(path, 'images');
    const urls = [];
    const files = req.files;
    for (const file of files) {
      const { path } = file;
      const newpath = await uploader(path);
      urls.push(newpath);
      fs.unlinkSync(path);
    }
    const images = urls.map(file => {
      return file;
    })
    res.json(images);
  } catch (error) {
    throw new Error(error)
  }
});


// delete product images
const deleteImages = asyncHandler(async (req, res) => {
  // console.log(req.files)
  const { id } = req.params;
  try {
    const deleted = cloudinaryDeleteImg(id, 'images');
    res.json({ message: 'Deleted' });
  } catch (error) {
    throw new Error(error)
  }
});






module.exports = {
  createProduct,
  getaProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  addToWishlist,
  rating,
  uploadImages,
  deleteImages,
}