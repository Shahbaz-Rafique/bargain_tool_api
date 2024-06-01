const mongoose = require('mongoose');

const Schema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        }
    },
    { timestamps: true }
);

const Code = mongoose.model('Category', Schema);

module.exports = Code;