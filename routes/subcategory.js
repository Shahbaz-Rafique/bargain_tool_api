const express = require('express');
const { addSubCategory, getAllSubCategories,getSubCategoryById,updateSubCategory,deleteSubCategory } = require('../controllers/subcategory.js');

const router = express.Router();

router.post('/', addSubCategory);
router.get('/:id', getSubCategoryById);
router.get('/', getAllSubCategories);
router.put('/:id', updateSubCategory);
router.delete('/:id', deleteSubCategory);

module.exports = router;