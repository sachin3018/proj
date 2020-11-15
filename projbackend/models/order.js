const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema;


const ProductCartSchema = new mongoose.Schema({
    product : {
        type : ObjectId,
        ref : "Product"
    },
    naame : String,
    count : Number,
    price : Number,
});

const ProductCart = mongoose.model("ProductCart",ProductCartSchema);

const orderSchema = new mongoose.Schema({
    products : [ProductCartSchema],
    transaction_id  : { type : String},
    amount : {  type :Number },
    state : {
        type : String,
        default : "Processing",
        enum : ["Cancelled", "Processing", "Shipped","Delivered", "Revived"]
    },
    address : String,
    update : Date,
    user : {
        type : ObjectId,
        ref : "User"
    }
},{timestamps : true});


const Order = mongoose.model("Order",orderSchema);

module.exports = { Order, ProductCart};