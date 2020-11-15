const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true,
        maxlength : 32,
        unique : true
    }
},{timestamps : true})
// time stamp to recoard time in database

module.exports = mongoose.model("Category",categorySchema);