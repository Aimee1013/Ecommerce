const BCategory = require('../models/blogCateModel')
const asyncHandler = require('express-async-handler')
const validateMongodbId = require('../utils/validateMongodbId');


// create blogcategory
const createCategory = asyncHandler(async (req, res) => {
  try {
    const newCategory = await BCategory.create(req.body)
    res.json(newCategory)
  } catch (error) {
    throw new Error(error)
  }
});


// update blogcategory
const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params
  validateMongodbId(id)
  try {
    const updatedCategory = await BCategory.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedCategory)
  } catch (error) {
    throw new Error(error)
  }
});


// delete blogcategory
const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params
  validateMongodbId(id)
  try {
    const deletedCategory = await BCategory.findByIdAndDelete(id);
    res.json(deletedCategory)
  } catch (error) {
    throw new Error(error)
  }
});


// get a blogcategory
const getaCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id)
  try {
    const getCategory = await BCategory.findById(id);
    res.json(getCategory)
  } catch (error) {
    throw new Error(error)
  }
});


// get all blogcategory
const getAllCategories = asyncHandler(async (req, res) => {
  try {
    const getCategories = await BCategory.find();
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