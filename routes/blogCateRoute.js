// 创建路由模块
const express = require('express');
const router = express.Router();
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware')

const {
  createCategory,
  updateCategory,
  deleteCategory,
  getaCategory,
  getAllCategories,
} = require('../controller/blogCateCtrl')

router.post('/', authMiddleware, isAdmin, createCategory);
router.get('/:id', getaCategory);
router.get('/', getAllCategories);
router.put('/:id', authMiddleware, isAdmin, updateCategory);
router.delete('/:id', authMiddleware, isAdmin, deleteCategory);





module.exports = router;