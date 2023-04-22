// 创建路由模块
const express = require('express');
const router = express.Router();
const { isAdmin, authMiddleware } = require('../middlewares/authMiddleware')
const {
  createProduct,
  getaProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
} = require('../controller/productCtrl')


router.post('/', authMiddleware, isAdmin, createProduct)
router.get('/:id', getaProduct)
router.put('/:id', authMiddleware, isAdmin, updateProduct)
router.get('/', getAllProducts)
router.delete('/:id', authMiddleware, isAdmin, deleteProduct)







module.exports = router