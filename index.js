const express = require('express')
//创建web服务器
const app = express();
const bodyParser = require('body-parser')
const dotenv = require('dotenv').config()
const PORT = process.env.PORT || 4000
// 连接mongodb数据库
const dbConnect = require('./config/dbConnect');
const authRouter = require('./routes/authRoute');
const productRouter = require('./routes/productRoute');
const blogRouter = require('./routes/blogRoute');
const categoryRouter = require('./routes/prodCategoryRoute');
const blogCategoryRouter = require('./routes/blogCateRoute')
const brandRouter = require('./routes/brandRoute')
const couponRouter = require('./routes/couponRoute')
const colorRouter = require('./routes/colorRoute')
const enquiryRouter = require('./routes/enquiryRoute')


const { notFound, errorHandler } = require("./middlewares/errorHandler");
const cookieParser = require('cookie-parser');
const morgan = require('morgan');



//监听客户端的请求，并向客户端响应具体的内容，第一个参数是URL
// app.get('/', (req, res) => {
//   //调用express提供的res.send()方法，向客户端响应内容
//   res.send('hello from server side')
// })

dbConnect()

app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())


app.use('/api/user', authRouter)
app.use('/api/product', productRouter)
app.use('/api/blog', blogRouter)
app.use('/api/category', categoryRouter)
app.use('/api/blogCategory', blogCategoryRouter)
app.use('/api/brand', brandRouter)
app.use('/api/coupon', couponRouter)
app.use('/api/color', colorRouter)
app.use('/api/enquiry', enquiryRouter)



app.use(notFound)
app.use(errorHandler)



// 启动web服务器
app.listen(PORT, () => {
  console.log(`express server running at ${PORT}`)
})
