const express = require('express');
const { createProduct, getAllProducts,getProductById,updateProduct,deleteProduct,getProductsByCategory,buyProduct, storebuy, getOrders, addtoCart, getCart, deleteCart } = require('../controllers/product.js');

const router = express.Router();

router.post('/', createProduct);
router.post('/buy', buyProduct);
router.get('/storebuy', storebuy);
router.get('/getOrders', getOrders);
router.get('/deletecart/:id', deleteCart);
router.get('/getCart/:id', getCart);
router.post('/addtocart', addtoCart);
router.get('/:id', getProductById);
router.get('/category/:id', getProductsByCategory);
router.get('/', getAllProducts);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;