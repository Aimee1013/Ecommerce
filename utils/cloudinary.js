const cloudinary = require('cloudinary');

// Configuration 
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const cloudinaryUploadImg = async (fileToUploads) => {
  return new Promise(resolve => {
    cloudinary.uploader.upload(fileToUploads, (result) => {
      resolve(
        {
          url: result.secure_url,
          asset_id: result.asset_id,
          public_id: result.public_id,
        },
        { resource_type: "auto" }
      )
    })
  })
};


const cloudinaryDeleteImg = async (fileTodelete) => {
  return new Promise(resolve => {
    cloudinary.uploader.destroy(fileTodelete, (result) => {
      resolve(
        {
          url: result.secure_url,
          asset_id: result.asset_id,
          public_id: result.public_id,
        },
        { resource_type: "auto" }
      )
    })
  })
};


module.exports = { cloudinaryUploadImg, cloudinaryDeleteImg };