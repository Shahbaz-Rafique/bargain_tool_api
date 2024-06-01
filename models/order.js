const mongoose = require('mongoose');

const Schema = new mongoose.Schema(
    {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
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

const Order = mongoose.model('Orders', Schema);

module.exports = Order;
