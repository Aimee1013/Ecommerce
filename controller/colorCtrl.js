const Color = require('../models/colorModel')
const asyncHandler = require('express-async-handler')
const validateMongodbId = require('../utils/validateMongodbId');


// create Color
const createColor = asyncHandler(async (req, res) => {
  try {
    const newColor = await Color.create(req.body)
    res.json(newColor)
  } catch (error) {
    throw new Error(error)
  }
});


// update Color
const updateColor = asyncHandler(async (req, res) => {
  const { id } = req.params
  validateMongodbId(id)
  try {
    const updatedColor = await Color.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedColor)
  } catch (error) {
    throw new Error(error)
  }
});


// delete Color
const deleteColor = asyncHandler(async (req, res) => {
  const { id } = req.params
  validateMongodbId(id)
  try {
    const deletedColor = await Color.findByIdAndDelete(id);
    res.json(deletedColor)
  } catch (error) {
    throw new Error(error)
  }
});


// get a Color
const getaColor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id)
  try {
    const getColor = await Color.findById(id);
    res.json(getColor)
  } catch (error) {
    throw new Error(error)
  }
});


// get all Color
const getAllColors = asyncHandler(async (req, res) => {
  try {
    const getColors = await Color.find();
    res.json(getColors)
  } catch (error) {
    throw new Error(error)
  }
});


module.exports = {
  createColor,
  updateColor,
  deleteColor,
  getaColor,
  getAllColors,
}