const mongoose = require('mongoose');

const Schema = new mongoose.Schema(
    {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        quantity: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

const Cart = mongoose.model('Cart', Schema);

module.exports = Cart;
