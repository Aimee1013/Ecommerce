// 创建路由模块
const express = require('express');
const router = express.Router();
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware')

const {
  createBrand,
  updateBrand,
  deleteBrand,
  getaBrand,
  getAllBrands,
} = require('../controller/brandCtrl')

router.post('/', authMiddleware, isAdmin, createBrand);
router.get('/:id', getaBrand);
router.get('/', getAllBrands);
router.put('/:id', authMiddleware, isAdmin, updateBrand);
router.delete('/:id', authMiddleware, isAdmin, deleteBrand);





module.exports = router;