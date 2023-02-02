const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            require: true,
            min: 3,
            max: 20,
            unique: true
        },
        email: {
            type: String,
            require: true,
            max: 50,
            unique: true
        },
        password: {
            type: String,
            require: true,
            min: 6,
        },
        city: {
            type: String,
            require: true,
            min: 6,
        },
       pinNo: {
            type: String,
            require: true,
            min: 6,
        },
       state: {
            type: String,
            require: true,
            min: 6,
        },
        number: {
            type: Number,
            require: true,
            min: 6,
        },
        cart:{
            items:[{
                productId:{
                    type:mongoose.Types.ObjectId,
                    ref:'Product',
                    required:true
                },
                qty:{
                    type:Number,
                    required:true
                }
            }],
            totalPrice:Number
        }

    },
    { timestamps: true }
);


userSchema.methods.addToCart = function(Product){
    let Cart = this.cart;
    if(Cart.items.length==0){
        Cart.items.push({
            productId:product._id,qty:1
        })
        Cart.totalPrice=product.price
    }else{

    }
    console.log('user in schema',this)
    return this.save()
}

const productUser = mongoose.model("productUser", userSchema);
module.exports = productUser;