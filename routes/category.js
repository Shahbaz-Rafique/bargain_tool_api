const express = require('express');
const { createProduct, getAllProducts,getProductById,updateProduct,deleteProduct } = require('../controllers/category.js');

const router = express.Router();

router.post('/', createProduct);
router.get('/:id', getProductById);
router.get('/', getAllProducts);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;