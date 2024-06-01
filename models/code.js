const mongoose = require('mongoose');

const Schema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    code: {
      type: Number,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const Code = mongoose.model('Code', Schema);

module.exports = Code;
