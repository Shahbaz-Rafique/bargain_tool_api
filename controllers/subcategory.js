const SubCategory = require('../models/subcategory');

// Add a new subcategory
exports.addSubCategory = async (req, res, next) => {
  try {
    const { category, name } = req.body;
    const subcategory = new SubCategory({ category, name });
    await subcategory.save();
    res.status(200).json({ message: 'Subcategory added successfully', subcategory });
  } catch (error) {
    next(error);
  }
};

// Get all subcategories
exports.getAllSubCategories = async (req, res, next) => {
  try {
    const subcategories = await SubCategory.find().populate('category').exec();;
    res.status(200).json(subcategories);
  } catch (error) {
    next(error);
  }
};

// Get subcategory by ID
exports.getSubCategoryById = async (req, res, next) => {
  try {
    const subcategory = await SubCategory.findById(req.params.id).populate('category').exec();;
    if (!subcategory) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }
    res.status(200).json(subcategory);
  } catch (error) {
    next(error);
  }
};

// Update subcategory
exports.updateSubCategory = async (req, res, next) => {
  try {
    const { category, name } = req.body;
    const updatedSubCategory = await SubCategory.findByIdAndUpdate(req.params.id, { category, name }, { new: true });
    if (!updatedSubCategory) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }
    res.status(200).json({ message: 'Subcategory updated successfully', updatedSubCategory });
  } catch (error) {
    next(error);
  }
};

// Delete subcategory
exports.deleteSubCategory = async (req, res, next) => {
  try {
    const deletedSubCategory = await SubCategory.findByIdAndDelete(req.params.id);
    if (!deletedSubCategory) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }
    res.status(200).json({ message: 'Subcategory deleted successfully', deletedSubCategory });
  } catch (error) {
    next(error);
  }
};