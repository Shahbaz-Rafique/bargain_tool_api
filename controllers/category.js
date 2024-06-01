const Category = require('../models/category.js');

// Controller to create a new product
exports.createProduct = async (req, res, next) => {
  try {
    const product = new Category(req.body);
    await product.save();
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

// Controller to update a product
exports.updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedProduct = await Category.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

// Controller to get a single product by ID
exports.getProductById = async (req, res, next) => {
  try {
    const id = req.params.id;
    console.log(id)
    const product = await Category.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

// Controller to get all products
exports.getAllProducts = async (req, res, next) => {
  try {
    const products = await Category.find();
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

// Controller to delete a product
exports.deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Category.findByIdAndDelete(id);
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
};