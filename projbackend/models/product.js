const mongoose = require('mongoose')

const { ObjectId } = mongoose.Schema;

const productSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        maxlength : 32,
        trim : true
    },
    description : {
        type : String,
        required : true,
        trim : true,
        maxlength : 1500
    },
    price : {
        type : Number,
        required : true,
        maxlength : 32,
        trim : true
    },
    //linking to the catogary schema so that every product have a category
    category : {
        type : ObjectId,
        ref : "Category",
        required : true
    },
    stock : {
        type :Number
    },
    sold : {
        type :Number,
        default : 0
    },
    photo : {
        data : Buffer,
        contentType : String
    }
},{timestamps : true})


module.exports = mongoose.model("Product",productSchema)