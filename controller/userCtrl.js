const User = require('../models/userModel');
const Product = require('../models/productModel');
const Cart = require('../models/cartModel');
const Coupon = require('../models/couponModel');
const Order = require('../models/orderModel');
const uniqid = require('uniqid');

const asyncHandler = require('express-async-handler');
const { generateToken } = require("../config/jwtToken");
const validateMongoDbId = require('../utils/validateMongodbId');
const { generateRefreshToken } = require("../config/refreshToken");
const jwt = require('jsonwebtoken');
const { sendEmail } = require("./emailCtrl");
const crypto = require('crypto');



// create a user
const createUser = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const findUser = await User.findOne({ email: email });
  if (!findUser) {
    // create a new user
    const newUser = await User.create(req.body);
    res.json(newUser)
  } else {
    // user already exists
    throw new Error('User Already Exists');
  }
});


// login a user
const loginUserCtrl = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // console.log(email, password)
  // check if user exists or not
  const findUser = await User.findOne({ email });
  // 若用户存在，验证密码是否正确
  if (findUser && (await findUser.isPasswordMatched(password))) {
    const refreshToken = await generateRefreshToken(findUser?._id);
    const updateUser = await User.findByIdAndUpdate(findUser.id, { refreshToken: refreshToken }, { new: true })
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.json({
      _id: findUser?._id,
      firstname: findUser?.firstname,
      lastname: findUser?.lastname,
      email: findUser?.email,
      mobile: findUser?.mobile,
      token: generateToken(findUser?._id),
    })
  } else {
    throw new Error('Invalid Credentials');
  }
});


// login admin
const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // console.log(email, password)
  // check if user exists or not
  const findAdmin = await User.findOne({ email });
  if (findAdmin !== 'admin') throw new Error('No Authorised')
  // 若用户存在，验证密码是否正确
  if (findAdmin && (await findAdmin.isPasswordMatched(password))) {
    const refreshToken = await generateRefreshToken(findAdmin?._id);
    const updateUser = await User.findByIdAndUpdate(findAdmin.id, { refreshToken: refreshToken }, { new: true })
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.json({
      _id: findAdmin?._id,
      firstname: findAdmin?.firstname,
      lastname: findAdmin?.lastname,
      email: findAdmin?.email,
      mobile: findAdmin?.mobile,
      token: generateToken(findAdmin?._id),
    })
  } else {
    throw new Error('Invalid Credentials');
  }
});



// handle refresh token
const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  // console.log(cookie);
  if (!cookie?.refreshToken) throw new Error('No Refresh Token in Cookies')
  const refreshToken = cookie.refreshToken
  // console.log(refreshToken)
  const user = await User.findOne({ refreshToken })
  if (!user) throw new Error('No Refresh Token present in db or Not Matched')
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    // console.log(decoded) 
    // { id: '643cfc8211500891cf06ebb9', iat: 1681732944, exp: 1681992144 }
    if (err || user.id !== decoded.id) {
      throw new Error('There is somrthing wrong with refresh token');
    } else {
      const accessToken = generateToken(user?._id)
      res.json({ accessToken })
    }
  })
})



// logout functionality
const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error('No Refresh Token in Cookies')
  const refreshToken = cookie.refreshToken
  const user = await User.findOne({ refreshToken })
  if (!user) {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
    })
    return res.sendStatus(204); // forbidden
  }
  await User.findOneAndUpdate(refreshToken, {
    refreshToken: '',
  })
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: true,
  })
  return res.sendStatus(204); // forbidden
})



// update a user
const updatedUser = asyncHandler(async (req, res) => {
  const { _id } = req.user
  validateMongoDbId(_id);
  try {
    const updatedUser = await User.findByIdAndUpdate(_id, {
      firstname: req?.body?.firstname,
      lastname: req?.body?.lastname,
      email: req?.body?.email,
      mobile: req?.body?.mobile,
    }, {
      new: true
    })
    res.json(updatedUser)
  } catch (error) {
    throw new Error(error)
  }
})


// save user address
const saveAddress = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const updatedUser = await User.findByIdAndUpdate(_id, {
      address: req?.body?.address,
    }, {
      new: true
    })
    res.json(updatedUser)
  } catch (error) {
    throw new Error(error)
  }
})


// get all users
const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const getUsers = await User.find();
    res.json(getUsers)
  } catch (error) {
    throw new Error(error)
  }
});


// get a single user
const getaUser = asyncHandler(async (req, res) => {
  const { id } = req.params
  validateMongoDbId(id);
  // console.log(id)
  try {
    const getaUser = await User.findById(id)
    res.json({ getaUser })
  } catch (error) {
    throw new Error(error)
  }
})


// delete a single user
const deleteaUser = asyncHandler(async (req, res) => {
  const { id } = req.params
  validateMongoDbId(id);
  // console.log(id)
  try {
    const deleteaUser = await User.findByIdAndDelete(id)
    res.json({ deleteaUser })
  } catch (error) {
    throw new Error(error)
  }
})


// block a user
const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params
  validateMongoDbId(id);
  try {
    const block = await User.findByIdAndUpdate(id,
      { isBlock: true },
      { new: true })
    res.json(block)
  } catch (error) {
    throw new Error(error)
  }
})


// unblock a user
const unblockUser = asyncHandler(async (req, res) => {
  const { id } = req.params
  validateMongoDbId(id);
  try {
    const unblock = await User.findByIdAndUpdate(id,
      { isBlock: false },
      { new: true })
    res.json({
      message: 'User UnBlocked'
    })
  } catch (error) {
    throw new Error(error)
  }
});


// update password
const updatePassword = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { password } = req.body;
  validateMongoDbId(_id);
  const user = await User.findById(_id);
  if (password) {
    user.password = password;
    const updatedPassword = await user.save();
    res.json(updatedPassword)
  } else {
    res.json(user);
  }
});


// forgot password
const forgotPasswordToken = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new Error('user not found with this email');
  try {
    const token = await user.createPasswordResetToken();
    await user.save();
    const resetURL = `Hi, please follow this link to reset your password, This link is valid till 10 mintues from now. <a href="localhost:5000/api/user/reset-password/${token}">click here<a/>`;
    const data = {
      to: email,
      text: 'Hey User',
      subject: 'Forgot Password Link',
      html: resetURL,
    }
    sendEmail(data);
    res.json(token);
  } catch (error) {
    throw new Error(error);
  }
});


// reset password
const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) throw new Error('Token Expired, Please try again later');
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  res.json(user);
});


// get wishlist
const getWishlist = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  try {
    const findUser = await User.findById(_id).populate('wishlist')
    res.json(findUser)
  } catch (error) {
    throw new Error(error)
  }
});


// user cart(add to cart)
const userCart = asyncHandler(async (req, res) => {
  const { cart } = req.body;
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    let products = [];
    const user = await User.findById(_id);
    // check if user already has products in cart
    const alreadyExistCart = await Cart.findOne({ orderby: user._id });
    if (alreadyExistCart) {
      alreadyExistCart.remove();
    }
    for (let i = 0; i < cart.length; i++) {
      let object = {};
      object.product = cart[i]._id;
      object.count = cart[i].count;
      object.color = cart[i].color;
      let getPrice = await Product.findById(cart[i]._id).select('price').exec();
      object.price = getPrice.price;
      products.push(object);
    }
    let cartTotal = 0;
    for (let i = 0; i < products.length; i++) {
      cartTotal = cartTotal + products[i].price * products[i].count;
    }
    console.log(products, cartTotal)
    let newCart = await new Cart({
      products,
      cartTotal,
      orderby: user?._id,
    }).save();
    res.json(newCart)
  } catch (error) {
    throw new Error(error)
  }
});


// get user cart
const getUserCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const cart = await Cart.findOne({ orderby: _id }).populate('products.product')
    res.json(cart);
  } catch (error) {
    throw new Error(error)
  }
});


// empty cart
const emptyCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const user = await User.findOne({ _id });
    const cart = await Cart.findOneAndRemove({ orderby: user._id });
    res.json(cart);
  } catch (error) {
    throw new Error(error);
  }
})


// apply coupon
const applyCoupon = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  const { coupon } = req.body;
  const validCoupon = await Coupon.findOne({ name: coupon });
  // console.log(validCoupon)
  if (validCoupon === null) {
    throw new Error('Invalid Coupon');
  }
  const user = await User.findOne({ _id });
  let { cartTotal } = await Cart.findOne({ orderby: user._id }).populate('products.product');
  let totalAfterDiscount = (cartTotal - (cartTotal * validCoupon.discount) / 100).toFixed(2);
  await Cart.findOneAndUpdate({ orderby: user._id }, { totalAfterDiscount }, { new: true })
  res.json(totalAfterDiscount);
})


// create order
const createOrder = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  const { COD, couponApplied } = req.body;
  try {
    if (!COD) throw new Error('create cash order failed');
    const user = await User.findById(_id);
    let userCart = await Cart.findOne({ orderby: user._id });
    let finalAmount = 0;
    if (couponApplied && userCart.totalAfterDiscount) {
      finalAmount = userCart.totalAfterDiscount;
    } else {
      finalAmount = userCart.cartTotal;
    }

    let newOrder = await new Order({
      products: userCart.products,
      paymentIntent: {
        id: uniqid(),
        method: 'COD',
        amount: finalAmount,
        status: 'Cash on Delivery',
        created: Date.now(),
        currency: 'usd'
      },
      orderby: user._id,
      orderStatus: 'Cash on Delivery',
    }).save();
    let update = userCart.products.map(item => {
      return {
        updateOne: {
          filter: { _id: item.product._id },
          update: { $inc: { quantity: -item.count, sold: +item.count } }
        }
      }
    })
    const updated = await Product.bulkWrite(update, {});
    res.json({ message: 'success' });
  } catch (error) {
    throw new Error(error);
  }
});


// get orders
const getOrders = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const userOrders = await Order.findOne({ orderby: _id }).populate('products.product').exec();
    res.json(userOrders);
  } catch (error) {
    throw new Error(error);
  }
});


// update order status
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const updatedOrderStatus = await Order.findByIdAndUpdate(id, {
      orderStatus: status,
      paymentIntent: { status: status }
    }, { new: true })
    res.json(updatedOrderStatus);
  } catch (error) {
    throw new Error(error);
  }
});



module.exports = {
  createUser,
  loginUserCtrl,
  getAllUsers,
  getaUser,
  deleteaUser,
  updatedUser,
  blockUser,
  unblockUser,
  handleRefreshToken,
  logout,
  updatePassword,
  forgotPasswordToken,
  resetPassword,
  loginAdmin,
  getWishlist,
  saveAddress,
  userCart,
  getUserCart,
  emptyCart,
  applyCoupon,
  createOrder,
  getOrders,
  updateOrderStatus,
}