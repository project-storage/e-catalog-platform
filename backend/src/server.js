require('dotenv').config()
// Fix for Node.js 25+ compatibility where SlowBuffer is removed
const buffer = require('buffer');
if (!buffer.SlowBuffer) {
    buffer.SlowBuffer = require('buffer').Buffer;
}

const express = require('express')
const connectDB = require('./config/db.js')
const cors = require('cors')
const morgan = require('morgan')

const app = express()

// Connect to MongoDB
connectDB();

// middelwares
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

const userRouter = require('./routes/user.router.js')
const authRouter = require('./routes/auth.router.js')
const productRouter = require('./routes/product.router.js')
const categoryRouter = require('./routes/category.router.js')
const customerRouter = require('./routes/customer.router.js')
const orderRouter = require('./routes/order.router.js')

app.use('/api/user', userRouter)
app.use('/api/customer', customerRouter)
app.use('/api/auth', authRouter)
app.use('/api/product', productRouter)
app.use('/api/category', categoryRouter)
app.use('/api/order', orderRouter)

// Define routes
app.get('/', (req, res) => res.send('Hello World!'));

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));