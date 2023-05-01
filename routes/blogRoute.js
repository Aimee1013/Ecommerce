// 创建路由模块
const express = require('express');
const router = express.Router();
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware')
const { uploadPhoto, blogImgResize } = require('../middlewares/uploadImages')
const {
  createBlog,
  getAllBlogs,
  updateBlog,
  getBlog,
  deleteBlog,
  liketheBlog,
  disliketheBlog,
  uploadImages,
} = require('../controller/blogCtrl')

router.post('/', authMiddleware, isAdmin, createBlog)
router.put('/upload/:id', authMiddleware, isAdmin, uploadPhoto.array('images', 10), blogImgResize, uploadImages)
router.get('/', getAllBlogs)
router.put('/likes', authMiddleware, liketheBlog)
router.put('/dislikes', authMiddleware, disliketheBlog)
router.put('/:id', authMiddleware, isAdmin, updateBlog)
router.get('/:id', getBlog)
router.delete('/:id', authMiddleware, isAdmin, deleteBlog)



module.exports = router;