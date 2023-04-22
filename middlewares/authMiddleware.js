const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')


const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;
  if (req?.headers?.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
    try {
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        // console.log(decoded)
        // { id: '643a1f9f84689e5de4bf2dd4', iat: 1681530788, exp: 1681789988 }
        const user = await User.findById(decoded?.id);
        req.user = user;
        next();
      }
    } catch (error) {
      throw new Error('Not authorized token expired, plase login again')
    }
  } else {
    throw new Error('There is no token attached to header')
  }
});

const isAdmin = asyncHandler(async (req, res, next) => {
  // console.log(req.user)
  const { email } = req.user;
  const adminUser = await User.findOne({ email });
  if (adminUser.role !== 'admin') {
    throw new Error('Your are not an admin');
  } else {
    next();
  }
});

module.exports = { authMiddleware, isAdmin }