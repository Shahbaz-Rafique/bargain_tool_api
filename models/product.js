const mongoose = require('mongoose');

const Schema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        img: {
            type: String,
            required: true,
        },
        category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
        subcategory: {
            type: String,
            required: true,
        },
        detail: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

const Code = mongoose.model('Product', Schema);

module.exports = Code;
