const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        productName: {
            type: String,

        },
        productCatogary: {
            type: String,

        },
        desc: {
            type: String,
            max: 500,
        },
        price: {
            type: Number,
            max: 500,
        },
        img: {
            data: Buffer,
            contentType: String
        },
    },
    { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;