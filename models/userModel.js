// 生成model模板的快捷键：!mdbgum
const mongoose = require('mongoose'); // Erase if already required
const bcrypt = require('bcrypt')
const crypto = require('crypto')

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    unique: true,
  },
  lastname: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "user",
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  cart: {
    type: Array,
    default: [],
  },
  address: { type: String },
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  refreshToken: {
    type: String,
  },
  passwordChangeAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
},
  {
    timestamps: true
  });

// 每次向数据库中保存数据之前，需要进行同步或异步加密
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  // 同步加密方式
  //  生成salt的迭代次数
  const saltRounds = 10;
  //  随机生成salt
  const salt = bcrypt.genSaltSync(saltRounds);
  //  获取hash值并赋值给密码(使用随机字符串对密码进行加密)
  this.password = await bcrypt.hash(this.password, salt);
  next();
})

//验证密码：将客户端传递过来的密码和用户信息中的密码进行比对
userSchema.methods.isPasswordMatched = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.methods.createPasswordResetToken = async function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.passwordResetExpires = Date.now() + 30 * 60 * 1000;   // 10 minutes
  return resetToken;
}

//Export the model
module.exports = mongoose.model('User', userSchema);