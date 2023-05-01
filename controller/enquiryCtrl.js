const Enquiry = require('../models/enquiryModel')
const asyncHandler = require('express-async-handler')
const validateMongodbId = require('../utils/validateMongodbId');


// create Enquiry
const createEnquiry = asyncHandler(async (req, res) => {
  try {
    const newEnquiry = await Enquiry.create(req.body)
    res.json(newEnquiry)
  } catch (error) {
    throw new Error(error)
  }
});


// update Enquiry
const updateEnquiry = asyncHandler(async (req, res) => {
  const { id } = req.params
  validateMongodbId(id)
  try {
    const updatedEnquiry = await Enquiry.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedEnquiry)
  } catch (error) {
    throw new Error(error)
  }
});


// delete Enquiry
const deleteEnquiry = asyncHandler(async (req, res) => {
  const { id } = req.params
  validateMongodbId(id)
  try {
    const deletedEnquiry = await Enquiry.findByIdAndDelete(id);
    res.json(deletedEnquiry)
  } catch (error) {
    throw new Error(error)
  }
});


// get a Enquiry
const getaEnquiry = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id)
  try {
    const getEnquiry = await Enquiry.findById(id);
    res.json(getEnquiry)
  } catch (error) {
    throw new Error(error)
  }
});


// get all Enquiry
const getAllEnquirys = asyncHandler(async (req, res) => {
  try {
    const getEnquirys = await Enquiry.find();
    res.json(getEnquirys)
  } catch (error) {
    throw new Error(error)
  }
});


module.exports = {
  createEnquiry,
  updateEnquiry,
  deleteEnquiry,
  getaEnquiry,
  getAllEnquirys,
}