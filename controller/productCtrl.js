const Product = require('../models/productModel')
const asyncHandler = require('express-async-handler');
const slugify = require("slugify");


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




module.exports = {
  createProduct,
  getaProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
}