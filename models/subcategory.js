const mongoose = require('mongoose');

const Schema = new mongoose.Schema(
  {
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    name: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const Code = mongoose.model('SubCategory', Schema);

module.exports = Code;