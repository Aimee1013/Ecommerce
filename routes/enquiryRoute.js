// 创建路由模块
const express = require('express');
const router = express.Router();
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware')

const {
  createEnquiry,
  updateEnquiry,
  deleteEnquiry,
  getaEnquiry,
  getAllEnquirys,
} = require('../controller/enquiryCtrl')

router.post('/', createEnquiry);
router.get('/:id', getaEnquiry);
router.get('/', getAllEnquirys);
router.put('/:id', authMiddleware, isAdmin, updateEnquiry);
router.delete('/:id', authMiddleware, isAdmin, deleteEnquiry);





module.exports = router;