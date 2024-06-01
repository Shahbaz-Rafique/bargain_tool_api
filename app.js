const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');

// Load environment variables
dotenv.config();

// Routes imports
const authRoute = require('./routes/auth');
const productRoute = require('./routes/product');
const categoryRoute = require('./routes/category');
const subCategoryRoute = require('./routes/subcategory');

// Create the Express app
const app = express();

// Database connection
const connect = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017");
    console.log('Connected to MongoDB.');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

// Handle MongoDB disconnection event
mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected.');
});

// Set middlewares
app.use(cors());
app.use(cookieParser());
app.use(express.json());

// Set routes
app.use('/auth', authRoute);
app.use('/product', productRoute);
app.use('/category', categoryRoute);
app.use('/subcategory', subCategoryRoute);

// General error handling middleware
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Something went wrong!';
  console.error('Error:', message);
  return res.status(status).json({
    success: false,
    status,
    message,
    stack: err.stack
  });
});

// Start server and connect to the database
const port = process.env.PORT || 8800;
app.listen(port, () => {
  connect();
  console.log(`Server listening on port ${port}.`);
});

module.exports = app;