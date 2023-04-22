const { default: mongoose } = require('mongoose')

const dbConnect = () => {
  try {
    const conn = mongoose.connect(process.env.MONGODB_URL)
    console.log('Database Connected Successfully')
  } catch (error) {
    consolelog('Database error')
  }
}
module.exports = dbConnect;