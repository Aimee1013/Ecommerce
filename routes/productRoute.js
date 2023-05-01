// 创建路由模块
const express = require('express');
const router = express.Router();
const { isAdmin, authMiddleware } = require('../middlewares/authMiddleware')
const { uploadPhoto, productImgResize } = require('../middlewares/uploadImages')
const {
  createProduct,
  getaProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  addToWishlist,
  rating,
  uploadImages,
  deleteImages,
} = require('../controller/productCtrl')


router.post('/', authMiddleware, isAdmin, createProduct)
router.put('/upload/', authMiddleware, isAdmin, uploadPhoto.array('images', 10), productImgResize, uploadImages)
router.put('/wishlist', authMiddleware, addToWishlist)
router.put('/rating', authMiddleware, rating)
router.get('/:id', getaProduct)
router.put('/:id', authMiddleware, isAdmin, updateProduct)
router.get('/', getAllProducts)
router.delete('/:id', authMiddleware, isAdmin, deleteProduct)
router.delete('/delete-img/:id', authMiddleware, isAdmin, deleteImages)




module.exports = router