const mongoose = require("mongoose");
var cartSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectID, ref: 'User' },
    totalPrice: { type: Number, default: 0 },
    items: [{
        item: { type: mongoose.Schema.Types.ObjectID, ref: 'Product' },
        qty: { type: Number, default: 1 },
        price: { type: Number, default: 0 }
    }]
})

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;