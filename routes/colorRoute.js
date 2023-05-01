// 创建路由模块
const express = require('express');
const router = express.Router();
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware')

const {
  createColor,
  updateColor,
  deleteColor,
  getaColor,
  getAllColors,
} = require('../controller/colorCtrl')

router.post('/', authMiddleware, isAdmin, createColor);
router.get('/:id', getaColor);
router.get('/', getAllColors);
router.put('/:id', authMiddleware, isAdmin, updateColor);
router.delete('/:id', authMiddleware, isAdmin, deleteColor);





module.exports = router;