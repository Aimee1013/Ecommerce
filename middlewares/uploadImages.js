const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs')


//文件上传参数配置
const multerStorage = multer.diskStorage({
  //文件存储路径
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/images'));
  },
  filename: function (req, file, cb) {
    // let type = file.originalname.split(".")[1]
    // cb(null, `${file.fieldname}-${Date.now().toString()}.${type}`)
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.filename + '-' + uniqueSuffix + '.jpeg');
  }
});


const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true)
  } else {
    cb({
      message: "Unsupported file format"
    }, false)
  }
}


// 文件上传实例
const uploadPhoto = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fieldSize: 2000000 }  //文件大小
})


const productImgResize = async (req, res, next) => {
  if (!req.files) return next();
  await Promise.all(req.files.map(async (file) => {
    await sharp(file.path).resize(300, 300).toFormat('jpeg').jpeg({ quality: 90 }).toFile(`public/images/products/${file.filename}`)
    fs.unlinkSync(`public/images/products/${file.filename}`)
  }));
  next();
};


const blogImgResize = async (req, res, next) => {
  if (!req.files) return next();
  await Promise.all(req.files.map(async (file) => {
    await sharp(file.path).resize(300, 300).toFormat('jpeg').jpeg({ quality: 90 }).toFile(`public/images/blogs/${file.filename}`)
    fs.unlinkSync(`public/images/blogs/${file.filename}`)
  }));
  next();
};

module.exports = { uploadPhoto, productImgResize, blogImgResize };