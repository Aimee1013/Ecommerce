const PCategory = require('../models/prodCategoryModel')
const asyncHandler = require('express-async-handler')
const validateMongodbId = require('../utils/validateMongodbId');


// create category
const createCategory = asyncHandler(async (req, res) => {
  try {
    const newCategory = await PCategory.create(req.body)
    res.json(newCategory)
  } catch (error) {
    throw new Error(error)
  }
});


// update category
const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params
  validateMongodbId(id)
  try {
    const updatedCategory = await PCategory.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedCategory)
  } catch (error) {
    throw new Error(error)
  }
});


// delete category
const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params
  validateMongodbId(id)
  try {
    const deletedCategory = await PCategory.findByIdAndDelete(id);
    res.json(deletedCategory)
  } catch (error) {
    throw new Error(error)
  }
});


// get a category
const getaCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id)
  try {
    const getCategory = await PCategory.findById(id);
    res.json(getCategory)
  } catch (error) {
    throw new Error(error)
  }
});


// get all categories
const getAllCategories = asyncHandler(async (req, res) => {
  try {
    const getCategories = await PCategory.find();
    res.json(getCategories)
  } catch (error) {
    throw new Error(error)
  }
});


module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  getaCategory,
  getAllCategories,
}